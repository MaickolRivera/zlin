import { QRCodeSVG } from 'qrcode.react'
import { BASE_URL } from '@/lib/config'

type Props = { value?: string }

// Sin `value` muestra un QR gris que apunta a Tink; con `value` muestra el QR del enlace del usuario.
export function QrPanel({ value }: Props) {
  const active = !!value

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-border">
        <QRCodeSVG
          value={value ?? BASE_URL}
          size={192}
          level="M"
          fgColor={active ? '#0a0a0a' : '#d4d4d4'}
          bgColor="#ffffff"
        />
      </div>
      <p className="text-sm text-muted-foreground">
        {active ? 'Escanea para abrir tu enlace' : 'Tu código QR aparecerá aquí'}
      </p>
    </div>
  )
}
