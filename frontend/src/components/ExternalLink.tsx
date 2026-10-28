import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

// Enlace externo con el color de acento del sitio.
export function ExternalLink({ className, ...props }: ComponentProps<'a'>) {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      className={cn('text-foreground underline-offset-4 hover:underline', className)}
      {...props}
    />
  )
}
