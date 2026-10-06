/**
 * v-spotlight — tracks the pointer inside an element and exposes its position
 * as --mx / --my CSS variables (consumed by the global `.spotlight` class).
 */
export default {
  mounted(el) {
    el.classList.add('spotlight')
    el.__spotlight = (e) => {
      const r = el.getBoundingClientRect()
      el.style.setProperty('--mx', `${e.clientX - r.left}px`)
      el.style.setProperty('--my', `${e.clientY - r.top}px`)
    }
    el.addEventListener('pointermove', el.__spotlight, { passive: true })
  },
  unmounted(el) {
    el.removeEventListener('pointermove', el.__spotlight)
    delete el.__spotlight
  },
}
