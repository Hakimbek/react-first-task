'use client'

import { useTranslations } from 'next-intl'
import { useSelectionStore } from '../../services/useSelectionStore.ts'
import { downloadCSV, toCSV } from '../../services/downloadCSV.ts'

type NavigationProps = {
  next: null | string
  previous: null | string
  page: number
  onNext: () => void
  onPrev: () => void
  isLoading: boolean
}

export const Navigation = ({
  next,
  previous,
  page,
  onNext,
  onPrev,
  isLoading,
}: NavigationProps) => {
  const t = useTranslations('navigation')
  const selected = useSelectionStore((state) => state.selected)
  const clear = useSelectionStore((state) => state.clear)

  const handleDownload = () => {
    const rows = Array.from(selected.values())

    if (rows.length === 0) return

    downloadCSV(`${selected.size}_items.csv`, toCSV(rows))
  }

  return (
    <>
      <div className="container-fluid d-flex gap-3 justify-content-center position-absolute bottom-0 py-3 bg-body-tertiary border-top">
        <button
          disabled={!previous || isLoading}
          className="btn btn-primary"
          onClick={() => onPrev()}
        >
          <i className="bi bi-arrow-left"></i>
        </button>
        <p className="p-0 m-0 fw-bold d-flex align-items-center">{page}</p>
        <button disabled={!next || isLoading} className="btn btn-primary" onClick={() => onNext()}>
          <i className="bi bi-arrow-right"></i>
        </button>
      </div>
      {selected.size > 0 && (
        <div className="position-absolute bottom-0 end-0 mb-3 me-3 d-flex gap-3">
          <button onClick={clear} className="btn btn-primary">
            {t('unselectAll')}
          </button>
          <button className="btn btn-primary" onClick={handleDownload}>
            {t('download')}
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {selected.size}
              <span className="visually-hidden">unread messages</span>
            </span>
          </button>
        </div>
      )}
    </>
  )
}
