import { api } from '@/lib/api'

export type ShortLink = {
  code: string
  shortUrl: string
  originalUrl: string
  clicks: number
  createdAt: string
  expiresAt: string | null
}

export function isValidUrl(value: string) {
  try {
    const { protocol } = new URL(value)
    return protocol === 'http:' || protocol === 'https:'
  } catch {
    return false
  }
}

// Con token el enlace queda a nombre del usuario; sin token se crea de forma anónima.
export function shorten(url: string, token?: string | null) {
  return api<ShortLink>('/api/links', { method: 'POST', body: { url }, token })
}
