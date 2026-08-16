import { useState, useCallback, useEffect } from 'react'
import axios from 'axios'
import { useToast } from './useToast'

// ── Operation types ──────────────────────────────────────────────────────────

export type OperationType = 'remove_bg' | 'enhance' | 'replace_bg' | 'smart_crop'

// ── Normalised shape returned by /api/history/all ────────────────────────────
// The backend normalises all four collections into this common shape.

export interface HistoryItem {
  // Common fields (always present after normalisation)
  upload_id:       string          // result_id for replace_bg is mapped to this
  original_name:   string          // fg_filename for replace_bg is mapped to this
  output_filename: string          // cropped_filename for smart_crop is mapped to this
  created_at:      string          // ISO 8601 string
  operation_type:  OperationType

  // Optional per-operation fields
  quality?:          string        // remove_bg
  bg_type?:          string        // replace_bg: "solid" | "gradient" | "image"
  settings?:         Record<string, unknown>  // enhance / replace_bg / smart_crop
  image_meta?:       { width: number; height: number; mode?: string }
  crop_meta?:        {
    crop_box:  { x0: number; y0: number; x1: number; y1: number }
    width:     number
    height:    number
    original:  { width: number; height: number }
    crop_mode: string
  }
  // smart_crop keeps both filenames in the raw record
  removed_filename?: string
  cropped_filename?: string
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useHistory() {
  const { showToast } = useToast()
  const [items, setItems]     = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await axios.get<HistoryItem[]>('/api/history/all')
      setItems(res.data)
    } catch {
      setError('Could not load history.')
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteItem = useCallback(async (uploadId: string) => {
    try {
      await axios.delete(`/api/image/${uploadId}`)
      setItems(prev => prev.filter(i => i.upload_id !== uploadId))
      showToast('Image deleted successfully.', 'success')
    } catch {
      showToast('Could not delete image.', 'error')
    }
  }, [showToast])

  // Load on mount
  useEffect(() => { fetchAll() }, [fetchAll])

  return { items, loading, error, refetch: fetchAll, deleteItem }
}
