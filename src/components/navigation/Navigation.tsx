import { useSelectionStore } from '../../services/useSelectionStore.ts'

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
  const selected = useSelectionStore((state) => state.selected)
  const clear = useSelectionStore((state) => state.clear)

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
            Cancel selection
          </button>
          <button className="btn btn-primary">
            Download
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
