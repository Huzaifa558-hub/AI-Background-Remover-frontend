import React from 'react'
import type { HistoryItem } from '../hooks/useHistory'

interface HistoryCardProps {
  item: HistoryItem
  onDelete: (uploadId: string) => void
}

export default function HistoryCard({ item, onDelete }: HistoryCardProps) {
  const downloadUrl = `/api/download/${item.output_filename}`
  const previewUrl  = downloadUrl

  const formattedDate = item.created_at
    ? new Date(item.created_at).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : 'Unknown date'

  return (
    <article className="bg-surface border border-border rounded-lg overflow-hidden flex flex-col">
      {/* Preview */}
      <div className="bg-checker aspect-video flex items-center justify-center overflow-hidden">
        <img
          src={previewUrl}
          alt={`Result for ${item.original_name}`}
          className="max-w-full max-h-full object-contain"
          loading="lazy"
        />
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-2">
        <p
          className="text-sm font-medium text-primary truncate"
          title={item.original_name}
        >
          {item.original_name}
        </p>
        <p className="text-xs text-muted">{formattedDate}</p>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-1">
          <a
            href={downloadUrl}
            download={item.output_filename}
            className="flex-1 text-center px-3 py-1.5 rounded bg-teal hover:bg-teal-hover text-white text-xs font-medium transition-colors focus:outline-none focus:shadow-focus"
            aria-label={`Download ${item.original_name}`}
          >
            Download
          </a>
          <button
            onClick={() => onDelete(item.upload_id)}
            className="px-3 py-1.5 rounded border border-border hover:border-danger hover:text-danger text-secondary text-xs font-medium transition-colors focus:outline-none focus:shadow-focus"
            aria-label={`Delete ${item.original_name}`}
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  )
}
