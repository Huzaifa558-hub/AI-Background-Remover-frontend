import React, { useCallback } from 'react'
import { useDropzone, FileRejection } from 'react-dropzone'

interface UploadZoneProps {
  onFile: (file: File) => void
  disabled?: boolean
}

const ACCEPTED = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png':  ['.png'],
  'image/webp': ['.webp'],
}
const MAX_SIZE = 10 * 1024 * 1024 // 10 MB

export default function UploadZone({ onFile, disabled = false }: UploadZoneProps) {
  const onDrop = useCallback(
    (accepted: File[], rejected: FileRejection[]) => {
      if (rejected.length > 0) return
      if (accepted[0]) onFile(accepted[0])
    },
    [onFile],
  )

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: ACCEPTED,
    maxSize: MAX_SIZE,
    maxFiles: 1,
    disabled,
  })

  const errorMsg =
    fileRejections[0]?.errors[0]?.code === 'file-too-large'
      ? 'File exceeds 10 MB.'
      : fileRejections[0]?.errors[0]?.code === 'file-invalid-type'
      ? 'Unsupported format. Use JPEG, PNG, or WebP.'
      : null

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        aria-label="Drop zone — drag and drop an image here or click to browse"
        className={`
          relative flex flex-col items-center justify-center gap-5
          min-h-[300px] rounded-xl border-2 border-dashed
          cursor-pointer select-none overflow-hidden
          transition-all duration-200
          ${isDragActive
            ? 'border-magenta bg-magenta/5 scale-[1.01]'
            : 'border-border hover:border-magenta/50 bg-surface hover:bg-surface-raised'
          }
          ${disabled ? 'opacity-40 pointer-events-none' : ''}
        `}
      >
        <input {...getInputProps()} />

        {/* Background grid pattern */}
        <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(var(--border-strong) 1px, transparent 1px), linear-gradient(90deg, var(--border-strong) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
          aria-hidden="true"
        />

        {/* Corner accents */}
        {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((pos, i) => (
          <span
            key={i}
            className={`absolute ${pos} w-4 h-4 border-magenta pointer-events-none opacity-50
              ${i === 0 ? 'border-t-2 border-l-2 rounded-tl-lg' : ''}
              ${i === 1 ? 'border-t-2 border-r-2 rounded-tr-lg' : ''}
              ${i === 2 ? 'border-b-2 border-l-2 rounded-bl-lg' : ''}
              ${i === 3 ? 'border-b-2 border-r-2 rounded-br-lg' : ''}
            `}
            aria-hidden="true"
          />
        ))}

        {/* Icon */}
        <div className={`
          relative w-20 h-20 rounded-2xl flex items-center justify-center
          transition-all duration-200
          ${isDragActive
            ? 'bg-magenta/15 border-2 border-magenta/30'
            : 'bg-checker border border-border'
          }
        `}>
          {isDragActive ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
              className="w-9 h-9 text-magenta animate-bounce" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
              className="w-9 h-9 text-muted" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5M4.5 3h15M5.25 3v18M18.75 3v18" />
            </svg>
          )}
        </div>

        {/* Text content */}
        <div className="text-center px-8 z-10">
          <p className="font-display font-semibold text-lg text-primary">
            {isDragActive ? 'Release to process' : 'Drop your image here'}
          </p>
          <p className="text-sm text-muted mt-1.5">
            or click to browse &mdash; JPEG, PNG, WebP &bull; up to 10 MB
          </p>
        </div>

        {/* CTA button */}
        <button
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          className="pointer-events-none relative z-10 btn-primary gap-2 shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
            <path d="M9.25 13.25a.75.75 0 001.5 0V4.636l2.955 3.129a.75.75 0 001.09-1.03l-4.25-4.5a.75.75 0 00-1.09 0l-4.25 4.5a.75.75 0 101.09 1.03L9.25 4.636v8.614z" />
            <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
          </svg>
          Choose file
        </button>
      </div>

      {errorMsg && (
        <p role="alert" className="mt-2.5 text-sm text-danger text-center flex items-center justify-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 shrink-0" aria-hidden="true">
            <path fillRule="evenodd" d="M6.701 2.25c.577-1 2.02-1 2.598 0l5.196 9a1.5 1.5 0 01-1.299 2.25H2.804a1.5 1.5 0 01-1.3-2.25l5.197-9zM8 4a.75.75 0 01.75.75v3a.75.75 0 01-1.5 0v-3A.75.75 0 018 4zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
          {errorMsg}
        </p>
      )}
    </div>
  )
}
