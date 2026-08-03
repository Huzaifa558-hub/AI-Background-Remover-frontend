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
      if (rejected.length > 0) return // errors shown via fileRejections
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
          relative flex flex-col items-center justify-center gap-4
          min-h-[280px] rounded-lg border-2 border-dashed
          cursor-pointer transition-colors select-none
          ${isDragActive ? 'border-magenta bg-surface-raised' : 'border-border hover:border-border-strong bg-surface'}
          ${disabled ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        <input {...getInputProps()} />

        {/* Checkerboard hint circle */}
        <div className="w-20 h-20 rounded-full bg-checker flex items-center justify-center border border-border">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-9 h-9 text-muted" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
        </div>

        <div className="text-center px-6">
          <p className="font-display font-semibold text-primary">
            {isDragActive ? 'Drop it here' : 'Drag & drop an image'}
          </p>
          <p className="text-sm text-muted mt-1">or click to browse — JPEG, PNG, WebP up to 10 MB</p>
        </div>

        <button
          type="button"
          tabIndex={-1}
          className="pointer-events-none px-4 py-2 rounded-md bg-magenta text-white text-sm font-medium"
          aria-hidden="true"
        >
          Choose file
        </button>
      </div>

      {errorMsg && (
        <p role="alert" className="mt-2 text-sm text-danger text-center">
          {errorMsg}
        </p>
      )}
    </div>
  )
}
