import { useState, type FormEvent } from 'react'
import { ArrowRight, Check, Copy } from 'lucide-react'
import { AuthButtons } from '@/components/AuthButtons'
import { ExternalLink } from '@/components/ExternalLink'
import { QrPanel } from '@/components/QrPanel'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/lib/auth'
import { BASE_HOST } from '@/lib/config'
import { isValidUrl, shorten, type ShortLink } from '@/lib/shorten'

export default function HomePage() {
  const [url, setUrl] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [link, setLink] = useState<ShortLink | null>(null)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const { token } = useAuth()

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    const value = url.trim()
    if (!isValidUrl(value)) {
      setError('Ingresa un enlace válido que empiece con http:// o https://')
      return
    }
    setError(null)
    setCopied(false)
    setLoading(true)
    try {
      setLink(await shorten(value, token))
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  async function copy() {
    if (!link) return
    await navigator.clipboard.writeText(link.shortUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-8">
      <section className="flex flex-col items-center gap-4 text-center">
        <h1 className="font-pixel text-6xl leading-18 sm:text-8xl ">zlin</h1>
        <p className="text-sm text-muted-foreground sm:text-md">
          [Acortador de links con QR]
          <ExternalLink href="https://github.com/MaickolRivera/zlin">.zip</ExternalLink>
        </p>
        <AuthButtons />
      </section>

      <section className="grid w-full overflow-hidden rounded-2xl border bg-card shadow-sm md:grid-cols-2">
        <form onSubmit={onSubmit} noValidate className="flex flex-col justify-center gap-4 p-8">

          <div className="flex flex-col gap-2">
            <Label htmlFor="url">
              Pega un enlace largo <span className="text-destructive">*</span>
            </Label>
            <Input
              id="url"
              type="url"
              placeholder="https://shop.example.com/collections/spring-sale?utm_source=..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              aria-invalid={!!error}
            />
            {/* Alto reservado para que el mensaje de error no mueva el resto del layout. */}
            <p className="min-h-5 text-sm text-destructive">{error}</p>
          </div>

          <div className="flex flex-col items-start flex-wrap gap-2 text-sm text-muted-foreground">
            {link ? 'Tu enlace corto' : 'Vista previa'}
            <code className="rounded-full border bg-muted px-3 py-1 font-mono text-xs text-foreground">
              {link ? link.shortUrl.replace(/^https?:\/\//, '') : `${BASE_HOST}/abc123`}
            </code>
            {link && (
              <Button type="button" variant="ghost" size="icon-sm" onClick={copy} aria-label="Copiar enlace">
                {copied ? <Check /> : <Copy />}
              </Button>
            )}
          </div>

          <Button type="submit" size="sm" className="w-fit rounded-full px-7 py-1.5" disabled={loading}>
            {loading ? 'Acortando…' : 'Acortar enlace'} <ArrowRight />
          </Button>
        </form>

        <div className="flex min-h-72 items-center justify-center bg-linear-to-br from-muted via-background to-muted p-8">
          <QrPanel value={link?.shortUrl} />
        </div>
      </section>
    </div>
  )
}
