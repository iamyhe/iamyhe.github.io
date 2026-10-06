<script setup>
/**
 * IntroCanvas — cinematic opening sequence.
 *
 *  1. FORM     Random particles are spring-attracted into the letters "YHE".
 *  2. HOLD     Letters breathe; the pointer can push particles around.
 *  3. DISSOLVE Particles break free into a curl-like flow field ("magic dust")
 *              while a wave of extra dust sweeps left → right.
 *  4. REVEAL   A soft-edged mask follows the dust front, uncovering the hero
 *              (profile photo + name) that sits underneath this overlay.
 *
 * Emits:
 *  - `reveal` when the sweep reaches the hero (start hero entrance animation)
 *  - `done`   when the overlay has fully faded out (safe to unmount)
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  text: { type: String, default: 'YHE' },
})
const emit = defineEmits(['reveal', 'done'])

const rootEl = ref(null)
const canvasEl = ref(null)
const coverEl = ref(null)
const progress = ref(0)
const stage = ref('form') // form | hold | dissolve
const fading = ref(false)

// Timeline (ms)
const T = { holdStart: 2300, dissolve: 3500, sweepDuration: 3000, fade: 900 }
const FEATHER = 280

// Electric blue → deep purple
const PALETTE = ['#00D4FF', '#14AEFF', '#2F7BFF', '#4F62FF', '#7C3AED', '#A855F7']

let ctx = null
let w = 0
let h = 0
let dpr = 1
let raf = 0
let last = 0
let elapsed = 0
let sprites = []
let particles = []
let dust = []
let dissolveStarted = false
let dissolveAt = 0
let front = -FEATHER * 2
let revealed = false
let finished = false
let fadeTimer = 0
const pointer = { x: -9999, y: -9999 }

const rand = (a, b) => a + Math.random() * (b - a)
const clamp = (v, a, b) => Math.max(a, Math.min(b, v))

function hexToRgba(hex, a) {
  const n = parseInt(hex.slice(1), 16)
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`
}

/** Pre-render one soft glowing sprite per palette colour (much cheaper than shadowBlur). */
function buildSprites() {
  sprites = PALETTE.map((color) => {
    const s = 32
    const c = document.createElement('canvas')
    c.width = c.height = s
    const g = c.getContext('2d')
    const grad = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2)
    grad.addColorStop(0, 'rgba(255,255,255,1)')
    grad.addColorStop(0.16, hexToRgba(color, 1))
    grad.addColorStop(0.42, hexToRgba(color, 0.32))
    grad.addColorStop(1, hexToRgba(color, 0))
    g.fillStyle = grad
    g.fillRect(0, 0, s, s)
    return c
  })
}

/** Rasterise the text off-screen and sample opaque pixels as particle targets. */
function sampleText() {
  const off = document.createElement('canvas')
  off.width = w
  off.height = h
  const o = off.getContext('2d', { willReadFrequently: true })
  const fontSize = Math.floor(Math.min(w * 0.3, h * 0.42))
  o.fillStyle = '#fff'
  o.textAlign = 'center'
  o.textBaseline = 'middle'
  o.font = `700 ${fontSize}px "Space Grotesk", "Inter", system-ui, sans-serif`
  if ('letterSpacing' in o) o.letterSpacing = `${Math.round(fontSize * 0.06)}px`
  o.fillText(props.text, w / 2, h / 2)

  const data = o.getImageData(0, 0, w, h).data
  const step = Math.max(2, Math.round(fontSize / 110))
  const pts = []
  let minX = Infinity
  let maxX = -Infinity
  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      if (data[(y * w + x) * 4 + 3] > 140) {
        pts.push({ x, y })
        if (x < minX) minX = x
        if (x > maxX) maxX = x
      }
    }
  }
  // Shuffle + cap for a consistent particle budget across devices.
  for (let i = pts.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0
    ;[pts[i], pts[j]] = [pts[j], pts[i]]
  }
  const budget = w < 700 ? 1100 : w < 1200 ? 1900 : 2600
  return { pts: pts.slice(0, budget), minX, maxX }
}

