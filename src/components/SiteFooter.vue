<script setup>
import { profile, contact } from '../data/portfolio'
import { scrollToSection } from '../composables/useSmoothScroll'

const year = new Date().getFullYear()

function toTop() {
  scrollToSection('home', { duration: 1600, offset: 0 })
  history.replaceState(null, '', location.pathname + location.search)
}
</script>

<template>
  <footer class="footer">
    <div class="footer__mark" aria-hidden="true">{{ profile.initials }}</div>
    <div class="footer__inner container">
      <p class="footer__copy mono">© {{ year }} {{ profile.name }} · {{ profile.title }}</p>
      <nav class="footer__links" aria-label="Social">
        <a :href="`mailto:${contact.email}`">Email</a>
        <a :href="contact.linkedin" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a :href="contact.github" target="_blank" rel="noopener noreferrer">GitHub</a>
      </nav>
      <button id="back-to-top" class="footer__top mono" type="button" @click="toTop">
        Back to top <span aria-hidden="true">↑</span>
      </button>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  position: relative;
  padding: clamp(4rem, 10vw, 7rem) 0 2rem;
  overflow: hidden;
  border-top: 1px solid var(--border);
}
.footer__mark {
  position: absolute;
  left: 50%;
  bottom: -0.18em;
  transform: translateX(-50%);
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(8rem, 30vw, 22rem);
  line-height: 1;
  letter-spacing: 0.04em;
  color: transparent;
  -webkit-text-stroke: 1px rgba(140, 160, 255, 0.12);
  background: linear-gradient(180deg, rgba(47, 123, 255, 0.08), transparent 70%);
  -webkit-background-clip: text;
  background-clip: text;
  pointer-events: none;
  user-select: none;
}
.footer__inner {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem 2rem;
}
.footer__copy {
  font-size: 0.75rem;
  color: var(--text-dim);
}
.footer__links {
  display: flex;
  gap: 1.5rem;
  font-size: 0.88rem;
}
.footer__links a {
  color: var(--text-muted);
  transition: color 0.3s;
}
.footer__links a:hover {
  color: var(--blue);
}
.footer__top {
  padding: 0.55rem 1rem;
  font-size: 0.72rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--text-muted);
  border: 1px solid var(--border);
  border-radius: 999px;
  transition:
    color 0.3s,
    border-color 0.3s,
    box-shadow 0.3s;
}
.footer__top:hover {
  color: var(--text);
  border-color: var(--blue);
  box-shadow: var(--glow-blue);
}
@media (max-width: 640px) {
  .footer__inner {
    flex-direction: column;
    text-align: center;
  }
}
</style>
