import { createNavigation } from 'next-intl/navigation'
import { routing } from './routing.ts'

export const { Link, useRouter, usePathname, redirect, permanentRedirect } =
  createNavigation(routing)
