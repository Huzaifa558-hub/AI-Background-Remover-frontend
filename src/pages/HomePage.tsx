import React from 'react'
import UploadZone from '../components/UploadZone'
import ImageCanvas from '../components/ImageCanvas'
import DownloadButton from '../components/DownloadButton'
import { useUpload } from '../hooks/useUpload'

export default function HomePage() {
  const { status, result, originalUrl, error, upload, reset } = useUpload()

  const isUploading = status === 'uploading'
  const isDone      = status === 'success' && result !== null && originalUrl !== null

  return (
    <main className="max-w-2xl mx-auto px-4 py-10 flex flex-col gap-8">
      {/* Hero */}
      <div className="text-center">
        <h1 className="text-3xl font-display font-bold text-primary">
          Remove Backgrounds Instantly
        </h1>
        <p className="mt-2 text-secondary">
          Drop any photo — our AI isolates the subject and hands you a transparent PNG.
        </p>
      </div>

      {/* Upload / Result area */}
      {!isDone ? (
        <div className="flex flex-col gap-4">
          <UploadZone onFile={upload} disabled={isUploading} />

          {/* Processing state */}
          {isUploading && (
            <div
              role="status"
              aria-live="polite"
              className="flex flex-col items-center gap-3 py-6"
            >
              {/* Spinner */}
              <svg
                className="w-10 h-10 animate-spin text-magenta"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
              </svg>
              <p className="text-secondary text-sm font-medium">Removing background…</p>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div
              role="alert"
              className="rounded-md bg-surface border border-danger/40 px-4 py-3 text-sm text-danger text-center"
            >
              {error}
            </div>
          )}
        </div>
      ) : (
        /* Result */
        <div className="flex flex-col gap-5">
          <ImageCanvas
            originalUrl={originalUrl!}
            resultUrl={`/api/download/${result!.output_filename}`}
          />

          {/* Actions */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <button
              onClick={reset}
              className="px-4 py-2.5 rounded-md border border-border hover:border-border-strong text-secondary hover:text-primary text-sm font-medium transition-colors focus:outline-none focus:shadow-focus"
            >
              Remove another
            </button>
            <DownloadButton
              downloadUrl={`/api/download/${result!.output_filename}`}
              filename={result!.output_filename}
            />
          </div>
        </div>
      )}

      {/* Feature chips */}
      {!isDone && !isUploading && (
        <ul className="flex flex-wrap justify-center gap-2 text-xs text-muted" aria-label="Supported features">
          {['JPEG', 'PNG', 'WebP', 'Up to 10 MB', 'Transparent PNG output', 'Dark mode'].map(tag => (
            <li
              key={tag}
              className="px-2.5 py-1 bg-surface border border-border rounded-full"
            >
              {tag}
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
