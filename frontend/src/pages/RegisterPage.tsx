import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type Fields = { email: string; username: string; password: string }

// Mismas reglas que RegisterRequest en el backend.
function validate({ email, username, password }: Fields) {
  const errors: Partial<Fields> = {}
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Ingresa un email válido.'
  if (!/^[a-zA-Z0-9_]{3,50}$/.test(username))
    errors.username = 'Usa 3 a 50 letras, números o guion bajo.'
  if (password.length < 8) errors.password = 'La contraseña debe tener al menos 8 caracteres.'
  return errors
}

export default function RegisterPage() {
  const [values, setValues] = useState<Fields>({ email: '', username: '', password: '' })
  const [errors, setErrors] = useState<Partial<Fields>>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const set = (key: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setValues((v) => ({ ...v, [key]: e.target.value }))

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    const found = validate(values)
    setErrors(found)
    setFormError(null)
    if (Object.keys(found).length > 0) return

    setLoading(true)
    try {
      await register(values.email, values.username, values.password)
      navigate('/')
    } catch (err) {
      setFormError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="mx-auto w-full max-w-sm">
      <form onSubmit={onSubmit} noValidate>
        <CardHeader>
          <CardTitle>Crear cuenta</CardTitle>
          <CardDescription>Empieza a acortar tus enlaces con Zlin.</CardDescription>
        </CardHeader>
        <CardContent className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" autoComplete="email" placeholder="tu@email.com"
              value={values.email} onChange={set('email')} aria-invalid={!!errors.email} />
            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="username">Usuario</Label>
            <Input id="username" autoComplete="username" placeholder="tu_usuario"
              value={values.username} onChange={set('username')} aria-invalid={!!errors.username} />
            {errors.username && <p className="text-sm text-destructive">{errors.username}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input id="password" type="password" autoComplete="new-password"
              value={values.password} onChange={set('password')} aria-invalid={!!errors.password} />
            {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
          </div>
          {formError && <p className="text-sm text-destructive">{formError}</p>}
        </CardContent>
        <CardFooter className="mt-6 flex flex-col gap-3">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creando cuenta…' : 'Crear cuenta'}
          </Button>
          <p className="text-sm text-muted-foreground">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="font-medium text-foreground underline underline-offset-4">
              Ingresar
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
