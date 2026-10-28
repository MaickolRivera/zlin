import { API_URL } from '@/lib/config'

// Render (plan gratis) duerme el API tras un rato sin tráfico. Se llama al abrir la app para que
// vaya arrancando mientras la persona escribe. Respuesta opaca (no-cors): solo importa que llegue.
export function wakeUp() {
  fetch(`${API_URL}/health`, { mode: 'no-cors' }).catch(() => {})
}

export class ApiError extends Error {
  status: number
  fieldErrors: Record<string, string[]>

  constructor(status: number, message: string, fieldErrors: Record<string, string[]> = {}) {
    super(message)
    this.status = status
    this.fieldErrors = fieldErrors
  }
}

type Options = { method?: string; body?: unknown; token?: string | null }

export async function api<T>(path: string, { method = 'GET', body, token }: Options = {}): Promise<T> {
  let res: Response
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        ...(body !== undefined && { 'Content-Type': 'application/json' }),
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError(0, 'No se pudo conectar con el servidor.')
  }

  if (res.status === 204) return undefined as T

  const data = await res.json().catch(() => null)
  if (res.ok) return data as T

  // El backend responde { error } (conflictos) o un ProblemDetails con { errors } (validación).
  const fieldErrors: Record<string, string[]> = data?.errors ?? {}
  const first = Object.values(fieldErrors)[0]?.[0]
  throw new ApiError(res.status, data?.error ?? first ?? 'Ocurrió un error inesperado.', fieldErrors)
}
