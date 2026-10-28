import { Link } from 'react-router-dom'
import { useAuth } from '@/lib/auth'

export function AuthButtons() {
  const { user, logout } = useAuth()

  if (user) {
    return (
      <div className="flex items-center gap-8">
        <p className="font-pixel text-xl text-muted-foreground"><span className='text-base'>@_</span>{user.username}</p>
        <button className="font-pixel text-base border-b border-white cursor-pointer tracking-widest" onClick={logout}>
          SALIR
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center ml-2 gap-4 rounded-full border-2 border-border text-xs overflow-hidden">
      <button className='py-1.5 pl-6 pr-1'>
        <Link to="/login">Ingresar</Link>
      </button>
      <button className='py-1.5 px-3 bg-border'>
        <Link to="/register">Crear cuenta</Link>
      </button>
    </div>
  )
}
