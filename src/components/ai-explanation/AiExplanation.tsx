'use client'

import { useRef, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { explainPersonAction } from '../../app/actions/explain.ts'
import type { PersonType } from '../person/Person.tsx'

type Props = { person: PersonType }

/**
 * Renders an "Explain with AI" button on the details panel.
 * - Calls explainPersonAction (a server action) only on explicit user click.
 * - Caches the result per person+locale so re-renders never trigger extra requests.
 * - Renders the explanation as plain text — never via dangerouslySetInnerHTML.
 */
export const AiExplanation = ({ person }: Props) => {
  const locale = useLocale()
  const t = useTranslations('ai')
  const [isPending, setIsPending] = useState(false)
  const [explanation, setExplanation] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const cacheRef = useRef<Record<string, string>>({})

  const cacheKey = `${person.name}::${locale}`

  const requestExplanation = (force: boolean) => {
    if (!force) {
      const cached = cacheRef.current[cacheKey]
      if (cached) {
        setExplanation(cached)
        setError(null)
        return
      }
    } else {
      delete cacheRef.current[cacheKey]
    }

    setError(null)
    setIsPending(true)

    // Build an explicit allowlist — the url field is intentionally excluded.
    const personInput = {
      name: person.name,
      height: person.height,
      mass: person.mass,
      hair_color: person.hair_color,
      skin_color: person.skin_color,
      eye_color: person.eye_color,
      birth_year: person.birth_year,
      gender: person.gender,
    }

    explainPersonAction(personInput, locale).then((result) => {
      setIsPending(false)
      if (result.explanation) {
        cacheRef.current[cacheKey] = result.explanation
        setExplanation(result.explanation)
      } else if (result.errorCode) {
        setError(t(`error_${result.errorCode}`))
      }
    })
  }

  const handleMainClick = () => requestExplanation(explanation !== null)

  return (
    <div className="mt-3">
      <button
        className="btn btn-outline-primary btn-sm"
        onClick={handleMainClick}
        disabled={isPending}
      >
        {isPending ? t('loading') : explanation ? t('regenerate') : t('explain')}
      </button>

      {isPending && (
        <p className="text-muted mt-2" aria-live="polite">
          {t('loading')}
        </p>
      )}

      {explanation && !isPending && (
        <div className="mt-2 p-2 border rounded">
          <p className="mb-1">{explanation}</p>
          <small className="text-muted fst-italic">{t('disclaimer')}</small>
        </div>
      )}

      {error && !isPending && (
        <div className="mt-2">
          <p className="text-danger mb-1">{error}</p>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => requestExplanation(true)}
          >
            {t('retry')}
          </button>
        </div>
      )}
    </div>
  )
}
