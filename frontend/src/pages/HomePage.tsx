import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { BASE_HOST } from '@/lib/config'

export default function HomePage() {
  const [url, setUrl] = useState('')

  return (
    <div className="flex flex-col items-center gap-10">
      <section className="max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Acorta, comparte, escanea.</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Convierte enlaces largos en links cortos y obtén al instante un código QR listo para compartir.
        </p>
      </section>

      <section className="grid w-full overflow-hidden rounded-2xl border bg-card shadow-sm md:grid-cols-2">
        <div className="flex flex-col justify-center gap-6 p-8 sm:p-10">
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
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            Vista previa
            <code className="rounded-full border bg-muted px-3 py-1 font-mono text-xs text-foreground">
              {BASE_HOST}/abc123
            </code>
          </div>

          <Button size="lg" className="w-fit">
            Acortar enlace <ArrowRight />
          </Button>
        </div>

        <div className="flex min-h-72 items-center justify-center bg-gradient-to-br from-muted via-background to-muted p-8">
          {/* Aquí va el código QR */}
        </div>
      </section>
    </div>
  )
}
