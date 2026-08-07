import { useState, useCallback } from 'react'
import axios from 'axios'

// ── Types ──────────────────────────────────────────────────────────────────

export type BgType        = 'solid' | 'gradient' | 'image'
export type GradientDir   = 'horizontal' | 'vertical' | 'diagonal'
export type BgFit         = 'cover' | 'contain' | 'stretch'
export type RemoveStatus  = 'idle' | 'removing' | 'removed' | 'error'
export type ReplaceStatus = 'idle' | 'replacing' | 'done' | 'error'

export interface BgSettings {
  bgType:         BgType
  solidColor:     string      // CSS hex, e.g. "#ffffff"
  gradientStart:  string
  gradientEnd:    string
  gradientDir:    GradientDir
  bgFile:         File | null
  bgFit:          BgFit
}

export interface RemoveResult {
  output_filename: string
  download_url:    string
}

export interface ReplaceResult {
  result_id:       string
  output_filename: string
  download_url:    string
  image_meta:      { width: number; height: number }
}

export const DEFAULT_BG_SETTINGS: BgSettings = {
  bgType:        'solid',
  solidColor:    '#ffffff',
  gradientStart: '#e8336d',
  gradientEnd:   '#2fbfb0',
  gradientDir:   'vertical',
  bgFile:        null,
  bgFit:         'cover',
}

// ── Hook ───────────────────────────────────────────────────────────────────

export function useReplaceBg() {
  // Step 1 — remove bg
  const [removeStatus,  setRemoveStatus]  = useState<RemoveStatus>('idle')
  const [removeResult,  setRemoveResult]  = useState<RemoveResult | null>(null)
  const [originalUrl,   setOriginalUrl]   = useState<string | null>(null)
  const [removedUrl,    setRemovedUrl]    = useState<string | null>(null)
  const [removeError,   setRemoveError]   = useState<string | null>(null)

  // Step 2 — replace bg
  const [replaceStatus, setReplaceStatus] = useState<ReplaceStatus>('idle')
  const [replaceResult, setReplaceResult] = useState<ReplaceResult | null>(null)
  const [replaceError,  setReplaceError]  = useState<string | null>(null)

  // Background settings
  const [settings, setSettings] = useState<BgSettings>(DEFAULT_BG_SETTINGS)

  // ── Setting helpers ───────────────────────────────────────────────────

  const updateSetting = useCallback(
    <K extends keyof BgSettings>(key: K, value: BgSettings[K]) => {
      setSettings(prev => ({ ...prev, [key]: value }))
    },
    [],
  )

  const resetSettings = useCallback(() => setSettings(DEFAULT_BG_SETTINGS), [])

  // ── Step 1: remove background ─────────────────────────────────────────

  const removeBackground = useCallback(async (file: File) => {
    setRemoveStatus('removing')
    setRemoveResult(null)
    setReplaceResult(null)
    setRemoveError(null)
    setReplaceStatus('idle')

    const localUrl = URL.createObjectURL(file)
    setOriginalUrl(prev => { if (prev) URL.revokeObjectURL(prev); return localUrl })
    setRemovedUrl(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await axios.post<RemoveResult>(
        '/api/remove-background',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      )
      setRemoveResult(res.data)
      setRemovedUrl(`/api/download/${res.data.output_filename}`)
      setRemoveStatus('removed')
    } catch (err) {
      const msg =
        axios.isAxiosError(err) && err.response?.data?.detail
          ? String(err.response.data.detail)
          : 'Background removal failed. Please try again.'
      setRemoveError(msg)
      setRemoveStatus('error')
    }
  }, [])

  // ── Step 2: replace background ────────────────────────────────────────

  const replaceBackground = useCallback(async () => {
    if (!removeResult) return

    setReplaceStatus('replacing')
    setReplaceResult(null)
    setReplaceError(null)

    const formData = new FormData()
    formData.append('fg_filename',    removeResult.output_filename)
    formData.append('bg_type',        settings.bgType)
    formData.append('solid_color',    settings.solidColor)
    formData.append('gradient_start', settings.gradientStart)
    formData.append('gradient_end',   settings.gradientEnd)
    formData.append('gradient_dir',   settings.gradientDir)
    formData.append('bg_fit',         settings.bgFit)
    if (settings.bgType === 'image' && settings.bgFile) {
      formData.append('bg_file', settings.bgFile)
    }

    try {
      const res = await axios.post<ReplaceResult>(
        '/api/replace-background',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      )
      setReplaceResult(res.data)
      setReplaceStatus('done')
    } catch (err) {
      const msg =
        axios.isAxiosError(err) && err.response?.data?.detail
          ? String(err.response.data.detail)
          : 'Background replacement failed. Please try again.'
      setReplaceError(msg)
      setReplaceStatus('idle')
    }
  }, [removeResult, settings])

  // ── Full reset ────────────────────────────────────────────────────────

  const reset = useCallback(() => {
    setRemoveStatus('idle')
    setRemoveResult(null)
    setReplaceResult(null)
    setRemoveError(null)
    setReplaceError(null)
    setReplaceStatus('idle')
    setOriginalUrl(prev => { if (prev) URL.revokeObjectURL(prev); return null })
    setRemovedUrl(null)
  }, [])

  return {
    // step 1
    removeStatus, removeResult, originalUrl, removedUrl, removeError,
    removeBackground,
    // step 2
    replaceStatus, replaceResult, replaceError,
    replaceBackground,
    // settings
    settings, updateSetting, resetSettings,
    // global
    reset,
  }
}
