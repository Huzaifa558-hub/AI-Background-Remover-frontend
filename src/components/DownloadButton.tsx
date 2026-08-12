import { useState } from 'react'
import ExportModal from './ExportModal'

interface DownloadButtonProps {
  downloadUrl: string
  filename?:   string
}

export default function DownloadButton({
  downloadUrl,
  filename = 'result.png',
}: DownloadButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* ── Trigger button ─────────────────────────────────────────────── */}
      <button
        id="export-download-button"
        onClick={() => setIsOpen(true)}
        className="
          inline-flex items-center gap-2 px-5 py-2.5 rounded-md font-medium text-sm
          bg-teal hover:bg-teal-hover text-white
          shadow-sm hover:shadow-md
          transition-all duration-200
          focus:outline-none focus:shadow-focus
          active:scale-95
        "
        aria-label="Open export options"
        aria-haspopup="dialog"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-4 h-4"
          aria-hidden="true"
        >
          <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
          <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
        </svg>
        Export
        {/* Small chevron to hint a popup */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="w-3 h-3 opacity-70"
          aria-hidden="true"
        >
          <path fillRule="evenodd" d="M4.22 6.22a.75.75 0 011.06 0L8 8.94l2.72-2.72a.75.75 0 111.06 1.06l-3.25 3.25a.75.75 0 01-1.06 0L4.22 7.28a.75.75 0 010-1.06z" clipRule="evenodd" />
        </svg>
      </button>

      {/* ── Export modal ───────────────────────────────────────────────── */}
      <ExportModal
        downloadUrl={downloadUrl}
        filename={filename}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  )
}
