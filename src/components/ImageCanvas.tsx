import { useState } from 'react'

interface ImageCanvasProps {
  originalUrl: string
  resultUrl: string
}

type View = 'result' | 'original' | 'split'

const viewLabels: Record<View, { label: string; icon: React.ReactNode }> = {
  result: {
    label: 'Result',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
        <path fillRule="evenodd" d="M8 1a7 7 0 100 14A7 7 0 008 1zm3.844 4.574a5.5 5.5 0 00-7.688 7.688L11.844 5.574zm1.06 1.06L3.514 12.844a5.5 5.5 0 007.689-7.689l1.701-1.521z" clipRule="evenodd"/>
      </svg>
    ),
  },
  original: {
    label: 'Original',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
        <path d="M2.5 3.5a.5.5 0 000 1h11a.5.5 0 000-1h-11zM2 7a1 1 0 011-1h10a1 1 0 110 2H3a1 1 0 01-1-1zm1 3a1 1 0 100 2h10a1 1 0 100-2H3z"/>
      </svg>
    ),
  },
  split: {
    label: 'Compare',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
        <path d="M8.75 1a.75.75 0 00-1.5 0v14a.75.75 0 001.5 0V1zM3 4.5A1.5 1.5 0 014.5 3h2a.75.75 0 010 1.5h-2v7h2a.75.75 0 010 1.5h-2A1.5 1.5 0 013 11.5v-7zM9.5 4.5h2A1.5 1.5 0 0113 6v4a1.5 1.5 0 01-1.5 1.5h-2a.75.75 0 010-1.5h2v-4h-2a.75.75 0 010-1.5z"/>
      </svg>
    ),
  },
}

export default function ImageCanvas({ originalUrl, resultUrl }: ImageCanvasProps) {
  const [view, setView] = useState<View>('result')
  const [splitPos, setSplitPos] = useState(50)

  return (
    <div className="w-full flex flex-col gap-3 animate-fade-up">
      {/* View switcher */}
      <div
        className="flex items-center gap-1 self-center bg-surface-raised border border-border rounded-lg p-1 shadow-sm"
        role="tablist"
        aria-label="Image view"
      >
        {(Object.entries(viewLabels) as [View, typeof viewLabels[View]][]).map(([v, { label, icon }]) => (
          <button
            key={v}
            role="tab"
            aria-selected={view === v}
            onClick={() => setView(v)}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium
              transition-all duration-150
              ${view === v
                ? 'bg-magenta text-white shadow-sm'
                : 'text-muted hover:text-secondary hover:bg-surface'
              }
            `}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>

      {/* Canvas */}
      <div
        className="relative w-full overflow-hidden rounded-xl border border-border bg-checker shadow-md"
        style={{ minHeight: 320 }}
        aria-label={`Image preview — ${view} view`}
      >
        {view === 'result' && (
          <img
            src={resultUrl}
            alt="Background removed result"
            className="w-full h-full object-contain max-h-[520px]"
          />
        )}

        {view === 'original' && (
          <img
            src={originalUrl}
            alt="Original uploaded image"
            className="w-full h-full object-contain max-h-[520px]"
          />
        )}

        {view === 'split' && (
          <div className="relative w-full" style={{ minHeight: 320 }}>
            {/* Original (left full) */}
            <img
              src={originalUrl}
              alt="Original"
              className="w-full object-contain max-h-[520px]"
            />
            {/* Result (right clip) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 0 0 ${splitPos}%)` }}
            >
              <div className="w-full h-full bg-checker">
                <img
                  src={resultUrl}
                  alt="Result"
                  className="w-full object-contain max-h-[520px]"
                />
              </div>
            </div>

            {/* Labels */}
            <div className="absolute top-3 left-3 px-2 py-0.5 rounded text-[11px] font-medium bg-black/60 text-white backdrop-blur-sm" aria-hidden="true">
              Original
            </div>
            <div
              className="absolute top-3 px-2 py-0.5 rounded text-[11px] font-medium bg-black/60 text-white backdrop-blur-sm"
              style={{ left: `calc(${splitPos}% + 12px)` }}
              aria-hidden="true"
            >
              Result
            </div>

            {/* Divider line */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-magenta pointer-events-none drop-shadow-lg"
              style={{ left: `${splitPos}%` }}
              aria-hidden="true"
            />
            {/* Handle knob */}
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-magenta border-2 border-white shadow-lg pointer-events-none flex items-center justify-center"
              style={{ left: `${splitPos}%` }}
              aria-hidden="true"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="white" className="w-3.5 h-3.5">
                <path d="M5.72 3.22a.75.75 0 011.06 1.06L4.56 6.5h6.88l-2.22-2.22a.75.75 0 011.06-1.06l3.5 3.5a.75.75 0 010 1.06l-3.5 3.5a.75.75 0 11-1.06-1.06l2.22-2.22H4.56l2.22 2.22a.75.75 0 11-1.06 1.06l-3.5-3.5a.75.75 0 010-1.06l3.5-3.5z"/>
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Split slider */}
      {view === 'split' && (
        <div className="px-2">
          <label htmlFor="split-slider" className="sr-only">Comparison slider position</label>
          <input
            id="split-slider"
            type="range"
            min={0}
            max={100}
            value={splitPos}
            onChange={e => setSplitPos(Number(e.target.value))}
            className="w-full"
            aria-label="Slide to compare original and result"
          />
          <div className="flex justify-between text-[11px] text-muted mt-1 px-0.5" aria-hidden="true">
            <span>Original</span>
            <span>Result</span>
          </div>
        </div>
      )}
    </div>
  )
}
