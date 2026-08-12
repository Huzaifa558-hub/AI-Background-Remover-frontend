import { useEffect, useRef, useState, useCallback } from 'react'

// ── Types ──────────────────────────────────────────────────────────────────

type ExportFormat = 'png' | 'jpeg' | 'webp'

interface FormatOption {
  id:          ExportFormat
  label:       string
  ext:         string
  icon:        string
  description: string
  lossless:    boolean
}

export interface ExportModalProps {
  /** e.g. /api/download/uuid_result.png */
  downloadUrl: string
  /** original stored filename (used to derive the stem) */
  filename:    string
  isOpen:      boolean
  onClose:     () => void
}

// ── Constants ──────────────────────────────────────────────────────────────

const FORMATS: FormatOption[] = [
  {
    id: 'png', label: 'PNG', ext: '.png', icon: '🖼️',
    description: 'Lossless — preserves transparency',
    lossless: true,
  },
  {
    id: 'jpeg', label: 'JPEG', ext: '.jpg', icon: '📷',
    description: 'Smaller size — best for photos',
    lossless: false,
  },
  {
    id: 'webp', label: 'WebP', ext: '.webp', icon: '⚡',
    description: 'Best compression — modern format',
    lossless: false,
  },
]

const DEFAULT_QUALITY = 90

// ── Size estimator ─────────────────────────────────────────────────────────

/**
 * Rough client-side size estimate so we can show useful feedback on every
 * slider drag without hitting the server.
 * Assumes a ~1 MP image (1000 × 1000 px) as baseline; scales linearly.
 * JPEG: ~0.5 bytes/px at q=100 down to ~0.05 at q=1
 * WebP: ~0.35 bytes/px at q=100
 */
function estimateSize(format: ExportFormat, quality: number): string {
  if (format === 'png') return 'Lossless (size depends on image content)'

  const factor = format === 'jpeg'
    ? 0.05 + (quality / 100) * 0.55
    : 0.03 + (quality / 100) * 0.40   // webp

  const bytes = 1_000_000 * factor    // 1 MP baseline
  if (bytes > 1_000_000) return `~${(bytes / 1_000_000).toFixed(1)} MB`
  return `~${Math.round(bytes / 1000)} KB`
}

// ── ExportModal ────────────────────────────────────────────────────────────

