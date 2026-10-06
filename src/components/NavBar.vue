<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { navLinks } from '../data/portfolio'
import { scrollToSection } from '../composables/useSmoothScroll'

defineProps({
  visible: { type: Boolean, default: true },
})

const activeId = ref('home')
const scrolled = ref(false)
const progress = ref(0)
const menuOpen = ref(false)

let io = null
let ticking = false

function onScroll() {
  if (ticking) return
  ticking = true
  requestAnimationFrame(() => {
    const y = window.scrollY
    const max = document.documentElement.scrollHeight - window.innerHeight
    scrolled.value = y > 24
    progress.value = max > 0 ? Math.min(1, y / max) : 0
    ticking = false
  })
}

/** Plain in-page anchors: eased scroll + keep the URL hash shareable. */
function onLinkClick(id) {
  menuOpen.value = false
  scrollToSection(id, { duration: 1100 })
  history.replaceState(null, '', `#${id}`)
}

function toTop() {
  menuOpen.value = false
  scrollToSection('home', { duration: 1100, offset: 0 })
  history.replaceState(null, '', location.pathname + location.search)
}

function onKey(e) {
  if (e.key === 'Escape') menuOpen.value = false
}

watch(menuOpen, (open) => {
  document.documentElement.classList.toggle('menu-open', open)
})

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKey)
  onScroll()

  io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) if (e.isIntersecting) activeId.value = e.target.id
    },
    { rootMargin: '-45% 0px -50% 0px' },
  )
  ;['home', ...navLinks.map((l) => l.id)].forEach((id) => {
    const el = document.getElementById(id)
    if (el) io.observe(el)
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKey)
  io?.disconnect()
  document.documentElement.classList.remove('menu-open')
})
</script>

<template>
  <header class="nav" :class="{ 'is-visible': visible, 'is-scrolled': scrolled, 'is-open': menuOpen }">
    <div class="nav__inner container">
      <a id="nav-logo" href="#home" class="nav__logo" aria-label="Back to top" @click.prevent="toTop">
        <span class="grad-text">YHE</span><span class="nav__logo-dot" />
      </a>

      <nav id="primary-nav" class="nav__links" aria-label="Primary">
        <ul>
          <li v-for="(link, i) in navLinks" :key="link.id" :style="{ '--i': i }">
            <a
              :id="`nav-${link.id}`"
              :href="`#${link.id}`"
              class="nav__link"
              :class="{ 'is-active': activeId === link.id }"
              :aria-current="activeId === link.id ? 'true' : undefined"
              @click.prevent="onLinkClick(link.id)"
            >
              <span class="nav__index mono">0{{ i + 1 }}</span>
              {{ link.label }}
            </a>
          </li>
        </ul>
      </nav>

      <a id="nav-cta" class="nav__cta" href="#contact" @click.prevent="onLinkClick('contact')">
        <span>Let's talk</span>
      </a>

      <button
        id="nav-toggle"
        class="nav__burger"
        type="button"
        :aria-expanded="menuOpen"
        aria-controls="primary-nav"
        :aria-label="menuOpen ? 'Close menu' : 'Open menu'"
        @click="menuOpen = !menuOpen"
      >
        <span /><span />
      </button>
    </div>
    <div class="nav__progress" :style="{ transform: `scaleX(${progress})` }" />
  </header>
</template>

<style scoped>
.nav {
  position: fixed;
  inset: 0 0 auto 0;
  z-index: 50;
  height: var(--nav-h);
  transform: translateY(-110%);
  opacity: 0;
  transition:
    transform 0.9s var(--ease-out),
    opacity 0.9s var(--ease-out),
    background 0.4s,
    border-color 0.4s;
  border-bottom: 1px solid transparent;
}
.nav.is-visible {
  transform: none;
  opacity: 1;
}
/* Glass layer lives on a pseudo-element: backdrop-filter on .nav itself would
   become the containing block for the fixed mobile menu. */
.nav::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(5, 5, 10, 0.62);
  backdrop-filter: blur(18px) saturate(140%);
  -webkit-backdrop-filter: blur(18px) saturate(140%);
  opacity: 0;
  transition: opacity 0.4s;
  pointer-events: none;
}
.nav.is-scrolled::before {
  opacity: 1;
}
.nav.is-scrolled {
  border-bottom-color: var(--border);
}

