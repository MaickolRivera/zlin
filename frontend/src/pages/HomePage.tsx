import { useState, type FormEvent } from 'react'
import { ArrowRight, Check, Copy } from 'lucide-react'
import { QrPanel } from '@/components/QrPanel'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { BASE_HOST } from '@/lib/config'
import { isValidUrl, shorten, type ShortLink } from '@/lib/shorten'

export default function HomePage() {
  const [url, setUrl] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [link, setLink] = useState<ShortLink | null>(null)
  const [copied, setCopied] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    const value = url.trim()
    if (!isValidUrl(value)) {
      setError('Ingresa un enlace válido que empiece con http:// o https://')
      return
    }
    setError(null)
    setCopied(false)
    setLink(await shorten(value))
  }

  async function copy() {
    if (!link) return
    await navigator.clipboard.writeText(link.shortUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="flex flex-col items-center gap-10">
      <section className="max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Acorta, comparte, escanea.</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Convierte enlaces largos en links cortos y obtén al instante un código QR listo para compartir.
        </p>
      </section>

      <section className="grid w-full overflow-hidden rounded-2xl border bg-card shadow-sm md:grid-cols-2">
        <form onSubmit={onSubmit} noValidate className="flex flex-col justify-center gap-6 p-8 sm:p-10">
          <h2 className="text-2xl font-bold tracking-tight">Crea tu primer enlace</h2>

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
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
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

          <Button type="submit" size="lg" className="w-fit">
            Acortar enlace <ArrowRight />
          </Button>
        </form>

        <div className="flex min-h-72 items-center justify-center bg-gradient-to-br from-muted via-background to-muted p-8">
          <QrPanel value={link?.shortUrl} />
        </div>
      </section>
    </div>
  )
}