function colorIndexFor(x, minX, maxX) {
  const t = clamp((x - minX) / Math.max(1, maxX - minX), 0, 0.999)
  return Math.floor(t * PALETTE.length)
}

function createParticles() {
  const { pts, minX, maxX } = sampleText()
  const small = w < 700
  particles = pts.map((pt) => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: rand(-1, 1),
    vy: rand(-1, 1),
    tx: pt.x,
    ty: pt.y,
    delay: Math.random() * 700,
    size: rand(5, 9) * (small ? 0.75 : 1),
    c: colorIndexFor(pt.x, minX, maxX),
    phase: Math.random() * Math.PI * 2,
    alpha: rand(0.75, 1),
    free: false,
    // Left side of the word dissolves first so the dust "travels" with the sweep.
    freeAt: T.dissolve + ((pt.x - minX) / Math.max(1, maxX - minX)) * 650 + Math.random() * 200,
  }))
}

/** Re-target existing particles after a resize (only while still forming). */
function retarget() {
  const { pts, minX, maxX } = sampleText()
  if (!pts.length) return
  particles.forEach((p, i) => {
    const pt = pts[i % pts.length]
    p.tx = pt.x
    p.ty = pt.y
    p.c = colorIndexFor(pt.x, minX, maxX)
  })
}

function spawnDust() {
  const count = w < 700 ? 450 : 1000
  dust = Array.from({ length: count }, () => ({
    x: -rand(0, w * 0.55),
    y: rand(-h * 0.05, h * 1.05),
    vx: rand(5, 10),
    vy: rand(-1, 1),
    size: rand(3, 7),
    c: (Math.random() * PALETTE.length) | 0,
    alpha: rand(0.35, 0.9),
  }))
}

/** Smooth pseudo flow field (layered trig) — cheap, organic swirls. */
function flowAngle(x, y, t) {
  const s = 0.0024
  return (
    (Math.sin(x * s + t * 0.7) + Math.cos(y * s * 1.35 - t * 0.5) + Math.sin((x + y) * s * 0.6 + t * 0.35)) *
    Math.PI *
    0.55
  )
}

function resize() {
  const canvas = canvasEl.value
  if (!canvas) return
  dpr = Math.min(window.devicePixelRatio || 1, 2)
  w = window.innerWidth
  h = window.innerHeight
  canvas.width = Math.floor(w * dpr)
  canvas.height = Math.floor(h * dpr)
  canvas.style.width = `${w}px`
  canvas.style.height = `${h}px`
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  if (particles.length && !dissolveStarted) retarget()
}

function setFront(px) {
  coverEl.value?.style.setProperty('--front', `${px}px`)
}

function drawSprite(p) {
  const s = p.size
  ctx.globalAlpha = p.alpha
  ctx.drawImage(sprites[p.c], p.x - s / 2, p.y - s / 2, s, s)
}

function flow(p, t, f, sweep) {
  const a = flowAngle(p.x, p.y, t)
  p.vx += (Math.cos(a) * 0.55 + sweep) * f
  p.vy += Math.sin(a) * 0.55 * f
  const damp = Math.pow(0.95, f)
  p.vx *= damp
  p.vy *= damp
  p.x += p.vx * f
  p.y += p.vy * f
}

