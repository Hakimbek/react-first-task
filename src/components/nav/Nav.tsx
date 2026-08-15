'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ThemeSwitcher } from '../theme-switcher/ThemeSwitcher.tsx'

export const Nav = () => {
  const pathname = usePathname()
  const cls = (path: string) =>
    pathname === path ? 'nav-link active bg-body-secondary rounded' : 'nav-link'

  return (
    <nav className="bg-body-tertiary border-bottom p-2 d-flex justify-content-between align-items-center">
      <ul className="nav">
        <li className="nav-item">
          <Link href="/" className={cls('/')}>
            Home
          </Link>
        </li>
        <li className="nav-item">
          <Link href="/about" className={cls('/about')}>
            About
          </Link>
        </li>
      </ul>
      <ThemeSwitcher />
    </nav>
  )
}
