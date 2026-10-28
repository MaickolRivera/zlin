import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { api } from '@/lib/api'

export type User = { id: string; email: string; username: string; createdAt: string }
type Session = { token: string; expiresAt: string; user: User }

type AuthContextValue = {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, username: string, password: string) => Promise<void>
  logout: () => void
}

const STORAGE_KEY = 'zlin.session'
const AuthContext = createContext<AuthContextValue | null>(null)

function loadSession(): Session | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const session: Session = JSON.parse(raw)
    return new Date(session.expiresAt) > new Date() ? session : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(loadSession)

  const save = useCallback((s: Session | null) => {
    setSession(s)
    try {
      if (s) localStorage.setItem(STORAGE_KEY, JSON.stringify(s))
      else localStorage.removeItem(STORAGE_KEY)
    } catch {
      // Sin almacenamiento disponible: la sesión dura lo que dure la pestaña.
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      token: session?.token ?? null,
      login: async (email, password) =>
        save(await api<Session>('/api/auth/login', { method: 'POST', body: { email, password } })),
      register: async (email, username, password) =>
        save(await api<Session>('/api/auth/register', { method: 'POST', body: { email, username, password } })),
      logout: () => save(null),
    }),
    [session, save],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}
