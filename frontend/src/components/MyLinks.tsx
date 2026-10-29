import { useEffect, useState } from 'react'
import { Check, Copy, Trash2 } from 'lucide-react'
import { deleteLink, listLinks, type ShortLink } from '@/lib/shorten'

type Props = {
  token: string
  refreshKey?: string
}

const dateFormat = new Intl.DateTimeFormat('es', { dateStyle: 'medium', timeStyle: 'short' })

function expiration(link: ShortLink) {
  if (!link.expiresAt) return null
  const date = new Date(link.expiresAt)
  return date <= new Date() ? 'Expirado' : `Expira ${dateFormat.format(date)}`
}

const iconButton =
  'inline-flex size-8 shrink-0 items-center justify-center rounded-[10px] transition-all outline-none hover:bg-muted/50 focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px [&_svg]:size-4 [&_svg]:pointer-events-none'

export function MyLinks({ token, refreshKey }: Props) {
  const [links, setLinks] = useState<ShortLink[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const [confirming, setConfirming] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    listLinks(token)
      .then((data) => !cancelled && (setLinks(data), setError(null)))
      .catch((err: Error) => !cancelled && setError(err.message))
    return () => {
      cancelled = true
    }
  }, [token, refreshKey])

  async function copy(link: ShortLink) {
    await navigator.clipboard.writeText(link.shortUrl)
    setCopied(link.code)
    setTimeout(() => setCopied((c) => (c === link.code ? null : c)), 1500)
  }

  async function remove(code: string) {
    try {
      await deleteLink(code, token)
      setLinks((prev) => prev?.filter((l) => l.code !== code) ?? null)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setConfirming(null)
    }
  }

  return (
    <section className="flex w-full flex-col gap-3">
      <h2 className="font-pixel text-2xl">Mis enlaces</h2>

      {error && <p className="text-xs text-destructive">{error}</p>}
      {links === null && !error && <p className="text-sm text-muted-foreground">Cargando…</p>}
      {links?.length === 0 && <p className="text-sm text-muted-foreground">Aún no has creado enlaces.</p>}

      {links && links.length > 0 && (
        <ul className="divide-y overflow-hidden rounded-2xl border bg-card shadow-sm">
          {links.map((link) => {
            const exp = expiration(link)
            return (
              <li key={link.code} className="flex items-center gap-3 p-4">
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <code className="truncate font-mono text-sm">{link.shortUrl.replace(/^https?:\/\//, '')}</code>
                  <span className="truncate text-xs text-muted-foreground" title={link.originalUrl}>
                    {link.originalUrl}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {link.clicks} {link.clicks === 1 ? 'clic' : 'clics'}
                    {exp && ` · ${exp}`}
                  </span>
                </div>

                <button type="button" aria-label="Copiar enlace" onClick={() => copy(link)} className={iconButton}>
                  {copied === link.code ? <Check /> : <Copy />}
                </button>

                {confirming === link.code ? (
                  <div className="flex items-center gap-2 text-xs">
                    <button type="button" onClick={() => remove(link.code)} className="text-destructive underline-offset-4 hover:underline">
                      Borrar
                    </button>
                    <button type="button" onClick={() => setConfirming(null)} className="text-muted-foreground underline-offset-4 hover:underline">
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <button type="button" aria-label="Borrar enlace" onClick={() => setConfirming(link.code)} className={iconButton}>
                    <Trash2 />
                  </button>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
