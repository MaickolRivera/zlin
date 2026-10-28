import { Link, Route, Routes, useLocation } from 'react-router-dom'
import HomePage from '@/pages/HomePage'
import LoginPage from '@/pages/LoginPage'
import RedirectPage from '@/pages/RedirectPage'
import RegisterPage from '@/pages/RegisterPage'

export default function App() {
  const { pathname } = useLocation()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="flex min-h-screen w-full flex-col items-center justify-center px-4 py-10">
        {/* La home no lleva nav; el resto de páginas solo muestra el logo para volver. */}
        {pathname !== '/' && (
          <Link to="/" className="mb-10 block text-center font-pixel text-5xl leading-none">
            zlin
          </Link>
        )}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/:code" element={<RedirectPage />} />
        </Routes>
      </main>
    </div>
  )
}
