/**
 * v-reveal — scroll-triggered entrance animation.
 *
 * Usage:
 *   <div v-reveal>               fade + rise
 *   <div v-reveal="200">         with 200ms delay
 *   <div v-reveal:left="100">    variants: left | right | scale
 */
let observer = null

function getObserver() {
  if (observer || typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return observer
  }
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
  )
  return observer
}

export default {
  mounted(el, binding) {
    el.classList.add('reveal')
    if (binding.arg) el.classList.add(`reveal--${binding.arg}`)
    if (typeof binding.value === 'number') {
      el.style.setProperty('--reveal-delay', `${binding.value}ms`)
    }
    const io = getObserver()
    if (io) io.observe(el)
    else el.classList.add('is-visible')
  },
  unmounted(el) {
    observer?.unobserve(el)
  },
}
