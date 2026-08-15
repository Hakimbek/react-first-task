import { NavLink, Routes, Route } from 'react-router-dom'
import { Home } from './layouts/home/Home.tsx'
import { About } from './layouts/about/About.tsx'
import { NotFound } from './layouts/not-found/NotFound.tsx'
import { Details } from './layouts/details/Details.tsx'
import { ThemeSwitcher } from './components/theme-switcher/ThemeSwitcher.tsx'

export const App = () => {
  return (
    <>
      <nav className="bg-body-tertiary border-bottom p-2 d-flex justify-content-between align-items-center">
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
          <li className="nav-item">
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
        <ThemeSwitcher />
      </nav>

      <Routes>
        <Route path="/" element={<Home />}>
          <Route path="details/:id" element={<Details />} />
        </Route>
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
