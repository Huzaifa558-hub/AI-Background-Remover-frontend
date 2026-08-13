import { useState, useCallback, useEffect } from 'react'
import axios from 'axios'
import { useToast } from './useToast'

export interface HistoryItem {
  upload_id:       string
  original_name:   string
  output_filename: string
  created_at:      string
}

export function useHistory() {
  const { showToast } = useToast()
  const [items, setItems]     = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await axios.get<HistoryItem[]>('/api/history')
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
  useEffect(() => { fetch() }, [fetch])

  return { items, loading, error, refetch: fetch, deleteItem }
}
