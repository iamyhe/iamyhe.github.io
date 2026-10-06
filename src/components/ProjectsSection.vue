<script setup>
import { ref, computed } from 'vue'
import SectionHeading from './SectionHeading.vue'
import ProjectViz from './ProjectViz.vue'
import { projects, projectsMeta } from '../data/portfolio'

const activeIndex = ref(0)
const active = computed(() => projects[activeIndex.value])
const paused = ref(false)

function select(i) {
  activeIndex.value = (i + projects.length) % projects.length
}

/** Roving tab-index keyboard navigation for the project tablist. */
function onTabKey(e) {
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    e.preventDefault()
    select(activeIndex.value + 1)
    focusTab()
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    e.preventDefault()
    select(activeIndex.value - 1)
    focusTab()
  }
}
function focusTab() {
  requestAnimationFrame(() => document.getElementById(`project-tab-${active.value.id}`)?.focus())
}

const orbitStyle = (i) => ({
  '--size': `${40 + i * 18}%`,
  '--dur': `${26 + i * 9}s`,
  '--delay': `${-(i * 9.5 + 3)}s`,
})
</script>

<template>
  <section id="projects" class="section projects" aria-labelledby="projects-title">
    <div class="container">
      <SectionHeading index="03" kicker="Projects" :title="projectsMeta.title">
        <span id="projects-title">Interactive Data <span class="grad-text">Universe</span></span>
      </SectionHeading>

      <div class="projects__layout">
        <!-- Universe -->
        <div v-reveal:scale class="universe-wrap">
          <div
            class="universe"
            :class="{ 'is-paused': paused }"
            @mouseenter="paused = true"
            @mouseleave="paused = false"
          >
            <div class="universe__stars" aria-hidden="true" />
            <div class="universe__core" aria-hidden="true">
              <span class="mono">{{ String(projects.length).padStart(2, '0') }}</span>
              <small class="mono">projects</small>
            </div>

            <div v-for="(p, i) in projects" :key="p.id" class="orbit" :style="orbitStyle(i)">
              <button
                class="planet"
                :class="{ 'is-active': i === activeIndex }"
                type="button"
                tabindex="-1"
                :style="{ '--c1': p.colors[0], '--c2': p.colors[1] }"
                :aria-label="`Open project ${p.id}: ${p.title}`"
                @click="select(i)"
              >
                <span class="planet__body">
                  <span class="planet__orb">{{ p.id }}</span>
                  <span class="planet__label mono">{{ p.short }}</span>
                </span>
              </button>
            </div>
          </div>
          <p class="universe__hint mono">Hover to freeze orbit · click a planet</p>
        </div>

        <!-- Console -->
        <div class="console-wrap">
          <div v-reveal:right="150" class="console glass">
            <div class="console__bar" aria-hidden="true">
              <span /><span /><span />
              <p class="mono">~/yhe/projects/{{ active.short.toLowerCase() }}</p>
            </div>

            <Transition name="swap" mode="out-in">
              <article
                :id="`project-panel-${active.id}`"
                :key="active.id"
                class="console__body"
                role="tabpanel"
                :aria-labelledby="`project-tab-${active.id}`"
              >
                <header class="console__head">
                  <span class="console__index mono">
                    PROJECT <span class="grad-text">{{ active.id }}</span> / {{ String(projects.length).padStart(2, '0') }}
                  </span>
                </header>
                <h3 class="console__title">{{ active.title }}</h3>

                <ProjectViz :type="active.viz" class="console__viz" />

                <ul class="console__details">
                  <li v-for="(d, i) in active.details" :key="d" :style="{ '--i': i }">
                    <span class="console__bullet" aria-hidden="true">▹</span>{{ d }}
                  </li>
                </ul>

                <p v-if="active.dataset" class="console__dataset mono">
                  <span class="console__tech-label">dataset:</span> {{ active.dataset }}
                </p>

                <div class="console__tech">
                  <span class="console__tech-label mono">stack:</span>
                  <span v-for="t in active.tech" :key="t" class="chip">{{ t }}</span>
                </div>
              </article>
            </Transition>
          </div>

          <!-- Tabs -->
          <div v-reveal="250" class="tabs" role="tablist" aria-label="Projects" @keydown="onTabKey">
            <button
              v-for="(p, i) in projects"
              :id="`project-tab-${p.id}`"
              :key="p.id"
              class="tab"
              :class="{ 'is-active': i === activeIndex }"
              role="tab"
              type="button"
              :aria-selected="i === activeIndex"
              :aria-controls="`project-panel-${p.id}`"
              :tabindex="i === activeIndex ? 0 : -1"
              @click="select(i)"
            >
              <span class="tab__id mono">{{ p.id }}</span>
              <span class="tab__name">{{ p.short }}</span>
              <span class="tab__bar" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.projects__layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr);
  gap: clamp(2rem, 5vw, 4.5rem);
  align-items: center;
}

