<script setup>
/**
 * App — single-page cinematic flow.
 *
 *   IntroCanvas  particles form "YHE" → dissolve into flow-field dust
 *        │ @reveal  (dust front sweeps past) → hero entrance starts
 *        │ @done    (overlay faded)         → unlock scroll, show nav
 *   HeroReveal   photo + name + title, short cinematic hold…
 *        └─────→ eased auto-glide into #about (cancelled if the visitor
 *                scrolls / clicks first). Everything else is one long,
 *                anchor-navigated page — no router needed.
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'
import BackgroundUniverse from './components/BackgroundUniverse.vue'
import IntroCanvas from './components/IntroCanvas.vue'
import NavBar from './components/NavBar.vue'
import HeroReveal from './components/HeroReveal.vue'
import AboutSection from './components/AboutSection.vue'
// Services Section added here
import ServicesSection from './components/ServicesSection.vue'
import SkillsSection from './components/SkillsSection.vue'
import ProjectsSection from './components/ProjectsSection.vue'
import JourneySection from './components/JourneySection.vue'
import ContactSection from './components/ContactSection.vue'
import SiteFooter from './components/SiteFooter.vue'
import { scrollToSection } from './composables/useSmoothScroll'

/** How long the hero is held on screen before gliding into About. */
const HERO_HOLD = 2600

const showIntro = ref(true)
const revealed = ref(false)
const introDone = ref(false)
const countdown = ref(0)

let autoTimer = 0
let userTookOver = false

const setLocked = (on) => document.documentElement.classList.toggle('is-locked', on)

function cancelAutoAdvance() {
  clearTimeout(autoTimer)
  countdown.value = 0
}

/** Any deliberate input after the intro means the visitor is in control. */
function onUserInput() {
  if (!introDone.value || userTookOver) return
  userTookOver = true
  cancelAutoAdvance()
}

function onReveal() {
  revealed.value = true
}

function onIntroDone() {
  showIntro.value = false
  introDone.value = true
  setLocked(false)

  // Deep link (e.g. /#projects) wins over the default About glide.
  const hash = decodeURIComponent(location.hash.slice(1))
  if (hash && hash !== 'home' && document.getElementById(hash)) {
    scrollToSection(hash, { duration: 1500 })
    return
  }

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce || userTookOver) return

  countdown.value = HERO_HOLD
  autoTimer = window.setTimeout(() => {
    countdown.value = 0
    if (userTookOver || window.scrollY > 40) return
    scrollToSection('about', { duration: 1800 })
  }, HERO_HOLD)
}

function onExplore() {
  cancelAutoAdvance()
  userTookOver = true
  scrollToSection('about', { duration: 1400 })
}

const INPUT_EVENTS = ['wheel', 'touchmove', 'keydown', 'pointerdown']

onMounted(() => {
  window.scrollTo(0, 0)
  // IntroCanvas mounts first; with reduced motion it may already be done.
  if (showIntro.value) setLocked(true)
  INPUT_EVENTS.forEach((e) => window.addEventListener(e, onUserInput, { passive: true }))
})

onBeforeUnmount(() => {
  cancelAutoAdvance()
  setLocked(false)
  INPUT_EVENTS.forEach((e) => window.removeEventListener(e, onUserInput))
})
</script>

<template>
  <BackgroundUniverse />

  <IntroCanvas v-if="showIntro" text="YHE" @reveal="onReveal" @done="onIntroDone" />

  <NavBar :visible="introDone" />

  <main id="main" class="page">
    <HeroReveal :revealed="revealed" :countdown="countdown" @explore="onExplore" />
    <AboutSection />
    <SkillsSection />
    <ServicesSection />
    <ProjectsSection />
    <JourneySection />
    <ContactSection />
  </main>

  <SiteFooter class="page" />
</template>

<style>
/* Content sits above the fixed BackgroundUniverse canvas (z-index 0). */
.page {
  position: relative;
  z-index: 1;
}
</style>
