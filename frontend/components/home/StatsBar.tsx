import { useCountUp } from '../../hooks/useCountUp'

interface StatItemProps {
  value: number
  suffix: string
  label: string
  decimals?: number
}

function StatItem({ value, suffix, label, decimals = 0 }: StatItemProps) {
  const animatedValue = useCountUp({ end: value, duration: 2500, decimals })

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center group">
      <div className="flex items-baseline font-sans text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-2">
        <span className="bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
          {animatedValue}
        </span>
        <span className="text-brand-lightBlue ml-0.5">{suffix}</span>
      </div>
      <p className="text-xs sm:text-sm font-semibold tracking-wide text-brand-textMuted uppercase">
        {label}
      </p>
    </div>
  )
}

export default function StatsBar() {
  return (
    <div className="relative border-y border-white/5 bg-brand-dark py-8">
      {/* Soft blue lighting */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-blue/5 to-transparent pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 divide-y md:divide-y-0 md:divide-x divide-white/10">
          <StatItem value={98} suffix="%" label="ATS Match Rate" />
          <StatItem value={1.2} suffix="M+" label="Resumes Optimized" decimals={1} />
          <StatItem value={42} suffix="%" label="Higher Callback Rate" />
          <StatItem value={10} suffix="x" label="Faster Application" />
        </div>
      </div>
    </div>
  )
}
