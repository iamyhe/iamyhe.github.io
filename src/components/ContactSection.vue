<script setup>
/**
 * ContactSection — "LET'S CONNECT".
 * A glowing transmission hub (email + copy) and social uplinks.
 */
import { ref, computed, onBeforeUnmount } from 'vue'
import SectionHeading from './SectionHeading.vue'
import { contact } from '../data/portfolio'

const copied = ref(false)
let copyTimer = 0

const socials = computed(() => [
  {
    id: 'linkedin',
    label: 'LinkedIn',
    href: contact.linkedin,
    handle: contact.linkedin.replace(/^https?:\/\//, ''),
    path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  },
  {
    id: 'github',
    label: 'GitHub',
    href: contact.github,
    handle: contact.github.replace(/^https?:\/\//, ''),
    path: 'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12',
  },
])

async function copyEmail() {
  try {
    await navigator.clipboard.writeText(contact.email)
  } catch {
    // Fallback for non-secure contexts
    const ta = document.createElement('textarea')
    ta.value = contact.email
    ta.setAttribute('readonly', '')
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    ta.remove()
  }
  copied.value = true
  clearTimeout(copyTimer)
  copyTimer = setTimeout(() => (copied.value = false), 2200)
}

onBeforeUnmount(() => clearTimeout(copyTimer))
</script>

<template>
  <section id="contact" class="section contact" aria-labelledby="contact-title">
    <div class="contact__aura" aria-hidden="true" />
    <div class="container">
      <SectionHeading index="05" kicker="Contact" :title="contact.title" align="center">
        <span id="contact-title">LET'S <span class="grad-text">CONNECT</span></span>
      </SectionHeading>

      <p v-reveal="160" class="contact__subtitle">Ready to make data-driven decisions? Let's talk.</p>

      <!-- Transmission hub -->
      <div v-reveal:scale="220" v-spotlight class="hub glass">
        <div class="hub__signal" aria-hidden="true">
          <span class="hub__ring" /><span class="hub__ring" /><span class="hub__ring" />
          <span class="hub__core">
            <svg viewBox="0 0 24 24">
              <path d="M3 6.5A1.5 1.5 0 0 1 4.5 5h15A1.5 1.5 0 0 1 21 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5v-11z" />
              <path d="M3.5 6l8.5 7 8.5-7" />
            </svg>
          </span>
        </div>

        <p class="hub__label mono">// email</p>
        <a id="contact-email" class="hub__email" :href="`mailto:${contact.email}`">{{ contact.email }}</a>

        <div class="hub__actions">
          <a id="contact-send" class="btn btn--primary" :href="`mailto:${contact.email}`">
            <span>Let's Talk Data</span>
            <span class="btn__arrow" aria-hidden="true">→</span>
          </a>
          <button id="contact-copy" class="btn btn--ghost" type="button" :class="{ 'is-done': copied }" @click="copyEmail">
            <svg v-if="!copied" viewBox="0 0 24 24" aria-hidden="true">
              <rect x="9" y="9" width="11" height="11" rx="2" />
              <path d="M5 15V5a2 2 0 0 1 2-2h8" />
            </svg>
            <svg v-else viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.2 4.2L19 7" /></svg>
            <span>{{ copied ? 'Copied!' : 'Copy email' }}</span>
          </button>
        </div>
        <p class="sr-only" aria-live="polite">{{ copied ? 'Email address copied to clipboard' : '' }}</p>
      </div>

      <!-- Social uplinks -->
      <ul class="socials">
        <li v-for="(s, i) in socials" :key="s.id" v-reveal="300 + i * 120">
          <a
            :id="`contact-${s.id}`"
            v-spotlight
            class="social glass"
            :href="s.href"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="`${s.label}: ${s.handle} (opens in a new tab)`"
          >
            <span class="social__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path :d="s.path" /></svg>
            </span>
            <span class="social__body">
              <span class="social__label">{{ s.label }}</span>
              <span class="social__handle mono">{{ s.handle }}</span>
            </span>
            <span class="social__arrow" aria-hidden="true">↗</span>
          </a>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.contact {
  overflow: hidden;
}
.contact__aura {
  position: absolute;
  left: 50%;
  top: 55%;
  width: min(1100px, 140vw);
  aspect-ratio: 1;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background:
    radial-gradient(circle, rgba(47, 123, 255, 0.16), transparent 55%),
    conic-gradient(from 0deg, rgba(0, 198, 255, 0.08), rgba(124, 58, 237, 0.12), rgba(0, 198, 255, 0.08));
  filter: blur(60px);
  pointer-events: none;
  animation: aura-spin 30s linear infinite;
}

.contact__subtitle {
  max-width: 46ch;
  margin: calc(-1 * clamp(1rem, 3vw, 2.5rem)) auto clamp(2.5rem, 5vw, 3.5rem);
  text-align: center;
  font-size: clamp(1.05rem, 1.8vw, 1.25rem);
  font-weight: 300;
  color: var(--text-muted);
}

/* ---------------- Hub ---------------- */
.hub {
  position: relative;
  max-width: 820px;
  margin-inline: auto;
  padding: clamp(2rem, 5vw, 3.25rem) clamp(1.25rem, 4vw, 3rem);
  text-align: center;
  overflow: hidden;
  background:
    radial-gradient(80% 60% at 50% 0%, rgba(47, 123, 255, 0.14), transparent 70%),
    linear-gradient(160deg, rgba(14, 14, 30, 0.85), rgba(7, 7, 16, 0.85));
  box-shadow:
    0 40px 120px -40px rgba(47, 123, 255, 0.45),
    0 0 0 1px rgba(124, 58, 237, 0.08);
}
.hub::after {
  /* gradient hairline */
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: var(--grad);
  -webkit-mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0.45;
  pointer-events: none;
}

.hub__signal {
  position: relative;
  width: 84px;
  height: 84px;
  margin: 0 auto 1.6rem;
  display: grid;
  place-items: center;
}
.hub__ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 1px solid rgba(0, 198, 255, 0.5);
  animation: signal 3.6s var(--ease-out) infinite;
}
.hub__ring:nth-child(2) {
  animation-delay: 1.2s;
  border-color: rgba(168, 85, 247, 0.5);
}
.hub__ring:nth-child(3) {
  animation-delay: 2.4s;
}
.hub__core {
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: radial-gradient(circle at 35% 30%, #7fd8ff, #2f7bff 45%, #5b21b6 100%);
  box-shadow:
    0 0 30px rgba(47, 123, 255, 0.7),
    0 0 70px rgba(124, 58, 237, 0.45);
}
.hub__core svg {
  width: 26px;
  height: 26px;
  fill: none;
  stroke: #fff;
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.hub__label {
  font-size: 0.72rem;
  letter-spacing: 0.22em;
  color: var(--blue);
}
.hub__email {
  display: inline-block;
  margin-top: 0.6rem;
  max-width: 100%;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: clamp(1.05rem, 3.3vw, 2.05rem);
  letter-spacing: -0.02em;
  line-height: 1.25;
  overflow-wrap: anywhere;
  background: linear-gradient(110deg, #fff 0%, #fff 40%, var(--blue) 70%, var(--purple-2) 100%);
  background-size: 220% 100%;
  background-position: 100% 0;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  transition: background-position 0.9s var(--ease-out);
}
.hub__email:hover {
  background-position: 0 0;
}

.hub__actions {
  margin-top: 1.8rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
}

/* ---------------- Buttons ---------------- */
.btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.85rem 1.4rem;
  border-radius: 999px;
  font-weight: 500;
  font-size: 0.95rem;
  transition:
    transform 0.35s var(--ease-out),
    box-shadow 0.35s,
    border-color 0.3s,
    background 0.3s,
    color 0.3s;
}
.btn svg {
  width: 17px;
  height: 17px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.btn--primary {
  color: #fff;
  background: var(--grad);
  background-size: 160% 100%;
  box-shadow: 0 10px 40px -10px rgba(47, 123, 255, 0.7);
}
.btn--primary:hover {
  transform: translateY(-2px);
  background-position: 100% 0;
  box-shadow:
    0 14px 50px -10px rgba(47, 123, 255, 0.85),
    0 0 40px rgba(124, 58, 237, 0.45);
}
.btn__arrow {
  transition: transform 0.35s var(--ease-out);
}
.btn--primary:hover .btn__arrow {
  transform: translateX(4px);
}
.btn--ghost {
  color: var(--text);
  border: 1px solid var(--border-strong);
  background: rgba(255, 255, 255, 0.03);
}
.btn--ghost:hover {
  transform: translateY(-2px);
  border-color: var(--blue);
  box-shadow: var(--glow-blue);
}
.btn--ghost.is-done {
  color: #22e3a5;
  border-color: rgba(34, 227, 165, 0.6);
  box-shadow: 0 0 22px rgba(34, 227, 165, 0.3);
}

/* ---------------- Socials ---------------- */
.socials {
  max-width: 820px;
  margin: 1.25rem auto 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.25rem;
}
.social {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 1rem;
  padding: 1.15rem 1.3rem;
  transition:
    transform 0.45s var(--ease-out),
    border-color 0.3s,
    box-shadow 0.45s;
}
.social:hover {
  transform: translateY(-4px);
  border-color: rgba(0, 198, 255, 0.4);
  box-shadow: 0 24px 60px -24px rgba(47, 123, 255, 0.55);
}
.social__icon {
  width: 46px;
  height: 46px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: rgba(47, 123, 255, 0.1);
  border: 1px solid rgba(47, 123, 255, 0.25);
  transition:
    background 0.35s,
    box-shadow 0.35s;
}
.social__icon svg {
  width: 21px;
  height: 21px;
  fill: var(--text);
}
.social:hover .social__icon {
  background: var(--grad);
  box-shadow: 0 0 24px rgba(47, 123, 255, 0.55);
}
.social__body {
  min-width: 0;
  display: grid;
}
.social__label {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 1.05rem;
}
.social__handle {
  font-size: 0.76rem;
  color: var(--text-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.social__arrow {
  font-size: 1.2rem;
  color: var(--text-dim);
  transition:
    transform 0.4s var(--ease-out),
    color 0.3s;
}
.social:hover .social__arrow {
  color: var(--blue);
  transform: translate(3px, -3px);
}

@keyframes signal {
  0% {
    transform: scale(0.7);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}
@keyframes aura-spin {
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

@media (max-width: 600px) {
  .socials {
    grid-template-columns: minmax(0, 1fr);
  }
  .btn {
    flex: 1 1 100%;
    justify-content: center;
  }
}
</style>