export default function ExportModal({
  downloadUrl,
  filename,
  isOpen,
  onClose,
}: ExportModalProps) {
  const [format,  setFormat]  = useState<ExportFormat>('png')
  const [quality, setQuality] = useState(DEFAULT_QUALITY)

  const modalRef    = useRef<HTMLDivElement>(null)
  const closeRef    = useRef<HTMLButtonElement>(null)
  const downloadRef = useRef<HTMLAnchorElement>(null)

  // ── Reset state when modal opens ─────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      setFormat('png')
      setQuality(DEFAULT_QUALITY)
      // Focus close button on open
      setTimeout(() => closeRef.current?.focus(), 50)
    }
  }, [isOpen])

  // ── Escape key close ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  // ── Trap focus inside modal ───────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen || !modalRef.current) return
    const focusable = modalRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const first = focusable[0]
    const last  = focusable[focusable.length - 1]

    const trap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus() }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', trap)
    return () => document.removeEventListener('keydown', trap)
  }, [isOpen])

  // ── Build download URL ────────────────────────────────────────────────────
  const buildUrl = useCallback((): string => {
    const base = downloadUrl.split('?')[0]
    const params = new URLSearchParams({ format })
    if (format !== 'png') params.set('quality', String(quality))
    return `${base}?${params}`
  }, [downloadUrl, format, quality])

  // ── Derive download filename ──────────────────────────────────────────────
  const buildFilename = (): string => {
    const fmt = FORMATS.find(f => f.id === format)!
    const stem = filename.replace(/\.[^.]+$/, '')
    return `${stem}${fmt.ext}`
  }

  const currentFmt  = FORMATS.find(f => f.id === format)!
  const isLossless  = currentFmt.lossless
  const sizeEstimate = estimateSize(format, quality)

  if (!isOpen) return null

  return (
    /* ── Backdrop ────────────────────────────────────────────────────────── */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-modal-title"
    >
      {/* ── Modal panel ───────────────────────────────────────────────────── */}
      <div
        ref={modalRef}
        className="relative w-full max-w-sm rounded-2xl border border-border bg-surface shadow-2xl
                   animate-fade-up"
        style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.45)' }}
      >
        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4
                        border-b border-border">
          <div>
            <h2
              id="export-modal-title"
              className="text-base font-display font-semibold text-primary"
            >
              Export Image
            </h2>
            <p className="text-xs text-muted mt-0.5">Choose format &amp; quality</p>
          </div>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Close export dialog"
            className="w-8 h-8 rounded-lg flex items-center justify-center
                       text-muted hover:text-primary hover:bg-surface-raised
                       transition-colors focus:outline-none focus:shadow-focus"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
              fill="currentColor" className="w-4 h-4" aria-hidden="true">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>

        {/* ── Body ────────────────────────────────────────────────────────── */}
        <div className="px-5 py-5 flex flex-col gap-5">

          {/* ── Format tabs ─────────────────────────────────────────────── */}
          <div>
            <p className="text-xs font-medium text-secondary uppercase tracking-widest mb-2.5">
              Format
            </p>
            <div
              className="grid grid-cols-3 gap-2"
              role="radiogroup"
              aria-label="Export format"
            >
              {FORMATS.map((fmt) => {
                const active = format === fmt.id
                return (
                  <button
                    key={fmt.id}
                    role="radio"
                    aria-checked={active}
                    id={`export-format-${fmt.id}`}
                    onClick={() => setFormat(fmt.id)}
                    className={`
                      flex flex-col items-center gap-1.5 px-2 py-3 rounded-xl
                      border text-center transition-all duration-150
                      focus:outline-none focus:shadow-focus
                      ${active
                        ? 'border-magenta bg-magenta/8 text-magenta'
                        : 'border-border bg-surface-raised text-secondary hover:border-border-strong hover:text-primary'
                      }
                    `}
                  >
                    <span className="text-xl" aria-hidden="true">{fmt.icon}</span>
                    <span className="text-sm font-semibold">{fmt.label}</span>
                    <span className="text-[10px] leading-snug opacity-70">{fmt.ext}</span>
                  </button>
                )
              })}
            </div>
            {/* Format description */}
            <p className="mt-2 text-xs text-muted text-center transition-all">
              {currentFmt.description}
            </p>
          </div>

          {/* ── Quality slider ──────────────────────────────────────────── */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <p className={`text-xs font-medium uppercase tracking-widest
                ${isLossless ? 'text-muted' : 'text-secondary'}`}>
                Quality
              </p>
              {isLossless ? (
                /* Tooltip badge for PNG */
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full
                             bg-surface-raised border border-border text-[10px] text-muted"
                  title="PNG is lossless — quality setting does not apply"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"
                    fill="currentColor" className="w-3 h-3" aria-hidden="true">
                    <path fillRule="evenodd" d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8zm6.5-.25A.75.75 0 017.25 7h1a.75.75 0 01.75.75v2.75h.25a.75.75 0 010 1.5h-2a.75.75 0 010-1.5h.25v-2h-.25a.75.75 0 01-.75-.75zM8 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                  Lossless — N/A
                </span>
              ) : (
                <span className="font-mono text-sm font-semibold text-primary tabular-nums">
                  {quality}%
                </span>
              )}
            </div>

            <div className="relative">
              <input
                id="export-quality-slider"
                type="range"
                min={1}
                max={100}
                step={1}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                disabled={isLossless}
                aria-label="Export quality"
                aria-valuemin={1}
                aria-valuemax={100}
                aria-valuenow={quality}
                aria-disabled={isLossless}
                className={`w-full ${isLossless ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
                style={{
                  background: isLossless
                    ? undefined
                    : `linear-gradient(to right, var(--accent-magenta) 0%, var(--accent-magenta) ${quality}%, var(--border-strong) ${quality}%, var(--border-strong) 100%)`,
                }}
              />
              {/* Quality labels */}
              {!isLossless && (
                <div className="flex justify-between mt-1">
                  <span className="text-[10px] text-muted">Low</span>
                  <span className="text-[10px] text-muted">High</span>
                </div>
              )}
              {/* PNG lossless note */}
              {isLossless && (
                <p className="mt-1.5 text-[11px] text-muted text-center">
                  PNG uses lossless compression — quality does not apply
                </p>
              )}
            </div>
          </div>

          {/* ── Size estimate ─────────────────────────────────────────────── */}
          <div className="flex items-center gap-2 rounded-lg bg-surface-raised
                          border border-border px-3.5 py-2.5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"
              fill="currentColor" className="w-3.5 h-3.5 text-teal shrink-0" aria-hidden="true">
              <path d="M3 3.5A1.5 1.5 0 014.5 2h4.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 01.439 1.061V12.5A1.5 1.5 0 0111.5 14h-7A1.5 1.5 0 013 12.5v-9z" />
            </svg>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted">Estimated size</p>
              <p className="text-xs font-medium text-primary truncate">{sizeEstimate}</p>
            </div>
          </div>
        </div>

        {/* ── Footer ──────────────────────────────────────────────────────── */}
        <div className="px-5 pb-5">
          <a
            ref={downloadRef}
            href={buildUrl()}
            download={buildFilename()}
            onClick={onClose}
            className="
              w-full flex items-center justify-center gap-2
              px-5 py-3 rounded-xl font-semibold text-sm text-white
              bg-magenta hover:bg-magenta-hover
              shadow-sm hover:shadow-md
              transition-all duration-200 active:scale-95
              focus:outline-none focus:shadow-focus
            "
            aria-label={`Download as ${currentFmt.label}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
              fill="currentColor" className="w-4 h-4" aria-hidden="true">
              <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
              <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
            </svg>
            Download {currentFmt.label}
            {!isLossless && (
              <span className="opacity-70 font-normal text-xs">({quality}%)</span>
            )}
          </a>
        </div>
      </div>
    </div>
  )
}
