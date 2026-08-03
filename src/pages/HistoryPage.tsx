import React from 'react'
import HistoryCard from '../components/HistoryCard'
import { useHistory } from '../hooks/useHistory'
import { Link } from 'react-router-dom'

export default function HistoryPage() {
  const { items, loading, error, deleteItem } = useHistory()

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-primary">Processing History</h1>
          <p className="text-secondary text-sm mt-1">
            Your last {items.length || '—'} processed image{items.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          to="/"
          className="px-4 py-2 rounded-md bg-magenta hover:bg-magenta-hover text-white text-sm font-medium transition-colors focus:outline-none focus:shadow-focus"
        >
          + New image
        </Link>
      </div>

      {/* Loading */}
      {loading && (
        <div role="status" aria-live="polite" className="flex justify-center py-20">
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
          <span className="sr-only">Loading history…</span>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div role="alert" className="rounded-md border border-danger/40 px-4 py-3 text-sm text-danger text-center">
          {error}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && items.length === 0 && (
        <div className="flex flex-col items-center gap-4 py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-checker border border-border flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-9 h-9 text-muted" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5M4.5 3h15M5.25 3v18M18.75 3v18" />
            </svg>
          </div>
          <p className="text-secondary font-medium">No images yet</p>
          <p className="text-muted text-sm">Process your first image to see it here.</p>
          <Link
            to="/"
            className="mt-2 px-4 py-2 rounded-md bg-magenta hover:bg-magenta-hover text-white text-sm font-medium transition-colors focus:outline-none focus:shadow-focus"
          >
            Upload an image
          </Link>
        </div>
      )}

      {/* Grid */}
      {!loading && !error && items.length > 0 && (
        <ul
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
          aria-label="History grid"
        >
          {items.map(item => (
            <li key={item.upload_id}>
              <HistoryCard item={item} onDelete={deleteItem} />
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
