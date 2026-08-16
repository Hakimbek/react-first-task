import { useTranslations } from 'next-intl'
import { Link } from '../../i18n/navigation.ts'

export const NotFound = () => {
  const t = useTranslations('notFound')

  return (
    <div className="d-flex flex-column align-items-center justify-content-center p-5">
      <h1 className="fs-1">{t('title')}</h1>
      <p className="fs-3">{t('message')}</p>
      <Link className="fs-5" href="/">
        {t('goHome')}
      </Link>
    </div>
  )
}
