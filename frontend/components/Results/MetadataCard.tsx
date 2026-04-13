import { FileText, User, Calendar } from 'lucide-react'

interface MetadataCardProps {
  fileName?: string
  targetRole?: string
  analyzedOn?: string
  onViewPDF?: () => void
}

export default function MetadataCard({
  fileName = 'resume_v2_final.pdf',
  targetRole = 'Senior Software Engineer',
  analyzedOn = 'Oct 24, 2024',
  onViewPDF
}: MetadataCardProps) {
  return (
    <div className="rounded-2xl border border-white/5 bg-brand-card/45 p-6 backdrop-blur-md shadow-xl text-left space-y-5">
      
      {/* Title */}
      <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block font-sans">
        RESUME METADATA
      </h3>

      {/* Grid items list */}
      <div className="space-y-4 pt-1">
        {/* Filename */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-slate-800 text-slate-400 shrink-0">
            <FileText className="h-4.5 w-4.5" />
          </div>
          <div>
            <p className="text-[10px] text-brand-textMuted font-sans leading-none mb-1">
              Filename
            </p>
            <p className="text-xs font-bold text-white font-sans tracking-wide truncate max-w-[160px]">
              {fileName}
            </p>
          </div>
        </div>

        {/* Target Role */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-slate-800 text-slate-400 shrink-0">
            <User className="h-4.5 w-4.5" />
          </div>
          <div>
            <p className="text-[10px] text-brand-textMuted font-sans leading-none mb-1">
              Target Role
            </p>
            <p className="text-xs font-bold text-white font-sans tracking-wide">
              {targetRole}
            </p>
          </div>
        </div>

        {/* Date */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-slate-800 text-slate-400 shrink-0">
            <Calendar className="h-4.5 w-4.5" />
          </div>
          <div>
            <p className="text-[10px] text-brand-textMuted font-sans leading-none mb-1">
              Analyzed On
            </p>
            <p className="text-xs font-bold text-white font-sans tracking-wide">
              {analyzedOn}
            </p>
          </div>
        </div>
      </div>

      {/* Full-width action button */}
      <div className="pt-2">
        <button
          onClick={onViewPDF}
          className="w-full text-center rounded-xl border border-white/10 hover:border-white/20 bg-[#121626] hover:bg-slate-800/40 py-2.5 text-xs font-bold text-slate-300 hover:text-white transition-all active:scale-[0.98]"
          type="button"
        >
          View Original PDF
        </button>
      </div>

    </div>
  )
}
