<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import SectionHeading from './SectionHeading.vue'
import { skills } from '../data/portfolio'

const gridEl = ref(null)
const coreEl = ref(null)
const clusterEls = []
const lines = ref([])
const box = ref({ w: 0, h: 0 })
const active = ref(null)

let ro = null

function measure() {
  const grid = gridEl.value
  const core = coreEl.value
  if (!grid || !core) return
  const g = grid.getBoundingClientRect()
  const c = core.getBoundingClientRect()
  const cx = c.left + c.width / 2 - g.left
  const cy = c.top + c.height / 2 - g.top
  box.value = { w: g.width, h: g.height }
  lines.value = skills.clusters.map((cl, i) => {
    const el = clusterEls[i]
    if (!el) return null
    const r = el.getBoundingClientRect()
    const x2 = r.left + r.width / 2 - g.left
    const y2 = r.top + r.height / 2 - g.top
    // Gentle curve: control point offset perpendicular to the line.
    const mx = (cx + x2) / 2
    const my = (cy + y2) / 2
    const dx = x2 - cx
    const dy = y2 - cy
    const len = Math.hypot(dx, dy) || 1
    const bend = (i % 2 ? -1 : 1) * Math.min(60, len * 0.18)
    const qx = mx + (-dy / len) * bend
    const qy = my + (dx / len) * bend
    return { id: cl.id, d: `M ${cx} ${cy} Q ${qx} ${qy} ${x2} ${y2}` }
  })
}

const totalSkills = skills.clusters.reduce((n, c) => n + c.items.length, 0)

onMounted(async () => {
  await nextTick()
  measure()
  ro = new ResizeObserver(() => measure())
  ro.observe(gridEl.value)
  // Fonts can shift card heights after first paint.
  document.fonts?.ready.then(measure)
})

onBeforeUnmount(() => ro?.disconnect())
</script>

<template>
  <section id="skills" class="section skills" aria-labelledby="skills-title">
    <div class="container">
      <SectionHeading index="02" kicker="Skills" :title="skills.title">
        <span id="skills-title">Neural <span class="grad-text">Clusters</span></span>
      </SectionHeading>

      <div ref="gridEl" class="neural" :class="{ 'has-active': active }" @mouseleave="active = null">
        <!-- Synapses -->
        <svg
          class="neural__links"
          :viewBox="`0 0 ${box.w || 1} ${box.h || 1}`"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="synapse-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#00c6ff" />
              <stop offset="100%" stop-color="#a855f7" />
            </linearGradient>
            <filter id="synapse-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <g v-for="(l, i) in lines" :key="l?.id ?? i" :class="{ 'is-active': active === l?.id }">
            <template v-if="l">
              <path class="link link--base" :d="l.d" />
              <path
                class="link link--pulse"
                :d="l.d"
                pathLength="100"
                filter="url(#synapse-glow)"
                :style="{ animationDelay: `${i * -0.7}s` }"
              />
            </template>
          </g>
        </svg>

        <!-- Core -->
        <div ref="coreEl" v-reveal:scale class="core">
          <div class="core__rings" aria-hidden="true">
            <span /><span /><span />
          </div>
          <div class="core__body">
            <span class="core__label mono">Center focus</span>
            <h3 class="core__title">{{ skills.core }}</h3>
            <span class="core__count mono">{{ totalSkills }} nodes</span>
          </div>
        </div>

        <!-- Clusters -->
        <div
          v-for="(c, i) in skills.clusters"
          :key="c.id"
          :ref="(el) => (clusterEls[i] = el)"
          class="cluster-wrap"
          :style="{ gridArea: c.area }"
        >
          <div v-reveal="i * 110">
            <article
              v-spotlight
              class="cluster glass"
              :class="{ 'is-active': active === c.id }"
              tabindex="0"
              @mouseenter="active = c.id"
              @focus="active = c.id"
              @blur="active = null"
            >
              <header class="cluster__head">
                <span class="cluster__id mono">[{{ c.id }}]</span>
                <span class="cluster__node" aria-hidden="true" />
              </header>
              <h3 class="cluster__name">{{ c.name }}</h3>
              <ul class="cluster__items">
                <li v-for="(s, j) in c.items" :key="s" class="chip" :style="{ '--j': j }">{{ s }}</li>
              </ul>
            </article>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.neural {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  grid-template-areas:
    'c5 c1 c2'
    'c5 core c2'
    'c4 core c3';
  gap: clamp(1.25rem, 3vw, 2.5rem) clamp(1.25rem, 4vw, 4rem);
  align-items: center;
}

