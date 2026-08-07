import { Link } from 'react-router-dom'
import HistoryCard from '../components/HistoryCard'
import { useHistory } from '../hooks/useHistory'

export default function HistoryPage() {
  const { items, loading, error, deleteItem } = useHistory()

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

      {/* Page header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-primary tracking-tight">
            Processing History
          </h1>
          <p className="text-secondary text-sm mt-1">
            {items.length > 0
              ? `${items.length} processed image${items.length !== 1 ? 's' : ''} — click a card to download`
              : 'Your processed images will appear here'
            }
          </p>
        </div>

        <Link
          to="/"
          className="btn-primary shrink-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4" aria-hidden="true">
            <path d="M8.75 3.75a.75.75 0 00-1.5 0v3.5h-3.5a.75.75 0 000 1.5h3.5v3.5a.75.75 0 001.5 0v-3.5h3.5a.75.75 0 000-1.5h-3.5v-3.5z"/>
          </svg>
          New image
        </Link>
      </div>

      {/* Loading state */}
      {loading && (
        <div role="status" aria-live="polite" className="flex flex-col items-center gap-4 py-24">
          <div className="relative w-12 h-12">
            <svg className="absolute inset-0 w-12 h-12 animate-spin text-magenta" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48" aria-hidden="true">
              <circle className="opacity-15" cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-80" fill="currentColor" d="M44 24a20 20 0 00-20-20v4a16 16 0 0116 16h4z" />
            </svg>
          </div>
          <span className="text-muted text-sm">Loading history…</span>
          <span className="sr-only">Loading history…</span>
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div role="alert" className="flex items-start gap-3 rounded-lg border border-danger/40 bg-surface px-4 py-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-danger shrink-0 mt-0.5" aria-hidden="true">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.75-8.75a.75.75 0 011.5 0v3.5a.75.75 0 01-1.5 0v-3.5zm.75-1.5a1 1 0 110-2 1 1 0 010 2z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-sm font-medium text-danger">Failed to load history</p>
            <p className="text-xs text-secondary mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && items.length === 0 && (
        <div className="flex flex-col items-center gap-5 py-24 text-center animate-fade-up">
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-checker border border-border flex items-center justify-center shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.2" stroke="currentColor" className="w-10 h-10 text-muted" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5M4.5 3h15M5.25 3v18M18.75 3v18" />
              </svg>
            </div>
            {/* Small sparkle */}
            <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-magenta/15 border border-magenta/30 flex items-center justify-center" aria-hidden="true">
              <span className="text-[10px]">✨</span>
            </div>
          </div>

          <div>
            <p className="text-primary font-display font-semibold text-lg">No images yet</p>
            <p className="text-muted text-sm mt-1 max-w-xs">
              Upload and process your first image to see it here.
            </p>
          </div>

          <Link
            to="/"
            className="btn-primary"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4" aria-hidden="true">
              <path d="M8.75 3.75a.75.75 0 00-1.5 0v3.5h-3.5a.75.75 0 000 1.5h3.5v3.5a.75.75 0 001.5 0v-3.5h3.5a.75.75 0 000-1.5h-3.5v-3.5z"/>
            </svg>
            Upload an image
          </Link>
        </div>
      )}

      {/* History grid */}
      {!loading && !error && items.length > 0 && (
        <>
          {/* Stats bar */}
          <div className="flex items-center gap-3 mb-5 p-3 rounded-lg bg-surface border border-border text-sm text-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-magenta shrink-0" aria-hidden="true">
              <path d="M2 2.75A.75.75 0 012.75 2h1.5a.75.75 0 010 1.5h-1.5A.75.75 0 012 2.75zm0 4A.75.75 0 012.75 6h6.5a.75.75 0 010 1.5h-6.5A.75.75 0 012 6.75zm0 4a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5h-4.5A.75.75 0 012 10.75z"/>
              <path d="M11.5 2.5a1 1 0 011-1h1a1 1 0 011 1v11a1 1 0 01-1 1h-1a1 1 0 01-1-1v-11z"/>
            </svg>
            <span>
              <strong className="font-semibold text-primary">{items.length}</strong> image{items.length !== 1 ? 's' : ''} processed
            </span>
          </div>

          <ul
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
            aria-label="Processing history grid"
          >
            {items.map((item, idx) => (
              <li
                key={item.upload_id}
                className="animate-fade-up"
                style={{ animationDelay: `${idx * 40}ms` }}
              >
                <HistoryCard item={item} onDelete={deleteItem} />
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  )
}
