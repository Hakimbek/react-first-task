import { Spinner } from '../spinner/Spinner.tsx'

type SearchProps = {
  search: string
  isLoading: boolean
  onChange: (search: string) => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  onError: () => void
}

export const Search = ({ search, isLoading, onChange, onSubmit, onError }: SearchProps) => {
  return (
    <div className="container-fluid py-4 bg-light border-bottom">
      <div className="row d-flex justify-content-between">
        <div className="col-5">
          <form className="d-flex gap-2 w-50" onSubmit={onSubmit}>
            <input
              id="search"
              type="search"
              onChange={(e) => onChange(e.target.value)}
              value={search}
              className="form-control"
              placeholder="Search..."
            />
            <button
              type="submit"
              className="btn btn-primary d-flex align-items-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? <Spinner /> : <i className="bi bi-search"></i>}
            </button>
          </form>
        </div>
        <div className="col-5 d-flex justify-content-end">
          <button className="btn btn-danger" onClick={onError}>
            Test Error
          </button>
        </div>
      </div>
    </div>
  )
}