function frame(now) {
  raf = requestAnimationFrame(frame)
  const dt = Math.min(50, now - last) // clamp: survive tab switches / jank
  last = now
  elapsed += dt
  const f = dt / 16.667
  const t = elapsed
  const ts = t * 0.001
  const speed = Math.max(0.85, w / 1440)

  // ---- Stage bookkeeping -------------------------------------------------
  if (t < T.dissolve) {
    const pct = Math.min(100, Math.round((t / T.dissolve) * 100))
    if (pct !== progress.value) progress.value = pct
    if (t >= T.holdStart && stage.value === 'form') stage.value = 'hold'
  } else if (!dissolveStarted) {
    dissolveStarted = true
    dissolveAt = t
    stage.value = 'dissolve'
    spawnDust()
  }

  // ---- Trails: fade previous frame toward transparent ---------------------
  ctx.globalCompositeOperation = 'destination-out'
  const fadeA = dissolveStarted ? 0.14 : 0.38
  ctx.globalAlpha = 1 - Math.pow(1 - fadeA, f)
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, w, h)
  ctx.globalCompositeOperation = 'lighter'

  // ---- Letter particles --------------------------------------------------
  const R = Math.min(130, w * 0.12)
  const R2 = R * R
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i]
    if (p.alpha <= 0.01) continue

    if (!p.free && t >= p.freeAt) {
      p.free = true
      p.vx += rand(-1, 3)
      p.vy += rand(-4, 4)
    }

    if (p.free) {
      flow(p, ts, f, 0.42 * speed)
      p.alpha -= 0.0045 * f
    } else if (t < p.delay) {
      p.x += p.vx * f
      p.y += p.vy * f
    } else {
      const tx = p.tx + Math.sin(ts * 2 + p.phase) * 0.8
      const ty = p.ty + Math.cos(ts * 2.3 + p.phase) * 0.8
      const dx = p.x - pointer.x
      const dy = p.y - pointer.y
      const d2 = dx * dx + dy * dy
      if (d2 < R2) {
        const d = Math.sqrt(d2) || 1
        const force = (1 - d / R) * 5
        p.vx += (dx / d) * force * f
        p.vy += (dy / d) * force * f
      }
      p.vx += (tx - p.x) * 0.018 * f
      p.vy += (ty - p.y) * 0.018 * f
      const damp = Math.pow(0.84, f)
      p.vx *= damp
      p.vy *= damp
      p.x += p.vx * f
      p.y += p.vy * f
    }
    drawSprite(p)
  }

  // ---- Sweep dust + reveal front ----------------------------------------
  if (dissolveStarted) {
    let sumX = 0
    let alive = 0
    for (let i = 0; i < dust.length; i++) {
      const d = dust[i]
      if (d.x > w + 60) continue
      flow(d, ts, f, 0.6 * speed)
      sumX += d.x
      alive++
      drawSprite(d)
    }

    // Front follows the dust wave, with a time-based guarantee so it always completes.
    const since = t - dissolveAt
    const fromDust = alive ? sumX / alive + w * 0.18 : w + FEATHER * 2
    const fromTime = (since / T.sweepDuration) * (w + FEATHER * 2) - FEATHER
    front = Math.max(front, fromDust, fromTime)
    setFront(front)

    if (!revealed && front > w * 0.28) {
      revealed = true
      emit('reveal')
    }
    if (!finished && front > w + FEATHER && since > T.sweepDuration * 0.8) {
      finish()
    }
  }
  ctx.globalAlpha = 1
}

function finish() {
  if (finished) return
  finished = true
  if (!revealed) {
    revealed = true
    emit('reveal')
  }
  setFront(w + FEATHER * 3)
  fading.value = true
  fadeTimer = window.setTimeout(() => {
    cancelAnimationFrame(raf)
    emit('done')
  }, T.fade)
}

function skip() {
  finish()
}

function onPointerMove(e) {
  pointer.x = e.clientX
  pointer.y = e.clientY
}
function onPointerLeave() {
  pointer.x = pointer.y = -9999
}

