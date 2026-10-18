import { useEffect, useRef, useState } from 'react'
import './cursor.css'
import { hasFinePointer, prefersReducedMotion } from '../hooks'

/**
 * A soft green glow that trails the pointer on desktop.
 * The native cursor stays visible and fully functional.
 */
export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null)
  const [enabled] = useState(() => hasFinePointer() && !prefersReducedMotion())

  useEffect(() => {
    if (!enabled) return
    const el = glowRef.current
    if (!el) return

    let raf = 0
    let x = 0
    let y = 0

    const render = () => {
      raf = 0
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`
    }
    const onMove = (event: PointerEvent) => {
      x = event.clientX
      y = event.clientY
      if (!raf) raf = requestAnimationFrame(render)
      const interactive = (event.target as Element | null)?.closest?.('a, button, input')
      el.classList.toggle('cursor-glow--active', Boolean(interactive))
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [enabled])

  if (!enabled) return null

  return <div ref={glowRef} className="cursor-glow" aria-hidden="true" />
}
