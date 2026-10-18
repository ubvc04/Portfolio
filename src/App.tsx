import { useEffect, useState } from 'react'
import './App.css'

const COMMAND = '> building_secure_things.exe'
const GITHUB_URL = 'https://github.com/ubvc04'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Types out `text` one character at a time. Shows it instantly when motion is reduced. */
function useTypewriter(text: string, speed = 45) {
  const [typed, setTyped] = useState(() => (prefersReducedMotion() ? text : ''))

  useEffect(() => {
    if (prefersReducedMotion()) return
    let index = 0
    const id = window.setInterval(() => {
      index += 1
      setTyped(text.slice(0, index))
      if (index >= text.length) window.clearInterval(id)
    }, speed)
    return () => window.clearInterval(id)
  }, [text, speed])

  return typed
}

/** Current UTC time as HH:MM:SS, refreshed every second. */
function useUtcClock() {
  const [time, setTime] = useState(() => new Date().toISOString().slice(11, 19))

  useEffect(() => {
    const id = window.setInterval(
      () => setTime(new Date().toISOString().slice(11, 19)),
      1000,
    )
    return () => window.clearInterval(id)
  }, [])

  return time
}

function App() {
  const typed = useTypewriter(COMMAND)
  const time = useUtcClock()
  const typingDone = typed.length === COMMAND.length

  return (
    <div className="shell">
      <main className="hero">
        <p className="prompt fade-in" aria-hidden="true">
          <span className="prompt-user">bavesh@portfolio</span>
          <span className="prompt-sep">:</span>
          <span className="prompt-path">~</span>
          <span className="prompt-symbol">$</span> whoami
        </p>

        <h1 className="name">
          <span className="name-line fade-in delay-1">Bavesh</span>
          <span className="name-line fade-in delay-2">Chowdary</span>
        </h1>

        <p className="role fade-in delay-3">Software Engineer</p>

        <p className="command fade-in delay-4">
          <span className="sr-only">{COMMAND}</span>
          <span aria-hidden="true">
            <span className="command-glyph">&gt;</span> {typed}
            <span className={typingDone ? 'cursor' : 'cursor cursor--hidden'} />
          </span>
        </p>

        <nav className="links fade-in delay-5" aria-label="Social links">
          <a
            className="link"
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub profile"
            title="GitHub"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
              <path
                fill="currentColor"
                d="M12 .5C5.73.5.99 5.24.99 11.52c0 4.86 3.15 8.98 7.52 10.44.55.1.75-.24.75-.53l-.02-1.86c-3.06.67-3.71-1.49-3.71-1.49-.5-1.28-1.23-1.62-1.23-1.62-1-.69.08-.67.08-.67 1.11.08 1.7 1.14 1.7 1.14.99 1.69 2.6 1.2 3.23.92.1-.72.39-1.2.7-1.48-2.44-.28-5.01-1.22-5.01-5.44 0-1.2.43-2.18 1.13-2.95-.11-.28-.49-1.4.11-2.92 0 0 .92-.3 3.01 1.13a10.4 10.4 0 0 1 5.48 0c2.09-1.43 3.01-1.13 3.01-1.13.6 1.52.22 2.64.11 2.92.7.77 1.13 1.75 1.13 2.95 0 4.23-2.58 5.16-5.03 5.43.4.34.75 1.02.75 2.06l-.01 3.05c0 .29.2.64.76.53 4.36-1.46 7.51-5.58 7.51-10.44C23.01 5.24 18.27.5 12 .5Z"
              />
            </svg>
          </a>
        </nav>
      </main>

      <footer className="statusbar fade-in delay-5">
        <span className="status">
          <i className="status-dot" aria-hidden="true" />
          system.ready
        </span>
        <span className="clock" aria-hidden="true">{time} UTC</span>
      </footer>
    </div>
  )
}

export default App
