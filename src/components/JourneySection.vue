<script setup>
/**
 * JourneySection — Experience & Education.
 * Left: glowing timeline (education / programs).
 * Right: certifications, animated achievement counters, signature quote.
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'
import SectionHeading from './SectionHeading.vue'
import { journey, education, certifications, achievements, quote } from '../data/portfolio'

const statsEl = ref(null)
const counts = ref(achievements.map(() => 0))
let io = null
let raf = 0

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)

function runCounters() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce) {
    counts.value = achievements.map((a) => a.value)
    return
  }
  const duration = 1600
  const start = performance.now()
  const step = (now) => {
    const t = Math.min(1, (now - start) / duration)
    counts.value = achievements.map((a) => Math.round(a.value * easeOutCubic(t)))
    if (t < 1) raf = requestAnimationFrame(step)
  }
  raf = requestAnimationFrame(step)
}

onMounted(() => {
  if (!('IntersectionObserver' in window)) return runCounters()
  io = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        runCounters()
        io.disconnect()
      }
    },
    { threshold: 0.4 },
  )
  if (statsEl.value) io.observe(statsEl.value)
})

onBeforeUnmount(() => {
  io?.disconnect()
  cancelAnimationFrame(raf)
})
</script>

<template>
  <section id="journey" class="section journey" aria-labelledby="journey-title">
    <div class="container">
      <SectionHeading index="04" kicker="Journey" :title="journey.title">
        <span id="journey-title">Experience &amp; <span class="grad-text">Education</span></span>
      </SectionHeading>

      <div class="journey__grid">
        <!-- ============ Left: Timeline ============ -->
        <div class="journey__col">
          <p v-reveal class="col-label mono">// timeline</p>
          <ol class="timeline">
            <li
              v-for="(e, i) in education"
              :key="e.org"
              v-reveal:left="i * 140"
              class="timeline__item"
              :class="{ 'is-current': e.current }"
            >
              <span class="timeline__node" aria-hidden="true"><span /></span>
              <article v-spotlight class="t-card glass">
                <p class="t-card__period mono">
                  <span v-if="e.current" class="t-card__live" aria-hidden="true" />
                  {{ e.period }}
                </p>
                <h3 class="t-card__org">{{ e.org }}</h3>
                <p class="t-card__program grad-text">{{ e.program }}</p>
                <p v-if="e.detail" class="t-card__detail">{{ e.detail }}</p>
              </article>
            </li>
          </ol>
        </div>

        <!-- ============ Right: Certifications & Achievements ============ -->
        <div class="journey__col">
          <p v-reveal class="col-label mono">// certifications &amp; achievements</p>

          <!-- Certifications -->
          <div v-reveal:right="80" v-spotlight class="panel glass">
            <header class="panel__head">
              <h3 class="panel__title">Certifications</h3>
              <span class="panel__count mono">{{ String(certifications.length).padStart(2, '0') }}</span>
            </header>
            <ul class="certs">
              <li v-for="(c, i) in certifications" :key="c.title" class="cert">
                <span class="cert__badge mono" aria-hidden="true">{{ String(i + 1).padStart(2, '0') }}</span>
                <div class="cert__body">
                  <p class="cert__title">{{ c.title }}</p>
                  <p class="cert__issuer mono">{{ c.issuer }}</p>
                </div>
                <svg class="cert__check" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 12.5l4.2 4.2L19 7" />
                </svg>
              </li>
            </ul>
          </div>

          <!-- Achievements -->
          <div ref="statsEl" v-reveal:right="180" class="stats" role="list" aria-label="Achievements">
            <div v-for="(a, i) in achievements" :key="a.label" class="stat glass" role="listitem">
              <p class="stat__value">
                <span class="grad-text">{{ counts[i] }}</span><span class="stat__suffix">{{ a.suffix }}</span>
              </p>
              <p class="stat__label mono">{{ a.label }}</p>
              <span class="stat__glow" aria-hidden="true" />
            </div>
          </div>

          <!-- Quote -->
          <figure v-reveal:right="280" class="quote glass">
            <span class="quote__mark" aria-hidden="true">“</span>
            <blockquote class="quote__text">{{ quote.text }}</blockquote>
            <figcaption class="quote__author mono">
              <span class="quote__line" aria-hidden="true" /> {{ quote.author }}
            </figcaption>
          </figure>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.journey__grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: clamp(2.5rem, 6vw, 5rem);
  align-items: start;
}
.journey__col {
  display: grid;
  gap: 1.25rem;
  min-width: 0;
}
.col-label {
  font-size: 0.75rem;
  color: var(--blue);
  letter-spacing: 0.2em;
  margin-bottom: 0.25rem;
}

/* ---------------- Timeline ---------------- */
.timeline {
  position: relative;
  display: grid;
  gap: 1.4rem;
  padding-left: 2.4rem;
}
.timeline::before {
  /* rail */
  content: '';
  position: absolute;
  left: 9px;
  top: 8px;
  bottom: 8px;
  width: 2px;
  border-radius: 2px;
  background: linear-gradient(180deg, var(--blue), var(--blue-2) 40%, var(--purple) 75%, transparent);
  opacity: 0.55;
}
.timeline::after {
  /* travelling data pulse */
  content: '';
  position: absolute;
  left: 7px;
  top: 0;
  width: 6px;
  height: 70px;
  border-radius: 6px;
  background: linear-gradient(180deg, transparent, #fff, var(--blue), transparent);
  filter: drop-shadow(0 0 8px var(--blue));
  animation: rail-pulse 4.5s var(--ease-in-out) infinite;
}

.timeline__item {
  position: relative;
}
.timeline__node {
  position: absolute;
  left: calc(-2.4rem + 2px);
  top: 1.55rem;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--bg);
  border: 2px solid var(--purple-2);
  box-shadow: 0 0 12px rgba(168, 85, 247, 0.6);
}
.timeline__node span {
  position: absolute;
  inset: 3px;
  border-radius: 50%;
  background: var(--purple-2);
}
.is-current .timeline__node {
  border-color: var(--blue);
  box-shadow: 0 0 14px var(--blue);
}
.is-current .timeline__node span {
  background: var(--blue);
}
.is-current .timeline__node::after {
  content: '';
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  border: 1px solid var(--blue);
  animation: node-ping 2.2s var(--ease-out) infinite;
}

