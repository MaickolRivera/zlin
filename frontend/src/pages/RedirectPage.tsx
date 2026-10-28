import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { API_URL } from '@/lib/config'

// Los enlaces cortos viven en el dominio del front; la API resuelve el código y redirige.
export default function RedirectPage() {
  const { code } = useParams()

  useEffect(() => {
    window.location.replace(`${API_URL}/${code}`)
  }, [code])

  return <p className="text-center text-muted-foreground">Redirigiendo…</p>
}
