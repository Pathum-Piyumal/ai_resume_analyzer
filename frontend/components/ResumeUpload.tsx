import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { UploadCloud, FileText, X, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface ResumeUploadProps {
  file: File | null
  onFileChange: (file: File | null) => void
}

export default function ResumeUpload({ file, onFileChange }: ResumeUploadProps) {
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'success'>('idle')
  const [progress, setProgress] = useState(0)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const droppedFile = acceptedFiles[0]
      setScanState('scanning')
      setProgress(0)

      let currentProgress = 0
      const interval = setInterval(() => {
        currentProgress += Math.floor(Math.random() * 15) + 8
        if (currentProgress >= 100) {
          currentProgress = 100
          clearInterval(interval)
          setScanState('success')
          setTimeout(() => {
            onFileChange(droppedFile)
            setScanState('idle')
          }, 1000)
        }
        setProgress(Math.min(currentProgress, 100))
      }, 100)
    }
  }, [onFileChange])

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false
  })

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation()
    onFileChange(null)
  }

  // Format file size
  const formatBytes = (bytes: number, decimals = 2) => {
    if (!bytes) return '0 Bytes'
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
  }

  return (
    <div className="w-full max-w-xl mx-auto mb-6">
      <div
        {...getRootProps()}
        className="focus:outline-none"
      >
        <input {...getInputProps()} disabled={scanState !== 'idle'} />
        <motion.div
          animate={isDragActive ? { scale: 1.02 } : { scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-8 cursor-pointer transition-all duration-300 min-h-[160px] overflow-hidden ${
            scanState !== 'idle'
              ? 'border-brand-blue/30 bg-brand-card/60 shadow-lg shadow-brand-blue/5 pointer-events-none'
              : file 
                ? 'border-brand-blue/40 bg-brand-card/70 shadow-lg shadow-brand-blue/5' 
                : isDragActive
                  ? 'border-brand-lightBlue bg-brand-blue/5 shadow-2xl shadow-brand-blue/10'
                  : 'border-white/10 bg-brand-card/40 hover:border-white/20 hover:bg-brand-card/60'
          }`}
        >

        {/* Laser scanner line */}
        {scanState === 'scanning' && (
          <motion.div
            initial={{ top: '0%' }}
            animate={{ top: ['0%', '98%', '0%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-lightBlue to-transparent shadow-[0_0_8px_rgba(56,189,248,0.8)] z-20 pointer-events-none"
          />
        )}

        <AnimatePresence mode="wait">
          {scanState === 'scanning' ? (
            <motion.div
              key="scanning"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-4 flex flex-col items-center justify-center z-10"
            >
              <div className="relative mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-blue/10 border border-brand-blue/20">
                <UploadCloud className="h-6 w-6 text-brand-lightBlue animate-pulse" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1.5 font-sans">
                Parsing Resume Document...
              </h3>
              <p className="text-[10px] text-brand-textMuted font-mono mb-3">
                Scanning file structure
              </p>
              
              {/* Progress bar */}
              <div className="w-36 h-1.5 bg-slate-800 rounded-full overflow-hidden border border-white/5">
                <div 
                  className="h-full bg-brand-lightBlue rounded-full transition-all duration-100 ease-out" 
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-[10px] font-mono text-brand-lightBlue mt-1.5">
                {progress}%
              </span>
            </motion.div>
          ) : scanState === 'success' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-4 flex flex-col items-center justify-center z-10"
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
              >
                <Check className="h-6 w-6" />
              </motion.div>
              <h3 className="text-sm font-bold text-emerald-400 mb-1 font-sans">
                Document Parsed!
              </h3>
              <p className="text-[10px] text-brand-textMuted font-sans">
                Extracting core text blocks
              </p>
            </motion.div>
          ) : file ? (
            <motion.div
              key="file-preview"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="flex items-center justify-between w-full p-4 bg-brand-dark/50 border border-white/5 rounded-lg z-10"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-brand-blue/10 text-brand-lightBlue">
                  <FileText className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-white truncate max-w-[280px] sm:max-w-[340px]">
                    {file.name}
                  </p>
                  <p className="text-xs text-brand-textMuted font-mono">
                    {formatBytes(file.size)}
                  </p>
                </div>
              </div>
              <button
                onClick={removeFile}
                className="p-1 rounded-full text-brand-textMuted hover:text-white hover:bg-white/10 transition-colors"
                title="Remove file"
                type="button"
              >
                <X className="h-5 w-5" />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="prompt"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-4 z-10"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-blue/5 text-brand-lightBlue border border-brand-blue/10 mb-4 transition-transform hover:scale-105 duration-300">
                <UploadCloud className="h-7 w-7 text-brand-lightBlue opacity-80" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1.5 font-sans">
                Upload Resume
              </h3>
              <p className="text-xs text-brand-textMuted font-sans">
                PDF, DOCX up to 10MB
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        </motion.div>
      </div>

      {fileRejections.length > 0 && (
        <p className="text-xs text-rose-500 font-medium mt-2 text-center">
          {fileRejections[0].errors[0].code === 'file-too-large'
            ? 'File is too large. Maximum size is 10MB.'
            : 'Invalid file format. Please upload PDF or DOCX.'}
        </p>
      )}
    </div>
  )
}
