// ── Chat ────────────────────────────────────────────────────────────────────

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  thinking?: string | null
  timestamp: number
}

export interface ChatResponse {
  reply: string
  thinking?: string | null
}

// ── Image Analysis ───────────────────────────────────────────────────────────

export interface ImageAnalysis {
  subject: string
  image_type: string
  background_description: string
  suggested_use: string
  editing_recommendations: string[]
}

// ── Caption ──────────────────────────────────────────────────────────────────

export type CaptionStyle =
  | 'instagram'
  | 'professional'
  | 'product'
  | 'marketing'
  | 'casual'

export interface CaptionResponse {
  caption: string
  style: CaptionStyle
}

export interface CaptionsResponse {
  captions: string[]
  style: CaptionStyle
}

// ── Background Suggestions ───────────────────────────────────────────────────

export interface BackgroundSuggestionsResponse {
  suggestions: string[]
}
