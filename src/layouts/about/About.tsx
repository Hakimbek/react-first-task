import Link from 'next/link'
import { useTranslations } from 'next-intl'

export const About = () => {
  const t = useTranslations('about')

  return (
    <div className="d-flex flex-column align-items-center justify-content-center p-5">
      <h1 className="fs-1">Khakim Bakhramov</h1>
      <p className="text-center my-5 fs-3">{t('bio')}</p>
      <Link href="https://rs.school/" className="fs-3" target="_blank">
        RS School
      </Link>
    </div>
  )
}