/* ---- Synapse SVG ---- */
.neural__links {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  pointer-events: none;
  z-index: 0;
}
.link {
  fill: none;
  stroke-linecap: round;
  transition:
    opacity 0.4s,
    stroke-width 0.4s;
}
.link--base {
  stroke: rgba(110, 130, 255, 0.18);
  stroke-width: 1.2;
  stroke-dasharray: 3 6;
}
.link--pulse {
  stroke: url(#synapse-grad);
  stroke-width: 2.2;
  stroke-dasharray: 10 90;
  animation: synapse 3.2s linear infinite;
  opacity: 0.85;
}
.has-active g:not(.is-active) .link {
  opacity: 0.15;
}
g.is-active .link--base {
  stroke: rgba(0, 198, 255, 0.55);
  stroke-dasharray: none;
}
g.is-active .link--pulse {
  stroke-width: 3;
  animation-duration: 1.4s;
}

@keyframes synapse {
  from {
    stroke-dashoffset: 100;
  }
  to {
    stroke-dashoffset: 0;
  }
}

/* ---- Core ---- */
.core {
  grid-area: core;
  position: relative;
  z-index: 1;
  justify-self: center;
  width: clamp(200px, 22vw, 260px);
  aspect-ratio: 1;
  display: grid;
  place-items: center;
}
.core__rings span {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 1px solid rgba(0, 198, 255, 0.35);
  animation: ripple 4.5s var(--ease-out) infinite;
}
.core__rings span:nth-child(2) {
  animation-delay: 1.5s;
  border-color: rgba(124, 58, 237, 0.4);
}
.core__rings span:nth-child(3) {
  animation-delay: 3s;
}
.core__body {
  position: relative;
  width: 78%;
  aspect-ratio: 1;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 0.5rem;
  background:
    radial-gradient(circle at 35% 30%, rgba(0, 198, 255, 0.35), transparent 55%),
    radial-gradient(circle at 70% 75%, rgba(124, 58, 237, 0.45), transparent 60%),
    #0a0a18;
  border: 1px solid rgba(140, 160, 255, 0.3);
  box-shadow:
    0 0 60px rgba(47, 123, 255, 0.35),
    0 0 120px rgba(124, 58, 237, 0.25),
    inset 0 0 40px rgba(0, 0, 0, 0.6);
  animation: core-float 6s ease-in-out infinite;
}
.core__body::before {
  content: '';
  position: absolute;
  inset: -8px;
  border-radius: 50%;
  border: 1.5px dashed rgba(0, 198, 255, 0.35);
  animation: spin 24s linear infinite;
}
.core__label {
  font-size: 0.6rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--blue);
}
.core__title {
  max-width: 9ch;
  font-size: clamp(1.15rem, 1.8vw, 1.45rem);
  line-height: 1.15;
}
.core__count {
  font-size: 0.65rem;
  color: var(--text-muted);
  letter-spacing: 0.15em;
}

/* ---- Clusters ---- */
.cluster-wrap {
  position: relative;
  z-index: 1;
  min-width: 0;
}
.cluster {
  padding: 1.4rem 1.4rem 1.5rem;
  background: linear-gradient(160deg, rgba(14, 14, 30, 0.85), rgba(8, 8, 18, 0.85));
  outline: none;
  transition:
    transform 0.5s var(--ease-out),
    border-color 0.4s,
    box-shadow 0.5s,
    opacity 0.4s,
    filter 0.4s;
}
.has-active .cluster:not(.is-active) {
  opacity: 0.45;
  filter: saturate(0.6);
}
.cluster.is-active {
  transform: translateY(-6px);
  border-color: rgba(0, 198, 255, 0.45);
  box-shadow:
    0 0 0 1px rgba(0, 198, 255, 0.15),
    0 24px 60px -18px rgba(47, 123, 255, 0.5),
    0 0 50px -10px rgba(124, 58, 237, 0.45);
}
.cluster__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.cluster__id {
  font-size: 0.75rem;
  color: var(--blue);
}
.cluster__node {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--purple-2);
  box-shadow: 0 0 0 4px rgba(168, 85, 247, 0.15), 0 0 14px var(--purple-2);
  transition:
    background 0.3s,
    box-shadow 0.3s;
}
.cluster.is-active .cluster__node {
  background: var(--blue);
  box-shadow: 0 0 0 5px rgba(0, 198, 255, 0.2), 0 0 18px var(--blue);
}
.cluster__name {
  margin-top: 0.9rem;
  font-size: 1.2rem;
  letter-spacing: 0.04em;
}
.cluster__items {
  margin-top: 1.1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}
.cluster__items .chip {
  white-space: normal;
}
.cluster.is-active .chip {
  animation: chip-pop 0.5s var(--ease-out) both;
  animation-delay: calc(var(--j) * 40ms);
}

@keyframes ripple {
  0% {
    transform: scale(0.7);
    opacity: 0.9;
  }
  100% {
    transform: scale(1.35);
    opacity: 0;
  }
}
@keyframes core-float {
  50% {
    transform: translateY(-8px);
  }
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
@keyframes chip-pop {
  from {
    transform: translateY(6px);
    opacity: 0.4;
  }
  to {
    transform: none;
    opacity: 1;
  }
}

/* ---- Tablet: core on top, clusters in 2 columns ---- */
@media (max-width: 1024px) {
  .neural {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-template-areas:
      'core core'
      'c1 c2'
      'c3 c4'
      'c5 c5';
  }
  .core {
    margin-bottom: 1rem;
  }
}

/* ---- Mobile: single column, synapses hidden ---- */
@media (max-width: 640px) {
  .neural {
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas: 'core' 'c1' 'c2' 'c3' 'c4' 'c5';
  }
  .neural__links {
    display: none;
  }
}
</style>
