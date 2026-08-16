import { routing } from '../../../i18n/routing.ts'
import { About } from '../../../layouts/about/About.tsx'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default function AboutPage() {
  return <About />
}
