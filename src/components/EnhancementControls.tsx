import { EnhanceSettings, DEFAULT_SETTINGS } from '../hooks/useEnhance'

interface EnhancementControlsProps {
  settings: EnhanceSettings
  onChange: <K extends keyof EnhanceSettings>(key: K, value: EnhanceSettings[K]) => void
  onReset: () => void
  disabled?: boolean
}

// ── Slider row ────────────────────────────────────────────────────────────────
interface SliderRowProps {
  id: string
  label: string
  value: number
  min: number
  max: number
  step: number
  defaultValue: number
  disabled: boolean
  onChange: (v: number) => void
  formatValue?: (v: number) => string
}

function SliderRow({
  id, label, value, min, max, step, defaultValue,
  disabled, onChange, formatValue,
}: SliderRowProps) {
  const isChanged = value !== defaultValue
  const display   = formatValue ? formatValue(value) : value.toFixed(2)

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className={`text-sm font-medium transition-colors ${
            isChanged ? 'text-primary' : 'text-secondary'
          }`}
        >
          {label}
        </label>
        <span
          className={`text-xs font-mono px-1.5 py-0.5 rounded transition-colors ${
            isChanged
              ? 'bg-magenta/10 text-magenta'
              : 'bg-surface-raised text-muted'
          }`}
        >
          {display}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={e => onChange(Number(e.target.value))}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-label={label}
        className="w-full disabled:opacity-40 disabled:cursor-not-allowed"
      />
      <div className="flex justify-between text-[10px] text-muted px-0.5" aria-hidden="true">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  )
}

// ── Toggle row ────────────────────────────────────────────────────────────────
interface ToggleRowProps {
  id: string
  label: string
  description: string
  checked: boolean
  disabled: boolean
  onChange: (v: boolean) => void
}

function ToggleRow({ id, label, description, checked, disabled, onChange }: ToggleRowProps) {
  return (
    <label
      htmlFor={id}
      className={`flex items-start gap-3 cursor-pointer rounded-lg border p-3 transition-colors ${
        checked
          ? 'border-magenta/40 bg-magenta/5'
          : 'border-border bg-surface hover:bg-surface-raised'
      } ${disabled ? 'opacity-40 pointer-events-none' : ''}`}
    >
      {/* Custom toggle pill */}
      <div className="relative mt-0.5 shrink-0">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={e => onChange(e.target.checked)}
          className="sr-only"
        />
        <div
          className={`w-9 h-5 rounded-full border-2 transition-colors ${
            checked ? 'bg-magenta border-magenta' : 'bg-surface-raised border-border'
          }`}
          aria-hidden="true"
        >
          <div
            className={`w-3.5 h-3.5 rounded-full bg-white shadow transition-transform mt-[1px] ${
              checked ? 'translate-x-[18px]' : 'translate-x-[1px]'
            }`}
          />
        </div>
      </div>

      <div className="flex flex-col gap-0.5">
        <span className={`text-sm font-medium ${checked ? 'text-primary' : 'text-secondary'}`}>
          {label}
        </span>
        <span className="text-xs text-muted leading-snug">{description}</span>
      </div>
    </label>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function EnhancementControls({
  settings,
  onChange,
  onReset,
  disabled = false,
}: EnhancementControlsProps) {
  const hasChanges = JSON.stringify(settings) !== JSON.stringify(DEFAULT_SETTINGS)

  return (
    <div className="flex flex-col gap-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-primary uppercase tracking-wider">
          Enhancement Settings
        </h2>
        {hasChanges && (
          <button
            type="button"
            onClick={onReset}
            disabled={disabled}
            className="text-xs text-muted hover:text-magenta transition-colors disabled:opacity-40"
            aria-label="Reset all settings to default"
          >
            Reset all
          </button>
        )}
      </div>

      {/* Sliders section */}
      <div
        className="flex flex-col gap-5 rounded-xl border border-border bg-surface p-4"
        aria-label="Image adjustment sliders"
      >
        <SliderRow
          id="brightness"
          label="Brightness"
          value={settings.brightness}
          min={0.2}
          max={2.5}
          step={0.05}
          defaultValue={DEFAULT_SETTINGS.brightness}
          disabled={disabled}
          onChange={v => onChange('brightness', v)}
        />
        <SliderRow
          id="contrast"
          label="Contrast"
          value={settings.contrast}
          min={0.2}
          max={2.5}
          step={0.05}
          defaultValue={DEFAULT_SETTINGS.contrast}
          disabled={disabled}
          onChange={v => onChange('contrast', v)}
        />
        <SliderRow
          id="saturation"
          label="Saturation"
          value={settings.saturation}
          min={0.0}
          max={2.5}
          step={0.05}
          defaultValue={DEFAULT_SETTINGS.saturation}
          disabled={disabled}
          onChange={v => onChange('saturation', v)}
          formatValue={v => (v === 0 ? 'B&W' : v.toFixed(2))}
        />
        <SliderRow
          id="sharpness"
          label="Sharpness"
          value={settings.sharpness}
          min={0.0}
          max={3.0}
          step={0.05}
          defaultValue={DEFAULT_SETTINGS.sharpness}
          disabled={disabled}
          onChange={v => onChange('sharpness', v)}
        />
      </div>

      {/* Toggle section */}
      <div className="flex flex-col gap-2.5" aria-label="AI enhancement options">
        <ToggleRow
          id="auto_wb"
          label="Auto White Balance"
          description="Corrects colour casts from artificial or mixed lighting."
          checked={settings.auto_wb}
          disabled={disabled}
          onChange={v => onChange('auto_wb', v)}
        />
        <ToggleRow
          id="denoise"
          label="Noise Reduction"
          description="Smooths grain and sensor noise while keeping edges crisp."
          checked={settings.denoise}
          disabled={disabled}
          onChange={v => onChange('denoise', v)}
        />

        {/* Denoise strength — only visible when denoise is on */}
        {settings.denoise && (
          <div className="pl-3 border-l-2 border-magenta/30 animate-fade-up">
            <SliderRow
              id="denoise_strength"
              label="Noise Reduction Strength"
              value={settings.denoise_strength}
              min={5}
              max={15}
              step={2}
              defaultValue={DEFAULT_SETTINGS.denoise_strength}
              disabled={disabled}
              onChange={v => onChange('denoise_strength', v)}
              formatValue={v => `${v}px`}
            />
          </div>
        )}
      </div>
    </div>
  )
}
