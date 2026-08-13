import { useState, useCallback } from 'react'
import axios from 'axios'
import { useActiveImage } from '../contexts/ActiveImageContext'

export type UploadStatus = 'idle' | 'uploading' | 'success' | 'error'

export interface UploadResult {
  output_filename: string
  download_url: string
}

export function useUpload() {
  const [status, setStatus]           = useState<UploadStatus>('idle')
  const [result, setResult]           = useState<UploadResult | null>(null)
  const [originalUrl, setOriginalUrl] = useState<string | null>(null)
  const [error, setError]             = useState<string | null>(null)
  const { setActiveImage }            = useActiveImage()

  const upload = useCallback(async (file: File) => {
    setStatus('uploading')
    setResult(null)
    setError(null)

    // Create a local object URL to show the original image immediately
    const localUrl = URL.createObjectURL(file)
    setActiveImage(file, localUrl)
    setOriginalUrl(prev => {
      if (prev) URL.revokeObjectURL(prev)
      return localUrl
    })

    const formData = new FormData()
    formData.append('file', file)

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
  }, [setActiveImage])

  const reset = useCallback(() => {
    setStatus('idle')
    setResult(null)
    setError(null)
    setActiveImage(null, null)
    setOriginalUrl(prev => {
      if (prev) URL.revokeObjectURL(prev)
      return null
    })
  }, [setActiveImage])

  return { status, result, originalUrl, error, upload, reset }
}
