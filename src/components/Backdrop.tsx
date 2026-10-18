import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import './backdrop.css'
import { GLITCH_EVENT } from '../data'
import { prefersReducedMotion } from '../hooks'

const GLYPHS = '0123456789ABCDEF<>[]{}/|=;$#*ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ01'

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

const TRAIL = 6

/** Canvas digital rain + ambient glow + drifting particles + glitch flashes. */
export default function Backdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const flashRef = useRef<HTMLDivElement>(null)

  /* ---- digital rain (canvas, ~18fps, paused when tab is hidden) ---- */
  useEffect(() => {
    if (prefersReducedMotion()) return
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    let width = 0
    let height = 0
    let columns = 0
    let drops: number[] = []
    let speeds: number[] = []
    let raf = 0
    let last = 0
    let fontSize = 16

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      width = window.innerWidth
      height = window.innerHeight
      fontSize = width < 700 ? 20 : 16
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      columns = Math.ceil(width / fontSize)
      drops = Array.from({ length: columns }, () => Math.random() * -40)
      speeds = Array.from({ length: columns }, () => 0.3 + Math.random() * 0.45)
    }

    resize()
    window.addEventListener('resize', resize)

    const draw = (t: number) => {
      raf = requestAnimationFrame(draw)
      if (t - last < 55) return /* ~18fps: slow, subtle rain */
      last = t
      ctx.clearRect(0, 0, width, height)
      ctx.font = `${fontSize}px 'JetBrains Mono', monospace`
      for (let i = 0; i < columns; i++) {
        const x = i * fontSize
        const cell = Math.floor(drops[i])
        const y = cell * fontSize
        if (y > -fontSize) {
          ctx.fillStyle = 'rgba(0, 255, 136, 0.45)'
          ctx.fillText(GLYPHS[(cell + i * 7 + GLYPHS.length * 8) % GLYPHS.length], x, y)
          for (let j = 1; j < TRAIL; j++) {
            const ty = y - j * fontSize
            if (ty < -fontSize) break
            ctx.fillStyle = `rgba(0, 255, 136, ${(0.2 / j).toFixed(3)})`
            ctx.fillText(
              GLYPHS[(cell - j * 13 + i * 31 + GLYPHS.length * 40) % GLYPHS.length],
              x,
              ty,
            )
          }
        }
        drops[i] += speeds[i]
        if (y > height + fontSize * TRAIL) drops[i] = -Math.random() * 30
      }
    }

    raf = requestAnimationFrame(draw)

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf)
      } else {
        last = 0
        raf = requestAnimationFrame(draw)
      }
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  /* ---- occasional ambient glitch + glitch on navigation ---- */
  useEffect(() => {
    if (prefersReducedMotion()) return
    const el = flashRef.current
    if (!el) return
    let timer = 0

    const fire = () => {
      el.classList.add('active')
      window.setTimeout(() => el.classList.remove('active'), 240)
    }
    const schedule = () => {
      timer = window.setTimeout(() => {
        fire()
        schedule()
      }, 9000 + Math.random() * 9000)
    }

    schedule()
    window.addEventListener(GLITCH_EVENT, fire)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener(GLITCH_EVENT, fire)
    }
  }, [])

  return (
    <div className="backdrop" aria-hidden="true">
      <canvas ref={canvasRef} className="rain" />
      <div className="ambient" />
      <div className="particles">
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
      <div ref={flashRef} className="glitch-flash" />
    </div>
  )
}
