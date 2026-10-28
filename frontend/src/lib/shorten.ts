import { BASE_URL } from '@/lib/config'

const ALPHABET = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789'

export type ShortLink = { code: string; shortUrl: string; originalUrl: string }

function randomCode(length = 7) {
  const bytes = crypto.getRandomValues(new Uint8Array(length))
  return Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join('')
}

export function isValidUrl(value: string) {
  try {
    const { protocol } = new URL(value)
    return protocol === 'http:' || protocol === 'https:'
  } catch {
    return false
  }
}

// Mock: se reemplazará por POST /api/links cuando el backend lo exponga.
export async function shorten(originalUrl: string): Promise<ShortLink> {
  const code = randomCode()
  return { code, shortUrl: `${BASE_URL}/${code}`, originalUrl }
}
