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
  return (
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
  )
}
