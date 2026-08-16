import type { AnchorHTMLAttributes } from 'react'

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string
}

const Link = ({ children, href, ...props }: LinkProps) => (
  <a href={href} {...props}>
    {children}
  </a>
)

export default Link
