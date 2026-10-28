import { useEffect } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import { Footer } from '@/components/Footer'
import { wakeUp } from '@/lib/api'
import HomePage from '@/pages/HomePage'
import LoginPage from '@/pages/LoginPage'
import RedirectPage from '@/pages/RedirectPage'
import RegisterPage from '@/pages/RegisterPage'

export default function App() {
  const { pathname } = useLocation()

  useEffect(wakeUp, [])

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <main className="flex w-full flex-1 flex-col items-center justify-center px-4 py-10">
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
      <Footer />
    </div>
  )
}
