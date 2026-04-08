import { useEffect, useState } from 'react'

interface UseCountUpProps {
    end: number
    duration?: number // in milliseconds
    decimals?: number
}

export function useCountUp({ end, duration = 2000, decimals = 0 }: UseCountUpProps): string {
    const [count, setCount] = useState<number>(0)

    useEffect(() => {
        let startTime: number | null = null
        const startValue = 0

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp
            const progress = Math.min((timestamp - startTime) / duration, 1)

            // Easing function: easeOutQuad
            const easedProgress = progress * (2 - progress)

            const currentValue = startValue + easedProgress * (end - startValue)
            setCount(currentValue)

            if (progress < 1) {
                window.requestAnimationFrame(animate)
            }
        };

        window.requestAnimationFrame(animate)
    }, [end, duration])

    return count.toFixed(decimals)
}
