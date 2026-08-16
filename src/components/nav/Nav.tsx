'use client'

import { usePathname } from '../../i18n/navigation.ts'
import { Link } from '../../i18n/navigation.ts'
import { useTranslations } from 'next-intl'
import { ThemeSwitcher } from '../theme-switcher/ThemeSwitcher.tsx'
import { LocaleSwitcher } from '../locale-switcher/LocaleSwitcher.tsx'

export const Nav = () => {
  const pathname = usePathname()
  const t = useTranslations('nav')
  const cls = (path: string) =>
    pathname === path ? 'nav-link active bg-body-secondary rounded' : 'nav-link'

  return (
    <nav className="bg-body-tertiary border-bottom p-2 d-flex justify-content-between align-items-center">
      <ul className="nav">
        <li className="nav-item">
          <Link href="/" className={cls('/')}>
            {t('home')}
          </Link>
        </li>
        <li className="nav-item">
          <Link href="/about" className={cls('/about')}>
            {t('about')}
          </Link>
        </li>
      </ul>
      <div className="d-flex align-items-center gap-2">
        <LocaleSwitcher />
        <ThemeSwitcher />
      </div>
    </nav>
  )
}
