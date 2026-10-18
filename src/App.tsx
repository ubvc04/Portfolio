import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import './App.css'

const NAME = 'Bavesh'
const STATUS_COMMAND = 'software_engineer.init()'
const GITHUB_URL = 'https://github.com/ubvc04'

/** Tiny ambient particles: barely-visible green dots drifting slowly. */
const PARTICLES = [
  { x: 8, y: 78, size: 2, dur: 26, opacity: 0.2 },
  { x: 22, y: 40, size: 1, dur: 32, opacity: 0.15 },
  { x: 34, y: 88, size: 2, dur: 22, opacity: 0.18 },
  { x: 47, y: 26, size: 1, dur: 30, opacity: 0.13 },
  { x: 58, y: 66, size: 2, dur: 24, opacity: 0.16 },
  { x: 69, y: 18, size: 1, dur: 34, opacity: 0.12 },
  { x: 78, y: 82, size: 2, dur: 28, opacity: 0.18 },
  { x: 88, y: 48, size: 1, dur: 20, opacity: 0.15 },
  { x: 94, y: 70, size: 2, dur: 36, opacity: 0.11 },
]

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Current time in the Cook Islands (UTC-10, Pacific/Rarotonga) as HH:MM:SS. */
const formatCookIslandsTime = () =>
  new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Pacific/Rarotonga',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(new Date())

function useCookIslandsTime() {
  const [time, setTime] = useState(() => formatCookIslandsTime())

  useEffect(() => {
    const id = window.setInterval(() => setTime(formatCookIslandsTime()), 1000)
    return () => window.clearInterval(id)
  }, [])

  return time
}

/** The viewer's public IP address. Returns null until loaded or on failure. */
function useIpAddress() {
  const [ip, setIp] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    fetch('https://api.ipify.org?format=json', { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('ip lookup failed'))))
      .then((data: unknown) => {
        if (
          typeof data === 'object' &&
          data !== null &&
          typeof (data as { ip?: unknown }).ip === 'string'
        ) {
          setIp((data as { ip: string }).ip)
        }
      })
      .catch(() => {
        /* offline or rate-limited: keep the placeholder */
      })

    return () => controller.abort()
  }, [])

  return ip
}

/** Types `text` once with human-like variable speed. Instant when motion is reduced. */
function useTypewriter(text: string, startDelay = 450) {
  const [typed, setTyped] = useState(() => (prefersReducedMotion() ? text : ''))

  useEffect(() => {
    if (prefersReducedMotion()) return
    let cancelled = false
    let index = 0
    let timerId = 0

    const tick = () => {
      if (cancelled) return
      index += 1
      setTyped(text.slice(0, index))
      if (index < text.length) {
        timerId = window.setTimeout(tick, 35 + Math.random() * 45)
      }
    }

    timerId = window.setTimeout(tick, startDelay)
    return () => {
      cancelled = true
      window.clearTimeout(timerId)
    }
  }, [text, startDelay])

  return typed
}

function App() {
  const time = useCookIslandsTime()
  const ip = useIpAddress()
  const typed = useTypewriter(STATUS_COMMAND)
  const typingDone = typed.length === STATUS_COMMAND.length

  return (
    <div className="shell">
      <div className="ambient" aria-hidden="true" />
      <div className="particles" aria-hidden="true">
        {PARTICLES.map((p, i) => (
          <i
            key={i}
            style={
              {
                '--x': `${p.x}%`,
                '--y': `${p.y}%`,
                '--size': `${p.size}px`,
                '--dur': `${p.dur}s`,
                '--opacity': p.opacity,
              } as CSSProperties
            }
          />
        ))}
      </div>

      <main className="hero">
        <div className="meta fade-in delay-4">
          <span className="meta-status">
            <i className="dot" aria-hidden="true" />
            system online
          </span>
          <span className="meta-time" aria-hidden="true">
            {time}
            <span className="meta-label">CKT</span>
          </span>
          <span className="meta-ip">
            <span className="meta-label">your ip</span>
            {ip ?? '···'}
          </span>
        </div>

        <div className="content">
          <h1 className="name" data-text={NAME} aria-label={NAME}>
            {NAME.split('').map((char, i) => (
              <span
                key={i}
                className="char"
                aria-hidden="true"
                style={{ '--i': i } as CSSProperties}
              >
                {char}
              </span>
            ))}
          </h1>

          <p className="role fade-in delay-1">{"I'm a Software Engineer"}</p>

          <p className="status-line fade-in delay-2">
            <span className="sr-only">&gt; {STATUS_COMMAND}</span>
            <span aria-hidden="true">
              <span className="glyph">&gt;</span>
              {typed}
              <span className={typingDone ? 'cursor' : 'cursor cursor--hidden'} />
            </span>
          </p>

          <nav className="links fade-in delay-3" aria-label="Social links">
            <a
              className="link"
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub profile"
              title="GitHub"
            >
              <svg
                viewBox="0 0 24 24"
                width="19"
                height="19"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  fill="currentColor"
                  d="M12 .5C5.73.5.99 5.24.99 11.52c0 4.86 3.15 8.98 7.52 10.44.55.1.75-.24.75-.53l-.02-1.86c-3.06.67-3.71-1.49-3.71-1.49-.5-1.28-1.23-1.62-1.23-1.62-1-.69.08-.67.08-.67 1.11.08 1.7 1.14 1.7 1.14.99 1.69 2.6 1.2 3.23.92.1-.72.39-1.2.7-1.48-2.44-.28-5.01-1.22-5.01-5.44 0-1.2.43-2.18 1.13-2.95-.11-.28-.49-1.4.11-2.92 0 0 .92-.3 3.01 1.13a10.4 10.4 0 0 1 5.48 0c2.09-1.43 3.01-1.13 3.01-1.13.6 1.52.22 2.64.11 2.92.7.77 1.13 1.75 1.13 2.95 0 4.23-2.58 5.16-5.03 5.43.4.34.75 1.02.75 2.06l-.01 3.05c0 .29.2.64.76.53 4.36-1.46 7.51-5.58 7.51-10.44C23.01 5.24 18.27.5 12 .5Z"
                />
              </svg>
            </a>
          </nav>
        </div>
      </main>
    </div>
  )
}

export default App
