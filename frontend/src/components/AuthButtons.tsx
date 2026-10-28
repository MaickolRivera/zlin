import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth'

export function AuthButtons() {
  const { user, logout } = useAuth()

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <span className="font-pixel text-xl text-muted-foreground">@{user.username}</span>
        <Button variant="outline" onClick={logout}>
          Salir
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <Button variant="outline" asChild>
        <Link to="/login">Ingresar</Link>
      </Button>
      <Button asChild>
        <Link to="/register">Crear cuenta</Link>
      </Button>
    </div>
  )
}
