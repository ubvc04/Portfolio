import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import './hero.css'
import { BOOT_LINES, EMAIL, GITHUB_URL, NAME } from '../data'
import {
  formatCookIslandsTime,
  formatLocalTime,
  prefersReducedMotion,
  useClock,
} from '../hooks'

const rand = (min: number, max: number) => min + Math.random() * (max - min)

/** Types the boot lines in sequence, once. Instant when motion is reduced. */
function useBootSequence(lines: string[]) {
  const [output, setOutput] = useState<string[]>(() =>
    prefersReducedMotion() ? lines : [],
  )
  const [done, setDone] = useState(() => prefersReducedMotion())

  useEffect(() => {
    if (prefersReducedMotion()) return
    let cancelled = false
    let lineIndex = 0
    let charIndex = 0
    let timer = 0
    const scratch: string[] = ['']

    const step = () => {
      if (cancelled) return
      const target = lines[lineIndex]
      if (charIndex <= target.length) {
        scratch[lineIndex] = target.slice(0, charIndex)
        setOutput([...scratch])
        charIndex += 1
        timer = window.setTimeout(step, rand(28, 72))
      } else if (lineIndex < lines.length - 1) {
        lineIndex += 1
        charIndex = 0
        scratch[lineIndex] = ''
        timer = window.setTimeout(step, 280)
      } else {
        setDone(true)
      }
    }

    timer = window.setTimeout(step, 350)
    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [lines])

  return { output, done }
}

/** Hero: boot-up log, name reveal, role, socials and the system status panel. */
export default function Hero() {
  const { output, done } = useBootSequence(BOOT_LINES)
  const now = useClock()

  return (
    <section className="hero" id="home">
      <aside className="status-panel fade-in delay-4">
        <span className="status-row">
          <i className="dot" aria-hidden="true" />
          system online
        </span>
        <span className="status-row status-time" aria-hidden="true">
          <span className="status-label">local</span>
          {formatLocalTime(now)}
        </span>
        <span className="status-row status-time" aria-hidden="true">
          <span className="status-label">ckt</span>
          {formatCookIslandsTime(now)}
        </span>
      </aside>

      <div className="hero-content">
        <p className="boot-log" aria-hidden="true">
          {output.map((line, i) => (
            <span key={i} className="boot-line">
              <span className="boot-glyph">&gt;</span> {line}
              {i === output.length - 1 && !done ? (
                <span className="cursor cursor--hidden" />
              ) : i === output.length - 1 ? (
                <span className="cursor" />
              ) : null}
            </span>
          ))}
        </p>
        <span className="sr-only">
          {'> initializing_system... > software_engineer.init()'}
        </span>

        <h1 className={done ? 'name revealed' : 'name'} data-text={NAME} aria-label={NAME}>
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

        <p className={done ? 'role revealed' : 'role'}>{"I'm a Software Engineer"}</p>

        <nav className={done ? 'socials revealed' : 'socials'} aria-label="Social links">
          <a
            className="social"
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub profile"
            title="GitHub"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
              <path
                fill="currentColor"
                d="M12 .5C5.73.5.99 5.24.99 11.52c0 4.86 3.15 8.98 7.52 10.44.55.1.75-.24.75-.53l-.02-1.86c-3.06.67-3.71-1.49-3.71-1.49-.5-1.28-1.23-1.62-1.23-1.62-1-.69.08-.67.08-.67 1.11.08 1.7 1.14 1.7 1.14.99 1.69 2.6 1.2 3.23.92.1-.72.39-1.2.7-1.48-2.44-.28-5.01-1.22-5.01-5.44 0-1.2.43-2.18 1.13-2.95-.11-.28-.49-1.4.11-2.92 0 0 .92-.3 3.01 1.13a10.4 10.4 0 0 1 5.48 0c2.09-1.43 3.01-1.13 3.01-1.13.6 1.52.22 2.64.11 2.92.7.77 1.13 1.75 1.13 2.95 0 4.23-2.58 5.16-5.03 5.43.4.34.75 1.02.75 2.06l-.01 3.05c0 .29.2.64.76.53 4.36-1.46 7.51-5.58 7.51-10.44C23.01 5.24 18.27.5 12 .5Z"
              />
            </svg>
          </a>
          <a
            className="social"
            href={`mailto:${EMAIL}`}
            aria-label="Send an email"
            title="Email"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
              <path
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                d="M3 6.5h18v11H3z"
              />
              <path
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                d="m3.5 7 8.5 6.5L20.5 7"
              />
            </svg>
          </a>
        </nav>
      </div>
    </section>
  )
}
