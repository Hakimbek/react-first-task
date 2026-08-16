'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '../../i18n/navigation.ts'
import { routing } from '../../i18n/routing.ts'

export const LocaleSwitcher = () => {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const switchLocale = (next: string) => {
    router.replace(pathname, { locale: next })
  }

  return (
    <div className="d-flex gap-1">
      {routing.locales.map((loc) => (
        <button
          key={loc}
          onClick={() => switchLocale(loc)}
          className={`btn btn-sm ${locale === loc ? 'btn-primary' : 'border-0'}`}
        >
          {loc.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
