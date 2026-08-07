import { CropSettings, ASPECT_RATIO_OPTIONS, DEFAULT_CROP_SETTINGS } from '../hooks/useSmartCrop'

interface CropControlsProps {
  settings:  CropSettings
  onChange:  <K extends keyof CropSettings>(key: K, value: CropSettings[K]) => void
  onReset:   () => void
  disabled?: boolean
}

// Aspect ratio visual preview dimensions (for the little box icons)
const RATIO_DIMS: Record<string, { w: number; h: number }> = {
  'free': { w: 14, h: 14 },
  '1:1':  { w: 14, h: 14 },
  '4:3':  { w: 16, h: 12 },
  '3:4':  { w: 12, h: 16 },
  '16:9': { w: 18, h: 10 },
  '9:16': { w: 10, h: 18 },
  '3:2':  { w: 15, h: 10 },
  '2:3':  { w: 10, h: 15 },
  '5:4':  { w: 15, h: 12 },
  '4:5':  { w: 12, h: 15 },
}

export default function CropControls({
  settings,
  onChange,
  onReset,
  disabled = false,
}: CropControlsProps) {
  const hasChanges = JSON.stringify(settings) !== JSON.stringify(DEFAULT_CROP_SETTINGS)
  const paddingPct = settings.paddingPct

  return (
    <div className="flex flex-col gap-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-primary uppercase tracking-wider">
          Crop Settings
        </h2>
        {hasChanges && (
          <button
            type="button"
            onClick={onReset}
            disabled={disabled}
            className="text-xs text-muted hover:text-magenta transition-colors disabled:opacity-40"
          >
            Reset
          </button>
        )}
      </div>

      {/* ── Aspect ratio grid ──────────────────────────────────────────── */}
      <div className="flex flex-col gap-2">
        <p className="text-xs text-muted font-medium">Aspect Ratio</p>
        <div className="grid grid-cols-5 gap-1.5" role="listbox" aria-label="Aspect ratio">
          {ASPECT_RATIO_OPTIONS.map(ratio => {
            const isActive = settings.aspectRatio === ratio
            const dims     = RATIO_DIMS[ratio] ?? { w: 14, h: 14 }
            return (
              <button
                key={ratio}
                role="option"
                aria-selected={isActive}
                disabled={disabled}
                onClick={() => onChange('aspectRatio', ratio)}
                className={`
                  flex flex-col items-center justify-center gap-1.5
                  py-2.5 rounded-lg border text-[10px] font-medium transition-all
                  focus:outline-none
                  ${isActive
                    ? 'border-magenta bg-magenta/10 text-magenta'
                    : 'border-border text-secondary hover:border-magenta/40 hover:text-primary'
                  }
                  ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                {/* Visual rectangle preview */}
                <div
                  className={`border-2 rounded-sm flex-shrink-0 ${isActive ? 'border-magenta' : 'border-current'}`}
                  style={{ width: dims.w, height: dims.h }}
                  aria-hidden="true"
                />
                <span>{ratio === 'free' ? 'Free' : ratio}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Padding slider ─────────────────────────────────────────────── */}
      <div className="flex flex-col gap-1.5 rounded-xl border border-border bg-surface p-4">
        <div className="flex items-center justify-between">
          <label htmlFor="padding-slider" className="text-sm font-medium text-secondary">
            Padding
          </label>
          <span className={`text-xs font-mono px-1.5 py-0.5 rounded ${
            paddingPct !== DEFAULT_CROP_SETTINGS.paddingPct
              ? 'bg-magenta/10 text-magenta'
              : 'bg-surface-raised text-muted'
          }`}>
            {Math.round(paddingPct * 100)}%
          </span>
        </div>
        <input
          id="padding-slider"
          type="range"
          min={0}
          max={0.5}
          step={0.01}
          value={paddingPct}
          disabled={disabled}
          onChange={e => onChange('paddingPct', Number(e.target.value))}
          aria-label="Subject padding"
          className="w-full disabled:opacity-40"
        />
        <div className="flex justify-between text-[10px] text-muted px-0.5" aria-hidden="true">
          <span>None</span>
          <span>50%</span>
        </div>
        <p className="text-[11px] text-muted mt-0.5 leading-snug">
          Extra space added around the detected subject.
        </p>
      </div>

      {/* ── Min size ──────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-1.5 rounded-xl border border-border bg-surface p-4">
        <div className="flex items-center justify-between">
          <label htmlFor="min-size-slider" className="text-sm font-medium text-secondary">
            Min Output Size
          </label>
          <span className={`text-xs font-mono px-1.5 py-0.5 rounded ${
            settings.minSize !== DEFAULT_CROP_SETTINGS.minSize
              ? 'bg-magenta/10 text-magenta'
              : 'bg-surface-raised text-muted'
          }`}>
            {settings.minSize}px
          </span>
        </div>
        <input
          id="min-size-slider"
          type="range"
          min={32}
          max={512}
          step={16}
          value={settings.minSize}
          disabled={disabled}
          onChange={e => onChange('minSize', Number(e.target.value))}
          aria-label="Minimum output size"
          className="w-full disabled:opacity-40"
        />
        <div className="flex justify-between text-[10px] text-muted px-0.5" aria-hidden="true">
          <span>32px</span>
          <span>512px</span>
        </div>
        <p className="text-[11px] text-muted mt-0.5 leading-snug">
          Smallest side length the output can be.
        </p>
      </div>

    </div>
  )
}
