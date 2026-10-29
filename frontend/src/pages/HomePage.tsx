import { useState, type FormEvent } from 'react'
import { ArrowRight, Check, Copy } from 'lucide-react'
import { AuthButtons } from '@/components/AuthButtons'
import { ExternalLink } from '@/components/ExternalLink'
import { MyLinks } from '@/components/MyLinks'
import { QrPanel } from '@/components/QrPanel'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { useAuth } from '@/lib/auth'
import { BASE_HOST } from '@/lib/config'
import { EXPIRATIONS, isValidUrl, shorten, type ShortLink } from '@/lib/shorten'

export default function HomePage() {
  const [url, setUrl] = useState('')
  const [expiresInMs, setExpiresInMs] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [link, setLink] = useState<ShortLink | null>(null)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const { token, user } = useAuth()

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
      setLink(await shorten(value, expiresInMs, token))
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

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="url"> 
              Pega tu enlace <span className="text-destructive">*</span>
            </Label>
            <Input
              id="url"
              type="url"
              placeholder="https://shop.example.com/collections/spring-sale?utm_source=..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              aria-invalid={!!error}
            />

            <Select id="expiration" value={expiresInMs} onChange={(e) => setExpiresInMs(Number(e.target.value))}>
              {EXPIRATIONS.map(({ label, ms }) => (
                <option key={ms} value={ms}>
                  {label}
                </option>
              ))}
            </Select>
            {/* Alto reservado para que el mensaje de error no mueva el resto del layout. */}
            <p className="min-h-5 text-xs text-destructive">{error}</p>
          </div>

          <div className="flex flex-col items-start flex-wrap gap-2 text-sm text-muted-foreground">
            {link ? 'Tu enlace corto' : 'Vista previa'}
            <div className='flex flex-row items-center gap-2'>
              <code className="rounded-full border bg-muted px-3 py-1 font-mono text-xs text-foreground">
                {link ? link.shortUrl.replace(/^https?:\/\//, '') : `${BASE_HOST}/abc123`}
              </code>
              <button
                type="button"
                onClick={copy}
                aria-label="Copiar enlace"
                className="inline-flex size-8 items-center justify-center rounded-[10px] transition-all outline-none hover:bg-muted/50 focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
              >
                {copied ? <Check /> : <Copy />}
              </button>
            </div>
            
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-8 w-fit items-center justify-center gap-1 rounded-full bg-primary px-6 py-2 text-sm font-medium whitespace-nowrap text-primary-foreground transition-all outline-none hover:bg-primary/80 focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
          >
            {loading ? 'Acortando…' : 'Acortar enlace'} <ArrowRight />
          </button>
        </form>

        <div className="flex min-h-72 items-center justify-center bg-linear-to-br from-muted via-background to-muted p-8">
          <QrPanel value={link?.shortUrl} />
        </div>
      </section>

      {!user && <p className='text-sm text-muted-foreground sm:text-md'>Inicia sesión para guardar tus enlaces</p>}
      {token && <MyLinks token={token} refreshKey={link?.code} />}
    </div>
  )
}
