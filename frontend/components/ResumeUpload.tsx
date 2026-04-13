import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { UploadCloud, FileText, X } from 'lucide-react'

interface ResumeUploadProps {
  file: File | null
  onFileChange: (file: File | null) => void
}

export default function ResumeUpload({ file, onFileChange }: ResumeUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      onFileChange(acceptedFiles[0])
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
        className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 cursor-pointer transition-all duration-300 ${
          file 
            ? 'border-brand-blue/40 bg-brand-card/70 shadow-lg shadow-brand-blue/5' 
            : isDragActive
              ? 'border-brand-lightBlue bg-brand-blue/5 scale-[1.01] shadow-2xl shadow-brand-blue/10'
              : 'border-white/10 bg-brand-card/40 hover:border-white/20 hover:bg-brand-card/60'
        }`}
      >
        <input {...getInputProps()} />

        {file ? (
          <div className="flex items-center justify-between w-full p-4 bg-brand-dark/50 border border-white/5 rounded-lg">
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
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-blue/5 text-brand-lightBlue border border-brand-blue/10 mb-4 transition-transform group-hover:scale-105">
              <UploadCloud className="h-7 w-7 text-brand-lightBlue opacity-80" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1.5 font-sans">
              Upload Resume
            </h3>
            <p className="text-xs text-brand-textMuted font-sans">
              PDF, DOCX up to 10MB
            </p>
          </div>
        )}
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
