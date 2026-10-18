import './nav.css'
import { GITHUB_URL, GLITCH_EVENT } from '../data'

/** Minimal terminal-style navigation. */
export default function Nav() {
  const handleClick = () => {
    window.dispatchEvent(new Event(GLITCH_EVENT))
  }

  return (
    <nav className="nav" aria-label="Primary">
      <a className="brand" href="#home" onClick={handleClick}>
        <span className="brand-mark">&gt;</span>
        <i className="brand-cursor" aria-hidden="true" />
        <span className="brand-text">bavesh</span>
      </a>

      <ul className="nav-links">
        <li>
          <a href={GITHUB_URL} target="_blank" rel="noreferrer" onClick={handleClick}>
            <i aria-hidden="true" />
            github
          </a>
        </li>
      </ul>
    </nav>
  )
}
