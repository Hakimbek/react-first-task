import { NavLink, Routes, Route } from 'react-router-dom'
import { Home } from './layouts/home/Home.tsx'
import { About } from './layouts/about/About.tsx'
import { NotFound } from './layouts/not-found/NotFound.tsx'

export const App = () => {
  return (
    <>
      <nav className="bg-light border-bottom p-2">
        <ul className="nav">
          <li className="nav-item">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? 'nav-link active bg-body-secondary rounded' : 'nav-link'
              }
            >
              Home
            </NavLink>
          </li>
          <li className="nav">
            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive ? 'nav-link active bg-body-secondary rounded' : 'nav-link'
              }
            >
              About
            </NavLink>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
