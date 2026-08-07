import { useCallback } from 'react'
import { useDropzone, FileRejection } from 'react-dropzone'
import {
  BgSettings,
  BgType,
  GradientDir,
  BgFit,
  DEFAULT_BG_SETTINGS,
} from '../hooks/useReplaceBg'

// ── Types ──────────────────────────────────────────────────────────────────

interface BackgroundPickerProps {
  settings:  BgSettings
  onChange:  <K extends keyof BgSettings>(key: K, value: BgSettings[K]) => void
  onReset:   () => void
  disabled?: boolean
}

// ── Preset palettes ────────────────────────────────────────────────────────

const SOLID_PRESETS = [
  { label: 'White',       color: '#ffffff' },
  { label: 'Black',       color: '#000000' },
  { label: 'Slate',       color: '#1e293b' },
  { label: 'Cream',       color: '#fefce8' },
  { label: 'Sky',         color: '#e0f2fe' },
  { label: 'Mint',        color: '#d1fae5' },
  { label: 'Blush',       color: '#ffe4e6' },
  { label: 'Lavender',    color: '#ede9fe' },
  { label: 'Magenta',     color: '#e8336d' },
  { label: 'Teal',        color: '#2fbfb0' },
  { label: 'Gold',        color: '#f59e0b' },
  { label: 'Transparent', color: '#00000000' },
]

const GRADIENT_PRESETS: { label: string; start: string; end: string; dir: GradientDir }[] = [
  { label: 'Brand',    start: '#e8336d', end: '#2fbfb0', dir: 'diagonal'   },
  { label: 'Sunset',   start: '#f97316', end: '#e8336d', dir: 'vertical'   },
  { label: 'Ocean',    start: '#0ea5e9', end: '#2fbfb0', dir: 'horizontal' },
  { label: 'Forest',   start: '#16a34a', end: '#0ea5e9', dir: 'vertical'   },
  { label: 'Dusk',     start: '#7c3aed', end: '#e8336d', dir: 'diagonal'   },
  { label: 'Gold',     start: '#f59e0b', end: '#f97316', dir: 'horizontal' },
  { label: 'Night',    start: '#0f172a', end: '#1e293b', dir: 'vertical'   },
  { label: 'Peach',    start: '#fdba74', end: '#fda4af', dir: 'diagonal'   },
]

const DIR_OPTIONS: { value: GradientDir; label: string }[] = [
  { value: 'vertical',   label: '↕ Vertical'   },
  { value: 'horizontal', label: '↔ Horizontal' },
  { value: 'diagonal',   label: '↗ Diagonal'   },
]

const FIT_OPTIONS: { value: BgFit; label: string; desc: string }[] = [
  { value: 'cover',   label: 'Cover',   desc: 'Fill & crop' },
  { value: 'contain', label: 'Contain', desc: 'Letterbox'   },
  { value: 'stretch', label: 'Stretch', desc: 'Distort fit' },
]

// ── Tab bar ────────────────────────────────────────────────────────────────

const TABS: { value: BgType; label: string; icon: string }[] = [
  { value: 'solid',    label: 'Solid',    icon: '■' },
  { value: 'gradient', label: 'Gradient', icon: '▦' },
  { value: 'image',    label: 'Image',    icon: '🖼' },
]

// ── Gradient preview helper ────────────────────────────────────────────────

function gradientStyle(start: string, end: string, dir: GradientDir): React.CSSProperties {
  const angles: Record<GradientDir, string> = {
    vertical:   'to bottom',
    horizontal: 'to right',
    diagonal:   'to bottom right',
  }
  return { background: `linear-gradient(${angles[dir]}, ${start}, ${end})` }
}

// ── Image drop zone (internal) ─────────────────────────────────────────────

interface BgDropZoneProps {
  file:     File | null
  onChange: (file: File | null) => void
  disabled: boolean
}

