'use client'

import { useTranslations } from 'next-intl'

export const Error = () => {
  const t = useTranslations('error')

  return (
    <div className="position-absolute w-100 top-0 bottom-0 d-flex justify-content-center align-items-center font-monospace text-danger">
      <h2>{t('somethingWentWrong')}</h2>
    </div>
  )
}