.t-card {
  padding: clamp(1.25rem, 2.6vw, 1.7rem);
  transition:
    transform 0.5s var(--ease-out),
    border-color 0.4s,
    box-shadow 0.5s;
}
.t-card:hover {
  transform: translateX(6px);
  border-color: rgba(0, 198, 255, 0.35);
  box-shadow: 0 20px 60px -24px rgba(47, 123, 255, 0.45);
}
.t-card__period {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  font-size: 0.72rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.t-card__live {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #22e3a5;
  box-shadow: 0 0 10px #22e3a5;
  animation: blink 1.6s ease-in-out infinite;
}
.t-card__org {
  margin-top: 0.7rem;
  font-size: clamp(1.15rem, 2vw, 1.4rem);
  letter-spacing: -0.01em;
}
.t-card__program {
  margin-top: 0.35rem;
  font-weight: 600;
  font-size: 0.98rem;
  display: inline-block;
}
.t-card__detail {
  margin-top: 0.3rem;
  color: var(--text-muted);
  font-size: 0.92rem;
}

/* ---------------- Certifications panel ---------------- */
.panel {
  padding: clamp(1.25rem, 2.6vw, 1.7rem);
}
.panel__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
.panel__title {
  font-size: 1.1rem;
  letter-spacing: 0.04em;
}
.panel__count {
  font-size: 0.72rem;
  color: var(--blue);
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  border: 1px solid rgba(0, 198, 255, 0.3);
  background: rgba(0, 198, 255, 0.08);
}
.certs {
  display: grid;
  gap: 0.6rem;
}
.cert {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 0.9rem;
  padding: 0.8rem 0.9rem;
  border-radius: var(--radius-sm);
  border: 1px solid transparent;
  background: rgba(255, 255, 255, 0.02);
  transition:
    border-color 0.3s,
    background 0.3s,
    transform 0.4s var(--ease-out);
}
.cert:hover {
  border-color: rgba(168, 85, 247, 0.35);
  background: rgba(124, 58, 237, 0.08);
  transform: translateX(4px);
}
.cert__badge {
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  font-size: 0.72rem;
  color: #fff;
  background: var(--grad);
  box-shadow: 0 0 18px rgba(47, 123, 255, 0.35);
}
.cert__body {
  min-width: 0;
}
.cert__title {
  font-weight: 500;
  font-size: 0.97rem;
}
.cert__issuer {
  margin-top: 0.1rem;
  font-size: 0.74rem;
  color: var(--text-muted);
}
.cert__check {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: var(--blue);
  stroke-width: 2.2;
  stroke-linecap: round;
  stroke-linejoin: round;
  opacity: 0.35;
  transition: opacity 0.3s;
}
.cert:hover .cert__check {
  opacity: 1;
}

/* ---------------- Stats ---------------- */
.stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.75rem;
}
.stat {
  position: relative;
  overflow: hidden;
  padding: 1.1rem 0.6rem 1rem;
  text-align: center;
  transition:
    transform 0.4s var(--ease-out),
    border-color 0.3s;
}
.stat:hover {
  transform: translateY(-4px);
  border-color: rgba(0, 198, 255, 0.4);
}
.stat__value {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(1.9rem, 3.4vw, 2.6rem);
  line-height: 1;
  font-variant-numeric: tabular-nums;
}
.stat__suffix {
  color: var(--blue);
  margin-left: 2px;
}
.stat__label {
  margin-top: 0.5rem;
  font-size: 0.66rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.stat__glow {
  position: absolute;
  left: 50%;
  bottom: -40px;
  width: 80px;
  height: 80px;
  margin-left: -40px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(47, 123, 255, 0.45), transparent 70%);
  filter: blur(10px);
  opacity: 0.6;
  transition: opacity 0.3s;
}
.stat:hover .stat__glow {
  opacity: 1;
}