function BgDropZone({ file, onChange, disabled }: BgDropZoneProps) {
  const previewUrl = file ? URL.createObjectURL(file) : null

  const onDrop = useCallback(
    (accepted: File[], rejected: FileRejection[]) => {
      if (rejected.length > 0 || !accepted[0]) return
      onChange(accepted[0])
    },
    [onChange],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [], 'image/webp': [] },
    maxSize: 20 * 1024 * 1024,
    maxFiles: 1,
    disabled,
  })

  return (
    <div className="flex flex-col gap-2">
      <div
        {...getRootProps()}
        className={`
          relative flex flex-col items-center justify-center gap-2
          min-h-[120px] rounded-xl border-2 border-dashed cursor-pointer
          transition-all duration-200 overflow-hidden
          ${isDragActive
            ? 'border-magenta bg-magenta/5'
            : 'border-border hover:border-magenta/50 bg-surface-raised'
          }
          ${disabled ? 'opacity-40 pointer-events-none' : ''}
        `}
      >
        <input {...getInputProps()} />

        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Background preview"
            className="absolute inset-0 w-full h-full object-cover rounded-lg opacity-60"
          />
        ) : null}

        <div className="relative z-10 text-center px-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className={`w-7 h-7 mx-auto mb-1 ${previewUrl ? 'text-white' : 'text-muted'}`}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5M4.5 3h15M5.25 3v18M18.75 3v18" />
          </svg>
          <p className={`text-xs font-medium ${previewUrl ? 'text-white drop-shadow' : 'text-secondary'}`}>
            {previewUrl ? file!.name : 'Drop or click to choose background'}
          </p>
          {!previewUrl && (
            <p className="text-[10px] text-muted mt-0.5">JPEG, PNG, WebP · max 20 MB</p>
          )}
        </div>
      </div>

      {file && (
        <button
          type="button"
          onClick={() => onChange(null)}
          disabled={disabled}
          className="text-xs text-muted hover:text-danger transition-colors self-end"
        >
          Remove image
        </button>
      )}
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────

