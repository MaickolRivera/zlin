import { ExternalLink } from '@/components/ExternalLink'

export function Footer() {
  return (
    <footer className="pb-6 text-center text-xs text-muted-foreground">
      Desarrollado con ♥ por{' '}
      <ExternalLink href="https://github.com/MaickolRivera">Maickol Rivera</ExternalLink>
    </footer>
  )
}
