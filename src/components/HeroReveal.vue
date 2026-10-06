<script setup>
import { ref, computed } from 'vue'
import { profile } from '../data/portfolio'

defineProps({
  revealed: { type: Boolean, default: false },
  // ms until the page auto-glides into About (0 = no auto-advance)
  countdown: { type: Number, default: 0 },
})
defineEmits(['explore'])

// Prefer a bundled copy in src/assets (hashed by Vite); otherwise use the
// public path "./assets/yasmin-photo.jpg". An empty glob is harmless.
const bundled = import.meta.glob('../assets/yasmin-photo.{jpg,jpeg,png,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
})
const photoSrc = Object.values(bundled)[0] || profile.photo

const imgFailed = ref(false)
const nameWords = computed(() => profile.name.split(' '))
</script>

<template>
  <section id="home" class="hero" :class="{ 'is-revealed': revealed }" aria-label="Introduction">
    <div class="hero__inner container">
      <!-- Profile orb -->
      <div class="avatar" style="--d: 0ms">
        <div class="avatar__halo" />
        <div class="avatar__ring" />
        <div class="avatar__orbit avatar__orbit--a"><span /></div>
        <div class="avatar__orbit avatar__orbit--b"><span /></div>
        <div class="avatar__frame">
          <img
            v-if="!imgFailed"
            :src="photoSrc"
            :alt="`Portrait of ${profile.name}`"
            width="480"
            height="480"
            decoding="async"
            fetchpriority="high"
            @error="imgFailed = true"
          />
          <div v-else class="avatar__fallback" role="img" :aria-label="`${profile.name} monogram`">
            <span class="grad-text">{{ profile.initials }}</span>
          </div>
        </div>
      </div>

      <h1 class="hero__name">
        <span
          v-for="(word, i) in nameWords"
          :key="word + i"
          class="hero__word"
          :style="{ '--d': `${250 + i * 110}ms` }"
          >{{ word }}</span
        >
      </h1>

      <p class="hero__title mono" style="--d: 600ms">
        <span class="hero__bracket">&lt;</span>
        <span class="grad-text">{{ profile.title }}</span>
        <span class="hero__bracket">/&gt;</span>
      </p>

      <p class="hero__usp" style="--d: 780ms">{{ profile.usp }}</p>

      <button id="hero-explore" class="hero__cue mono" type="button" style="--d: 1000ms" @click="$emit('explore')">
        <span>Explore the universe</span>
        <span class="hero__mouse" aria-hidden="true"><span /></span>
        <span
          class="hero__countdown"
          :class="{ 'is-on': countdown > 0 }"
          :style="{ '--count': `${countdown}ms` }"
          aria-hidden="true"
          ><span
        /></span>
      </button>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 100vh;
  min-height: 100svh;
  display: grid;
  place-items: center;
  padding-block: calc(var(--nav-h) + 1rem) 2.5rem;
  text-align: center;
}
.hero__inner {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* ---- Staggered entrance driven by .is-revealed ---- */
.avatar,
.hero__word,
.hero__title,
.hero__usp,
.hero__cue {
  opacity: 0;
  transform: translateY(28px);
  filter: blur(10px);
  transition:
    opacity 1.1s var(--ease-out) var(--d),
    transform 1.1s var(--ease-out) var(--d),
    filter 1.1s var(--ease-out) var(--d);
}
.avatar {
  transform: scale(0.6);
}
.is-revealed .avatar,
.is-revealed .hero__word,
.is-revealed .hero__title,
.is-revealed .hero__usp,
.is-revealed .hero__cue {
  opacity: 1;
  transform: none;
  filter: none;
}

/* ---- Avatar ---- */
.avatar {
  --size: clamp(150px, min(24vw, 28vh), 236px);
  position: relative;
  width: var(--size);
  height: var(--size);
  margin-bottom: clamp(1.4rem, 4vh, 2.4rem);
}
.avatar__halo {
  position: absolute;
  inset: -35%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(47, 123, 255, 0.35), rgba(124, 58, 237, 0.18) 40%, transparent 68%);
  filter: blur(20px);
  animation: breathe 5s ease-in-out infinite;
}
.avatar__ring {
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  background: conic-gradient(from 0deg, #00c6ff, #2f7bff, #7c3aed, #a855f7, transparent 75%, #00c6ff);
  -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2px));
  mask: radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2px));
  filter: drop-shadow(0 0 8px rgba(0, 198, 255, 0.7));
  animation: spin 6s linear infinite;
}
.avatar__orbit {
  position: absolute;
  border-radius: 50%;
  border: 1px dashed rgba(140, 160, 255, 0.2);
}
.avatar__orbit--a {
  inset: -22px;
  animation: spin 14s linear infinite;
}
.avatar__orbit--b {
  inset: -42px;
  border-style: solid;
  border-color: rgba(124, 58, 237, 0.14);
  animation: spin 22s linear infinite reverse;
}
.avatar__orbit span {
  position: absolute;
  top: -4px;
  left: 50%;
  width: 8px;
  height: 8px;
  margin-left: -4px;
  border-radius: 50%;
  background: var(--blue);
  box-shadow: 0 0 12px var(--blue), 0 0 24px var(--blue);
}
.avatar__orbit--b span {
  background: var(--purple-2);
  box-shadow: 0 0 12px var(--purple-2), 0 0 24px var(--purple-2);
}
.avatar__frame {
  position: absolute;
  inset: 4px;
  border-radius: 50%;
  overflow: hidden;
  background: radial-gradient(circle at 30% 25%, #1a1a3a, #07070f 70%);
  box-shadow:
    inset 0 0 30px rgba(0, 0, 0, 0.6),
    0 0 50px rgba(47, 123, 255, 0.25);
}
.avatar__frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.avatar__fallback {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: calc(var(--size) * 0.28);
  letter-spacing: 0.06em;
}

/* ---- Text ---- */
.hero__name {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0 0.28em;
  font-size: clamp(2.3rem, 6.4vw, 5rem);
  font-weight: 700;
  line-height: 1.02;
  letter-spacing: -0.035em;
  color: #fff;
}
.hero__word {
  display: inline-block;
  padding-bottom: 0.06em;
  background: linear-gradient(180deg, #ffffff 30%, #a9b4e8 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.hero__title {
  margin-top: 1rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: clamp(0.85rem, 1.6vw, 1.1rem);
  letter-spacing: 0.18em;
  text-transform: uppercase;
}
.hero__bracket {
  color: var(--text-dim);
}

.hero__usp {
  margin-top: 1.4rem;
  max-width: 40ch;
  font-size: clamp(1rem, 1.6vw, 1.2rem);
  color: var(--text-muted);
  font-weight: 300;
}

.hero__cue {
  margin-top: clamp(1.8rem, 5vh, 3rem);
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
  font-size: 0.68rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--text-dim);
  transition-property: opacity, transform, filter, color;
}
.hero__cue:hover {
  color: var(--blue);
}
.hero__mouse {
  position: relative;
  width: 22px;
  height: 34px;
  border-radius: 12px;
  border: 1.5px solid currentColor;
}
.hero__mouse span {
  position: absolute;
  top: 6px;
  left: 50%;
  width: 3px;
  height: 7px;
  margin-left: -1.5px;
  border-radius: 2px;
  background: var(--blue);
  animation: wheel 1.8s var(--ease-in-out) infinite;
}

/* Auto-advance indicator */
.hero__countdown {
  position: relative;
  width: 96px;
  height: 2px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.08);
  overflow: hidden;
  opacity: 0;
  transition: opacity 0.4s;
}
.hero__countdown span {
  position: absolute;
  inset: 0;
  background: var(--grad);
  box-shadow: var(--glow-blue);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s;
}
.hero__countdown.is-on {
  opacity: 1;
}
.hero__countdown.is-on span {
  transform: scaleX(1);
  transition: transform var(--count) linear;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
@keyframes breathe {
  50% {
    transform: scale(1.12);
    opacity: 0.7;
  }
}
@keyframes wheel {
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  70% {
    transform: translateY(10px);
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
}
</style>
