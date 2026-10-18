import { useEffect, useRef, useState } from 'react'
import './keyecho.css'
import { prefersReducedMotion } from '../hooks'

type Echo = { id: number; char: string; hex: string }

/**
 * Desktop-only flourish: keystrokes echo briefly as fading hex codes,
 * like watching bytes hit a register. Purely decorative.
 */
export default function Keyecho() {
  const [echoes, setEchoes] = useState<Echo[]>([])
  const nextId = useRef(0)

  useEffect(() => {
    if (prefersReducedMotion()) return

    const timers = new Set<number>()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return
      if (event.key.length !== 1) return
      if ((event.target as Element | null)?.closest?.('input, textarea')) return

      const id = nextId.current++
      const echo: Echo = {
        id,
        char: event.key === ' ' ? '␣' : event.key,
        hex: `0x${event.key.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0')}`,
      }
      setEchoes((prev) => [...prev.slice(-3), echo])

      const timer = window.setTimeout(() => {
        timers.delete(timer)
        setEchoes((prev) => prev.filter((item) => item.id !== id))
      }, 1400)
      timers.add(timer)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      for (const timer of timers) window.clearTimeout(timer)
    }
  }, [])

  if (echoes.length === 0) return null

  return (
    <div className="keyecho" aria-hidden="true">
      {echoes.map((echo) => (
        <span key={echo.id} className="keyecho-line">
          {echo.hex} · {echo.char}
        </span>
      ))}
    </div>
  )
}
