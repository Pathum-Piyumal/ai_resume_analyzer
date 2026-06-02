import { Sparkles, Loader2 } from 'lucide-react'

interface AnalyzeButtonProps {
  onClick: () => void
  disabled: boolean
  loading: boolean
}

export default function AnalyzeButton({ onClick, disabled, loading }: AnalyzeButtonProps) {
  return (
    <div className="w-full max-w-xl mx-auto mb-8">
      <button
        onClick={onClick}
        disabled={disabled || loading}
        className={`relative flex items-center justify-center gap-2 w-full rounded-xl py-3.5 px-6 font-semibold text-sm shadow-xl transition-all duration-300 ${
          disabled || loading
            ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5 shadow-none'
            : 'bg-brand-blue hover:bg-blue-600 text-white shadow-brand-blue/20 hover:scale-[1.01] hover:shadow-brand-blue/30 active:scale-[0.99]'
        }`}
        type="button"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-white/70" />
            <span>Processing Analysis...</span>
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4 text-brand-lightBlue animate-pulse" />
            <span>Analyze Now</span>
          </>
        )}
      </button>
    </div>
  )
}
