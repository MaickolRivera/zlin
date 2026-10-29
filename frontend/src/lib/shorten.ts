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

const HOUR = 3_600_000

export const EXPIRATIONS = [
  { label: 'Sin expiración', ms: 0 },
  { label: '1 hora', ms: HOUR },
  { label: '1 día', ms: 24 * HOUR },
  { label: '7 días', ms: 7 * 24 * HOUR },
  { label: '30 días', ms: 30 * 24 * HOUR },
] as const

// Con token el enlace queda a nombre del usuario; sin token se crea de forma anónima.
export function shorten(url: string, expiresInMs = 0, token?: string | null) {
  const expiresAt = expiresInMs > 0 ? new Date(Date.now() + expiresInMs).toISOString() : null
  return api<ShortLink>('/api/links', { method: 'POST', body: { url, expiresAt }, token })
}

export function listLinks(token: string) {
  return api<ShortLink[]>('/api/links', { token })
}

export function deleteLink(code: string, token: string) {
  return api<void>(`/api/links/${code}`, { method: 'DELETE', token })
}