.nav__inner {
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
}

.nav__logo {
  position: relative;
  z-index: 2;
  display: inline-flex;
  align-items: flex-end;
  gap: 4px;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.45rem;
  letter-spacing: 0.06em;
}
.nav__logo-dot {
  width: 7px;
  height: 7px;
  margin-bottom: 7px;
  border-radius: 50%;
  background: var(--blue);
  box-shadow: var(--glow-blue);
  animation: pulse 2.4s ease-in-out infinite;
}

.nav__links ul {
  display: flex;
  gap: 0.35rem;
}
.nav__link {
  position: relative;
  display: inline-flex;
  align-items: baseline;
  gap: 0.4rem;
  padding: 0.5rem 0.9rem;
  font-size: 0.9rem;
  color: var(--text-muted);
  border-radius: 999px;
  transition:
    color 0.3s,
    background 0.3s;
}
.nav__index {
  font-size: 0.65rem;
  color: var(--text-dim);
  transition: color 0.3s;
}
.nav__link:hover {
  color: var(--text);
  background: var(--surface-2);
}
.nav__link.is-active {
  color: var(--text);
}
.nav__link.is-active .nav__index {
  color: var(--blue);
}
.nav__link::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 2px;
  width: 18px;
  height: 2px;
  border-radius: 2px;
  background: var(--grad);
  box-shadow: var(--glow-blue);
  transform: translateX(-50%) scaleX(0);
  transition: transform 0.4s var(--ease-out);
}
.nav__link.is-active::after {
  transform: translateX(-50%) scaleX(1);
}

.nav__cta {
  position: relative;
  padding: 0.55rem 1.15rem;
  font-size: 0.85rem;
  font-weight: 500;
  border-radius: 999px;
  background:
    linear-gradient(var(--bg), var(--bg)) padding-box,
    var(--grad) border-box;
  border: 1px solid transparent;
  transition:
    box-shadow 0.3s,
    transform 0.3s var(--ease-out);
}
.nav__cta:hover {
  box-shadow:
    0 0 22px rgba(0, 198, 255, 0.35),
    0 0 40px rgba(124, 58, 237, 0.25);
  transform: translateY(-1px);
}

.nav__progress {
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 2px;
  background: var(--grad);
  transform-origin: left;
  box-shadow: 0 0 12px rgba(0, 198, 255, 0.6);
}

.nav__burger {
  display: none;
  position: relative;
  z-index: 2;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid var(--border);
  background: rgba(5, 5, 10, 0.5);
}
.nav__burger span {
  position: absolute;
  left: 13px;
  right: 13px;
  height: 1.5px;
  background: var(--text);
  border-radius: 2px;
  transition:
    transform 0.4s var(--ease-out),
    top 0.4s var(--ease-out);
}
.nav__burger span:first-child {
  top: 17px;
}
.nav__burger span:last-child {
  top: 25px;
}
.nav.is-open .nav__burger span:first-child {
  top: 21px;
  transform: rotate(45deg);
}
.nav.is-open .nav__burger span:last-child {
  top: 21px;
  transform: rotate(-45deg);
}

@keyframes pulse {
  50% {
    opacity: 0.4;
    transform: scale(0.75);
  }
}

/* ---------- Mobile ---------- */
@media (max-width: 880px) {
  .nav__burger {
    display: block;
  }
  .nav__cta {
    display: none;
  }
  .nav__links {
    position: fixed;
    inset: 0;
    height: 100dvh;
    display: grid;
    place-items: center;
    background: rgba(5, 5, 10, 0.94);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    opacity: 0;
    visibility: hidden;
    transition:
      opacity 0.5s var(--ease-out),
      visibility 0.5s;
  }
  .nav.is-open .nav__links {
    opacity: 1;
    visibility: visible;
  }
  .nav__links ul {
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
  }
  .nav__links li {
    opacity: 0;
    transform: translateY(20px);
    transition:
      opacity 0.5s var(--ease-out),
      transform 0.5s var(--ease-out);
    transition-delay: calc(var(--i) * 60ms);
  }
  .nav.is-open .nav__links li {
    opacity: 1;
    transform: none;
  }
  .nav__link {
    font-family: var(--font-display);
    font-size: 2rem;
    padding: 0.4rem 1rem;
  }
  .nav__index {
    font-size: 0.8rem;
  }
}
</style>
