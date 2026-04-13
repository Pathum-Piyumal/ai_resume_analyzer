import { CheckCircle2, MinusCircle } from 'lucide-react'

interface ATSChecklistCardProps {
  formatCheck?: boolean
  contactCheck?: boolean
  densityCheck?: boolean
}

export default function ATSChecklistCard({
  formatCheck = true,
  contactCheck = true,
  densityCheck = false
}: ATSChecklistCardProps) {
  return (
    <div className="rounded-2xl border border-white/5 bg-brand-card/45 p-6 backdrop-blur-md shadow-xl text-left space-y-5">
      
      {/* Title */}
      <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block font-sans">
        ATS CHECKLIST
      </h3>

      {/* Checklist items */}
      <div className="space-y-3 pt-1">
        {/* File Format */}
        <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-brand-dark/50 border border-white/5">
          <span className="text-xs font-semibold text-slate-300 font-sans">
            File Format
          </span>
          {formatCheck ? (
            <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
          ) : (
            <MinusCircle className="h-4.5 w-4.5 text-rose-500 shrink-0" />
          )}
        </div>

        {/* Contact Info */}
        <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-brand-dark/50 border border-white/5">
          <span className="text-xs font-semibold text-slate-300 font-sans">
            Contact Info
          </span>
          {contactCheck ? (
            <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
          ) : (
            <MinusCircle className="h-4.5 w-4.5 text-rose-500 shrink-0" />
          )}
        </div>

        {/* Keyword Density */}
        <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-brand-dark/50 border border-white/5">
          <span className="text-xs font-semibold text-slate-300 font-sans">
            Keyword Density
          </span>
          {densityCheck ? (
            <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
          ) : (
            <MinusCircle className="h-4.5 w-4.5 text-amber-500 shrink-0" />
          )}
        </div>
      </div>

    </div>
  )
}
