import { useState, useCallback } from 'react'
import axios from 'axios'

export type UploadStatus = 'idle' | 'uploading' | 'success' | 'error'
export type Quality = 'fast' | 'quality'

export interface UploadResult {
  output_filename: string
  download_url:    string
  quality:         Quality
}

export function useUpload() {
  const [status,      setStatus]      = useState<UploadStatus>('idle')
  const [result,      setResult]      = useState<UploadResult | null>(null)
  const [originalUrl, setOriginalUrl] = useState<string | null>(null)
  const [error,       setError]       = useState<string | null>(null)
  const [quality,     setQuality]     = useState<Quality>('fast')

  const upload = useCallback(async (file: File, overrideQuality?: Quality) => {
    const q = overrideQuality ?? quality
    setStatus('uploading')
    setResult(null)
    setError(null)

    // Show original image immediately via object URL
    const localUrl = URL.createObjectURL(file)
    setOriginalUrl(prev => {
      if (prev) URL.revokeObjectURL(prev)
      return localUrl
    })

    const formData = new FormData()
    formData.append('file', file)
    formData.append('quality', q)

    try {
      const response = await axios.post<UploadResult>('/api/remove-background', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setResult(response.data)
      setStatus('success')
    } catch (err) {
      const msg =
        axios.isAxiosError(err) && err.response?.data?.detail
          ? String(err.response.data.detail)
          : 'Something went wrong. Please try again.'
      setError(msg)
      setStatus('error')
    }
  }, [quality])

  const reset = useCallback(() => {
    setStatus('idle')
    setResult(null)
    setError(null)
    setOriginalUrl(prev => {
      if (prev) URL.revokeObjectURL(prev)
      return null
    })
  }, [])

  return { status, result, originalUrl, error, quality, setQuality, upload, reset }
}
