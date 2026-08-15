import Link from 'next/link'

export const NotFound = () => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center p-5">
      <h1 className="fs-1">404</h1>
      <p className="fs-3">Page not found.</p>
      <Link className="fs-5" href="/">
        Go back home
      </Link>
    </div>
  )
}
