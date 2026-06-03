import { useEffect, useRef } from 'react'
import { useMotionValue, useSpring, useTransform } from 'framer-motion'

interface NumberTickerProps {
  value: number
  suffix?: string
}

export default function NumberTicker({ value, suffix = '' }: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(0)
  
  const springValue = useSpring(motionValue, {
    stiffness: 55,
    damping: 15,
    mass: 0.8
  })
  
  const displayValue = useTransform(springValue, (latest) => Math.round(latest))

  useEffect(() => {
    motionValue.set(value)
  }, [value, motionValue])

  useEffect(() => {
    return displayValue.on('change', (latest) => {
      if (ref.current) {
        ref.current.textContent = latest.toLocaleString() + suffix
      }
    })
  }, [displayValue, suffix])

  return (
    <span ref={ref} className="font-mono font-extrabold text-white">
      0{suffix}
    </span>
  )
}