export default function BackgroundPicker({
  settings,
  onChange,
  onReset,
  disabled = false,
}: BackgroundPickerProps) {
  const hasChanges = JSON.stringify(settings) !== JSON.stringify(DEFAULT_BG_SETTINGS)

  return (
    <div className="flex flex-col gap-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-primary uppercase tracking-wider">
          Background
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

      {/* Tab switcher */}
      <div
        className="flex items-center gap-1 bg-surface-raised border border-border rounded-lg p-1"
        role="tablist"
        aria-label="Background type"
      >
        {TABS.map(({ value, label, icon }) => (
          <button
            key={value}
            role="tab"
            aria-selected={settings.bgType === value}
            disabled={disabled}
            onClick={() => onChange('bgType', value)}
            className={`
              flex-1 flex items-center justify-center gap-1.5
              px-2 py-1.5 rounded-md text-xs font-medium transition-all
              ${settings.bgType === value
                ? 'bg-magenta text-white shadow-sm'
                : 'text-muted hover:text-secondary hover:bg-surface'
              }
              disabled:opacity-40 disabled:cursor-not-allowed
            `}
          >
            <span aria-hidden="true">{icon}</span>
            {label}
          </button>
        ))}
      </div>

      {/* ── Solid panel ─────────────────────────────────────────────────── */}
      {settings.bgType === 'solid' && (
        <div className="flex flex-col gap-3 animate-fade-up" role="tabpanel">

          {/* Preset swatches */}
          <div>
            <p className="text-xs text-muted mb-2">Presets</p>
            <div className="grid grid-cols-6 gap-1.5" role="listbox" aria-label="Colour presets">
              {SOLID_PRESETS.map(({ label, color }) => {
                const isActive = settings.solidColor === color
                const isTransparent = color === '#00000000'
                return (
                  <button
                    key={color}
                    role="option"
                    aria-selected={isActive}
                    aria-label={label}
                    disabled={disabled}
                    onClick={() => onChange('solidColor', color)}
                    title={label}
                    className={`
                      w-full aspect-square rounded-md border-2 transition-all
                      hover:scale-110 focus:outline-none focus:ring-2 focus:ring-magenta
                      ${isActive ? 'border-magenta scale-110 shadow-md' : 'border-border'}
                      ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                    style={
                      isTransparent
                        ? {
                            backgroundImage:
                              'linear-gradient(45deg,#ccc 25%,transparent 25%),' +
                              'linear-gradient(-45deg,#ccc 25%,transparent 25%),' +
                              'linear-gradient(45deg,transparent 75%,#ccc 75%),' +
                              'linear-gradient(-45deg,transparent 75%,#ccc 75%)',
                            backgroundSize: '8px 8px',
                            backgroundPosition: '0 0,0 4px,4px -4px,-4px 0',
                            backgroundColor: '#fff',
                          }
                        : { backgroundColor: color }
                    }
                  />
                )
              })}
            </div>
          </div>

          {/* Custom colour input */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="solid-color-input" className="text-xs text-muted">
              Custom colour
            </label>
            <div className="flex items-center gap-2">
              <input
                id="solid-color-input"
                type="color"
                value={settings.solidColor.slice(0, 7)}   // <input type=color> needs 6-digit hex
                disabled={disabled}
                onChange={e => onChange('solidColor', e.target.value)}
                className="w-9 h-9 rounded-md border border-border cursor-pointer bg-transparent disabled:opacity-40"
                aria-label="Pick a custom colour"
              />
              <input
                type="text"
                value={settings.solidColor}
                disabled={disabled}
                maxLength={9}
                onChange={e => onChange('solidColor', e.target.value)}
                className="flex-1 px-2.5 py-1.5 rounded-md border border-border bg-surface-raised text-sm font-mono text-primary focus:outline-none focus:border-magenta disabled:opacity-40"
                aria-label="Hex colour value"
                placeholder="#rrggbb"
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Gradient panel ──────────────────────────────────────────────── */}
      {settings.bgType === 'gradient' && (
        <div className="flex flex-col gap-4 animate-fade-up" role="tabpanel">

          {/* Gradient preview */}
          <div
            className="w-full h-16 rounded-xl border border-border shadow-sm"
            style={gradientStyle(settings.gradientStart, settings.gradientEnd, settings.gradientDir)}
            aria-hidden="true"
          />

          {/* Presets */}
          <div>
            <p className="text-xs text-muted mb-2">Presets</p>
            <div className="grid grid-cols-4 gap-2">
              {GRADIENT_PRESETS.map(({ label, start, end, dir }) => {
                const isActive =
                  settings.gradientStart === start &&
                  settings.gradientEnd   === end   &&
                  settings.gradientDir   === dir
                return (
                  <button
                    key={label}
                    disabled={disabled}
                    onClick={() => {
                      onChange('gradientStart', start)
                      onChange('gradientEnd',   end)
                      onChange('gradientDir',   dir)
                    }}
                    title={label}
                    className={`
                      h-10 rounded-lg border-2 transition-all text-[10px] font-medium
                      hover:scale-105 focus:outline-none
                      ${isActive
                        ? 'border-magenta scale-105 shadow-md text-white'
                        : 'border-border text-transparent hover:text-white/80'
                      }
                      ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                    style={gradientStyle(start, end, dir)}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Custom colours */}
          <div className="grid grid-cols-2 gap-3">
            {(
              [
                { id: 'grad-start', label: 'Start colour', key: 'gradientStart' },
                { id: 'grad-end',   label: 'End colour',   key: 'gradientEnd'   },
              ] as const
            ).map(({ id, label, key }) => (
              <div key={id} className="flex flex-col gap-1">
                <label htmlFor={id} className="text-xs text-muted">{label}</label>
                <div className="flex items-center gap-1.5">
                  <input
                    id={id}
                    type="color"
                    value={settings[key]}
                    disabled={disabled}
                    onChange={e => onChange(key, e.target.value)}
                    className="w-8 h-8 rounded border border-border cursor-pointer bg-transparent disabled:opacity-40"
                  />
                  <input
                    type="text"
                    value={settings[key]}
                    disabled={disabled}
                    maxLength={7}
                    onChange={e => onChange(key, e.target.value)}
                    className="flex-1 min-w-0 px-2 py-1 rounded border border-border bg-surface-raised text-xs font-mono text-primary focus:outline-none focus:border-magenta disabled:opacity-40"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Direction */}
          <div className="flex flex-col gap-1.5">
            <p className="text-xs text-muted">Direction</p>
            <div className="flex gap-2">
              {DIR_OPTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  disabled={disabled}
                  onClick={() => onChange('gradientDir', value)}
                  className={`
                    flex-1 py-1.5 rounded-md border text-xs font-medium transition-all
                    ${settings.gradientDir === value
                      ? 'bg-magenta border-magenta text-white'
                      : 'border-border text-secondary hover:border-magenta/40 hover:text-primary'
                    }
                    disabled:opacity-40 disabled:cursor-not-allowed
                  `}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Image panel ─────────────────────────────────────────────────── */}
      {settings.bgType === 'image' && (
        <div className="flex flex-col gap-4 animate-fade-up" role="tabpanel">
          <BgDropZone
            file={settings.bgFile}
            onChange={f => onChange('bgFile', f)}
            disabled={disabled}
          />

          {/* Fit mode */}
          <div className="flex flex-col gap-1.5">
            <p className="text-xs text-muted">Fit mode</p>
            <div className="flex gap-2">
              {FIT_OPTIONS.map(({ value, label, desc }) => (
                <button
                  key={value}
                  disabled={disabled}
                  onClick={() => onChange('bgFit', value)}
                  className={`
                    flex-1 flex flex-col items-center py-2 rounded-lg border text-xs
                    transition-all
                    ${settings.bgFit === value
                      ? 'bg-magenta/10 border-magenta text-magenta'
                      : 'border-border text-secondary hover:border-magenta/40'
                    }
                    disabled:opacity-40 disabled:cursor-not-allowed
                  `}
                >
                  <span className="font-medium">{label}</span>
                  <span className="text-[10px] opacity-70 mt-0.5">{desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
