import { Link as LinkIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function Header() {
  return (
    <header className="border-b">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <LinkIcon className="size-5" />
          Tink
        </Link>
        <nav className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link to="/login">Ingresar</Link>
          </Button>
          <Button asChild>
            <Link to="/register">Crear cuenta</Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}