/* ---------------- Universe ---------------- */
.universe-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.universe {
  position: relative;
  width: min(100%, 540px);
  aspect-ratio: 1;
}
.universe__stars {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background-image:
    radial-gradient(1px 1px at 20% 30%, #fff, transparent),
    radial-gradient(1px 1px at 70% 20%, #9cc8ff, transparent),
    radial-gradient(1.5px 1.5px at 85% 65%, #fff, transparent),
    radial-gradient(1px 1px at 35% 80%, #c9a8ff, transparent),
    radial-gradient(1px 1px at 55% 55%, #fff, transparent),
    radial-gradient(1px 1px at 12% 62%, #9cc8ff, transparent),
    radial-gradient(circle, rgba(47, 123, 255, 0.12), transparent 65%);
  opacity: 0.8;
}
.universe__core {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 22%;
  aspect-ratio: 1;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(circle at 35% 30%, #7fd8ff, #2f7bff 40%, #4b1fa8 75%, #1a0b3d);
  box-shadow:
    0 0 40px rgba(47, 123, 255, 0.7),
    0 0 100px rgba(124, 58, 237, 0.5),
    inset -10px -10px 30px rgba(0, 0, 0, 0.45);
  animation: core-pulse 4s ease-in-out infinite;
}
.universe__core span {
  font-size: clamp(1.2rem, 2.5vw, 1.8rem);
  font-weight: 500;
  line-height: 1;
}
.universe__core small {
  font-size: 0.55rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  opacity: 0.85;
}

.orbit {
  position: absolute;
  top: 50%;
  left: 50%;
  width: var(--size);
  height: var(--size);
  margin: calc(var(--size) / -2) 0 0 calc(var(--size) / -2);
  border-radius: 50%;
  border: 1px dashed rgba(140, 160, 255, 0.18);
  animation: spin var(--dur) linear infinite;
  animation-delay: var(--delay);
  pointer-events: none;
}
.planet {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: auto;
  border-radius: 50%;
}
.planet__body {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  animation: spin var(--dur) linear infinite reverse;
  animation-delay: var(--delay);
}
.planet__orb {
  width: clamp(38px, 6vw, 54px);
  aspect-ratio: 1;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 500;
  color: #fff;
  background: radial-gradient(circle at 30% 30%, color-mix(in srgb, var(--c1) 70%, #fff), var(--c1) 45%, var(--c2) 100%);
  box-shadow:
    0 0 18px color-mix(in srgb, var(--c1) 60%, transparent),
    inset -6px -6px 14px rgba(0, 0, 0, 0.4);
  transition:
    transform 0.4s var(--ease-out),
    box-shadow 0.4s;
}
.planet__label {
  font-size: 0.65rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-muted);
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  background: rgba(5, 5, 10, 0.7);
  border: 1px solid var(--border);
  transition:
    color 0.3s,
    border-color 0.3s;
}
.planet:hover .planet__orb,
.planet.is-active .planet__orb {
  transform: scale(1.2);
  box-shadow:
    0 0 0 6px color-mix(in srgb, var(--c1) 22%, transparent),
    0 0 40px var(--c1),
    inset -6px -6px 14px rgba(0, 0, 0, 0.4);
}
.planet.is-active .planet__label {
  color: #fff;
  border-color: var(--c1);
}

.universe.is-paused .orbit,
.universe.is-paused .planet__body {
  animation-play-state: paused;
}

.universe__hint {
  margin-top: 1rem;
  font-size: 0.68rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--text-dim);
  text-align: center;
}

/* ---------------- Console ---------------- */
.console {
  overflow: hidden;
  background: linear-gradient(160deg, rgba(14, 14, 30, 0.9), rgba(7, 7, 16, 0.9));
  box-shadow: 0 30px 80px -30px rgba(47, 123, 255, 0.35);
}
.console__bar {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.8rem 1.1rem;
  border-bottom: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.02);
}
.console__bar span {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #2a2d45;
}
.console__bar span:nth-child(1) {
  background: #ff5f87;
}
.console__bar span:nth-child(2) {
  background: #ffc861;
}
.console__bar span:nth-child(3) {
  background: #3ee6a5;
}
.console__bar p {
  margin-left: 0.6rem;
  font-size: 0.72rem;
  color: var(--text-dim);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.console__body {
  padding: clamp(1.3rem, 3vw, 2rem);
}
.console__head {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.5rem 1rem;
  align-items: center;
}
.console__index {
  font-size: 0.72rem;
  letter-spacing: 0.2em;
  color: var(--text-muted);
}
.console__dataset {
  margin-top: 1.1rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 0.85rem;
  font-size: 0.78rem;
  color: var(--purple-2);
  border-radius: 999px;
  background: rgba(124, 58, 237, 0.12);
  border: 1px solid rgba(168, 85, 247, 0.3);
}
.console__title {
  margin-top: 0.9rem;
  font-size: clamp(1.4rem, 2.6vw, 2rem);
  letter-spacing: -0.02em;
}
.console__viz {
  margin-top: 1.25rem;
}
.console__details {
  margin-top: 1.25rem;
  display: grid;
  gap: 0.55rem;
}
.console__details li {
  display: flex;
  gap: 0.6rem;
  color: var(--text-muted);
  font-size: 0.95rem;
  animation: line-in 0.5s var(--ease-out) both;
  animation-delay: calc(0.15s + var(--i) * 80ms);
}
.console__bullet {
  color: var(--blue);
}
.console__tech {
  margin-top: 1.4rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}
.console__tech-label {
  font-size: 0.72rem;
  color: var(--text-dim);
  margin-right: 0.25rem;
}

/* ---- Tabs ---- */
.tabs {
  margin-top: 1rem;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.6rem;
}
.tab {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.15rem;
  padding: 0.75rem 0.9rem 0.9rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  background: var(--surface);
  text-align: left;
  overflow: hidden;
  transition:
    border-color 0.3s,
    background 0.3s,
    transform 0.3s var(--ease-out);
}
.tab:hover {
  border-color: var(--border-strong);
  transform: translateY(-2px);
}
.tab__id {
  font-size: 0.68rem;
  color: var(--text-dim);
}
.tab__name {
  font-size: 0.88rem;
  font-weight: 500;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}
.tab__bar {
  position: absolute;
  left: 0;
  bottom: 0;
  height: 2px;
  width: 100%;
  background: var(--grad);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.5s var(--ease-out);
}
.tab.is-active {
  border-color: rgba(0, 198, 255, 0.4);
  background: rgba(47, 123, 255, 0.08);
}
.tab.is-active .tab__id {
  color: var(--blue);
}
.tab.is-active .tab__name {
  color: #fff;
}
.tab.is-active .tab__bar {
  transform: scaleX(1);
}

/* ---- Panel swap transition ---- */
.swap-enter-active,
.swap-leave-active {
  transition:
    opacity 0.35s var(--ease-out),
    transform 0.35s var(--ease-out),
    filter 0.35s;
}
.swap-enter-from {
  opacity: 0;
  transform: translateY(14px);
  filter: blur(6px);
}
.swap-leave-to {
  opacity: 0;
  transform: translateY(-10px);
  filter: blur(6px);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
@keyframes core-pulse {
  50% {
    box-shadow:
      0 0 60px rgba(47, 123, 255, 0.9),
      0 0 140px rgba(124, 58, 237, 0.6),
      inset -10px -10px 30px rgba(0, 0, 0, 0.45);
  }
}
@keyframes line-in {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@media (max-width: 960px) {
  .projects__layout {
    grid-template-columns: minmax(0, 1fr);
  }
  .universe {
    width: min(100%, 420px);
  }
}
@media (max-width: 520px) {
  .tabs {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .universe {
    width: min(100%, 340px);
  }
  .planet__label {
    display: none;
  }
}
</style>
