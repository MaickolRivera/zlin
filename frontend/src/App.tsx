import { Route, Routes } from 'react-router-dom'
import { Header } from '@/components/Header'

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-12">
        <Routes>
          <Route path="/" element={<p>Inicio</p>} />
          <Route path="/login" element={<p>Ingresar</p>} />
          <Route path="/register" element={<p>Crear cuenta</p>} />
        </Routes>
      </main>
    </div>
  )
}