onMounted(async () => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce) {
    emit('reveal')
    emit('done')
    return
  }

  ctx = canvasEl.value.getContext('2d')
  // Make sure the display font is ready before rasterising the letters.
  try {
    await Promise.race([
      document.fonts?.load('700 120px "Space Grotesk"'),
      new Promise((r) => setTimeout(r, 1200)),
    ])
  } catch {
    /* fall back to system font */
  }
  if (!canvasEl.value) return // unmounted while waiting

  buildSprites()
  resize()
  createParticles()
  window.addEventListener('resize', resize)
  window.addEventListener('pointermove', onPointerMove, { passive: true })
  document.addEventListener('pointerleave', onPointerLeave)
  last = performance.now()
  raf = requestAnimationFrame(frame)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  clearTimeout(fadeTimer)
  window.removeEventListener('resize', resize)
  window.removeEventListener('pointermove', onPointerMove)
  document.removeEventListener('pointerleave', onPointerLeave)
})
</script>

<template>
  <div ref="rootEl" class="intro" :class="{ 'is-fading': fading }" role="presentation">
    <div ref="coverEl" class="intro__cover" />
    <canvas ref="canvasEl" class="intro__canvas" aria-hidden="true" />

    <div class="intro__hud mono" :class="{ 'is-hidden': stage === 'dissolve' }" aria-hidden="true">
      <span class="intro__hud-label">
        {{ stage === 'form' ? 'Synthesizing data universe' : 'Pattern recognised' }}
      </span>
      <span class="intro__bar"><span :style="{ transform: `scaleX(${progress / 100})` }" /></span>
      <span class="intro__pct">{{ String(progress).padStart(3, '0') }}%</span>
    </div>

    <button id="skip-intro" class="intro__skip mono" type="button" @click="skip">
      Skip intro <span aria-hidden="true">→</span>
    </button>
  </div>
</template>

<style scoped>
.intro {
  position: fixed;
  inset: 0;
  z-index: 100;
  overflow: hidden;
  transition: opacity 0.9s var(--ease-out);
}
.intro.is-fading {
  opacity: 0;
  pointer-events: none;
}

/* Opaque dark cover — progressively masked away by the dust front. */
.intro__cover {
  --front: -560px;
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 60% 50% at 50% 50%, rgba(47, 123, 255, 0.07), transparent 70%),
    radial-gradient(ellipse 40% 40% at 70% 60%, rgba(124, 58, 237, 0.06), transparent 70%),
    #05050a;
  -webkit-mask-image: linear-gradient(
    96deg,
    transparent calc(var(--front) - 280px),
    #000 var(--front)
  );
  mask-image: linear-gradient(96deg, transparent calc(var(--front) - 280px), #000 var(--front));
}

.intro__canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.intro__hud {
  position: absolute;
  left: 50%;
  bottom: clamp(2rem, 8vh, 4.5rem);
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.22em;
  color: var(--text-muted);
  white-space: nowrap;
  transition:
    opacity 0.6s,
    transform 0.6s var(--ease-out);
}
.intro__hud.is-hidden {
  opacity: 0;
  transform: translate(-50%, 12px);
}
.intro__bar {
  position: relative;
  width: clamp(80px, 14vw, 180px);
  height: 2px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 2px;
  overflow: hidden;
}
.intro__bar span {
  position: absolute;
  inset: 0;
  background: var(--grad);
  transform-origin: left;
  box-shadow: var(--glow-blue);
}
.intro__pct {
  color: var(--blue);
  min-width: 3.5em;
}

.intro__skip {
  position: absolute;
  right: clamp(1rem, 3vw, 2rem);
  top: clamp(1rem, 3vw, 2rem);
  padding: 0.55rem 1rem;
  font-size: 0.72rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--text-muted);
  border: 1px solid var(--border);
  border-radius: 999px;
  background: rgba(5, 5, 10, 0.5);
  backdrop-filter: blur(8px);
  transition:
    color 0.3s,
    border-color 0.3s,
    box-shadow 0.3s;
}
.intro__skip:hover {
  color: var(--text);
  border-color: var(--blue);
  box-shadow: var(--glow-blue);
}

@media (max-width: 560px) {
  .intro__hud-label {
    display: none;
  }
}
</style>
