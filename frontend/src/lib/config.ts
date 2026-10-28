export const BASE_URL = (import.meta.env.VITE_BASE_URL ?? 'http://localhost:5173').replace(/\/$/, '')
export const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:5195').replace(/\/$/, '')

// Dominio sin protocolo, para mostrar en la vista previa (ej: localhost:5173).
export const BASE_HOST = BASE_URL.replace(/^https?:\/\//, '')
