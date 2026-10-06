import { NAV_OFFSET } from '../constants'

const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

let activeCancel = null

/**
 * Cinematic, eased scroll to a section. Cancels itself if the user takes
 * over (wheel / touch / keyboard), so it never fights the visitor.
 */
export function scrollToSection(target, { duration = 1400, offset = NAV_OFFSET } = {}) {
  const el = typeof target === 'string' ? document.getElementById(target.replace(/^#/, '')) : target
  if (!el) return Promise.resolve()

  activeCancel?.()

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const startY = window.scrollY
  const endY = Math.max(0, el.getBoundingClientRect().top + startY - offset)

  if (reduce || Math.abs(endY - startY) < 2) {
    window.scrollTo(0, endY)
    return Promise.resolve()
  }

  return new Promise((resolve) => {
    let raf = 0
    const start = performance.now()
    const stop = () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('wheel', stop)
      window.removeEventListener('touchstart', stop)
      window.removeEventListener('keydown', stop)
      activeCancel = null
      resolve()
    }
    activeCancel = stop
    window.addEventListener('wheel', stop, { passive: true })
    window.addEventListener('touchstart', stop, { passive: true })
    window.addEventListener('keydown', stop)

    const step = (now) => {
      const t = Math.min(1, (now - start) / duration)
      window.scrollTo(0, startY + (endY - startY) * easeInOutCubic(t))
      if (t < 1) raf = requestAnimationFrame(step)
      else stop()
    }
    raf = requestAnimationFrame(step)
  })
}