/* ---------------- Quote ---------------- */
.quote {
  position: relative;
  margin: 0;
  padding: clamp(1.5rem, 3vw, 2.1rem);
  overflow: hidden;
  background:
    radial-gradient(120% 120% at 100% 0%, rgba(124, 58, 237, 0.18), transparent 55%),
    radial-gradient(120% 120% at 0% 100%, rgba(0, 198, 255, 0.12), transparent 55%),
    linear-gradient(160deg, rgba(255, 255, 255, 0.045), rgba(255, 255, 255, 0.012));
}
.quote__mark {
  position: absolute;
  top: -1.6rem;
  right: 1rem;
  font-family: var(--font-display);
  font-size: 9rem;
  line-height: 1;
  background: var(--grad);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  opacity: 0.25;
}
.quote__text {
  position: relative;
  margin: 0;
  font-family: var(--font-display);
  font-weight: 500;
  font-size: clamp(1.25rem, 2.2vw, 1.6rem);
  line-height: 1.35;
  letter-spacing: -0.01em;
}
.quote__author {
  margin-top: 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 0.75rem;
  letter-spacing: 0.25em;
  color: var(--blue);
}
.quote__line {
  width: 36px;
  height: 1px;
  background: var(--grad);
}

/* ---------------- Keyframes ---------------- */
@keyframes rail-pulse {
  0% {
    top: 0;
    opacity: 0;
  }
  15% {
    opacity: 1;
  }
  85% {
    opacity: 1;
  }
  100% {
    top: calc(100% - 70px);
    opacity: 0;
  }
}
@keyframes node-ping {
  0% {
    transform: scale(0.6);
    opacity: 1;
  }
  100% {
    transform: scale(1.8);
    opacity: 0;
  }
}
@keyframes blink {
  50% {
    opacity: 0.25;
  }
}

/* ---------------- Responsive ---------------- */
@media (max-width: 960px) {
  .journey__grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
@media (max-width: 520px) {
  .stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .timeline {
    padding-left: 2rem;
  }
  .timeline__node {
    left: calc(-2rem + 2px);
  }
}
</style>
