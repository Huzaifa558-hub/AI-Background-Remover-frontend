import React, { useState } from 'react'

interface ImageCanvasProps {
  /** URL of the original uploaded image (for comparison) */
  originalUrl: string
  /** URL of the processed transparent PNG */
  resultUrl: string
}

type View = 'result' | 'original' | 'split'

export default function ImageCanvas({ originalUrl, resultUrl }: ImageCanvasProps) {
  const [view, setView] = useState<View>('result')
  const [splitPos, setSplitPos] = useState(50) // % from left

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSplitPos(Number(e.target.value))
  }

  return (
    <div className="w-full flex flex-col gap-3">
      {/* View switcher */}
      <div className="flex items-center gap-1 self-center bg-surface-raised rounded-md p-1" role="tablist" aria-label="Image view">
        {(['result', 'original', 'split'] as View[]).map(v => (
          <button
            key={v}
            role="tab"
            aria-selected={view === v}
            onClick={() => setView(v)}
            className={`px-3 py-1 rounded text-xs font-medium capitalize transition-colors ${
              view === v
                ? 'bg-surface text-primary shadow-sm border border-border'
                : 'text-muted hover:text-primary'
            }`}
          >
            {v === 'split' ? 'Compare' : v}
          </button>
        ))}
      </div>

      {/* Canvas */}
      <div
        className="relative w-full overflow-hidden rounded-lg border border-border bg-checker"
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
            {/* Original (left) */}
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
            {/* Divider line */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-magenta pointer-events-none"
              style={{ left: `${splitPos}%` }}
              aria-hidden="true"
            />
            {/* Handle */}
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-magenta border-2 border-white shadow pointer-events-none"
              style={{ left: `${splitPos}%` }}
              aria-hidden="true"
            />
          </div>
        )}
      </div>

      {/* Slider — only in split mode */}
      {view === 'split' && (
        <div className="px-2">
          <label htmlFor="split-slider" className="sr-only">Comparison slider</label>
          <input
            id="split-slider"
            type="range"
            min={0}
            max={100}
            value={splitPos}
            onChange={handleSliderChange}
            className="w-full accent-magenta"
            aria-label="Slide to compare original and result"
          />
        </div>
      )}
    </div>
  )
}
