<script setup>
/**
 * BackgroundUniverse — fixed, low-intensity constellation network that
 * gives every section the "AI & Data Universe" atmosphere.
 * Nodes drift, link when close, and reach toward the pointer.
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'

const canvasEl = ref(null)
let ctx = null
let w = 0
let h = 0
let raf = 0
let nodes = []
const mouse = { x: -9999, y: -9999 }
const LINK = 140
const MOUSE_LINK = 190

function init() {
  const canvas = canvasEl.value
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  w = window.innerWidth
  h = window.innerHeight
  canvas.width = Math.floor(w * dpr)
  canvas.height = Math.floor(h * dpr)
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

  const count = Math.min(110, Math.floor((w * h) / 15000))
  nodes = Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    r: Math.random() * 1.4 + 0.5,
    purple: Math.random() > 0.55,
  }))
}

function draw() {
  ctx.clearRect(0, 0, w, h)

  for (const n of nodes) {
    n.x += n.vx
    n.y += n.vy
    if (n.x < -20) n.x = w + 20
    else if (n.x > w + 20) n.x = -20
    if (n.y < -20) n.y = h + 20
    else if (n.y > h + 20) n.y = -20
  }

  ctx.lineWidth = 0.6
  for (let i = 0; i < nodes.length; i++) {
    const a = nodes[i]
    for (let j = i + 1; j < nodes.length; j++) {
      const b = nodes[j]
      const dx = a.x - b.x
      const dy = a.y - b.y
      const d2 = dx * dx + dy * dy
      if (d2 < LINK * LINK) {
        const alpha = (1 - Math.sqrt(d2) / LINK) * 0.16
        ctx.strokeStyle = `rgba(90,120,255,${alpha})`
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.stroke()
      }
    }
    // Pointer links
    const mx = a.x - mouse.x
    const my = a.y - mouse.y
    const md2 = mx * mx + my * my
    if (md2 < MOUSE_LINK * MOUSE_LINK) {
      const md = Math.sqrt(md2)
      const alpha = (1 - md / MOUSE_LINK) * 0.45
      ctx.strokeStyle = `rgba(0,198,255,${alpha})`
      ctx.beginPath()
      ctx.moveTo(a.x, a.y)
      ctx.lineTo(mouse.x, mouse.y)
      ctx.stroke()
      a.x -= mx * 0.004
      a.y -= my * 0.004
    }
  }

  for (const n of nodes) {
    ctx.fillStyle = n.purple ? 'rgba(168,85,247,0.75)' : 'rgba(0,198,255,0.75)'
    ctx.beginPath()
    ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
    ctx.fill()
  }
}

function loop() {
  draw()
  raf = requestAnimationFrame(loop)
}

function onMove(e) {
  mouse.x = e.clientX
  mouse.y = e.clientY
}
function onLeave() {
  mouse.x = mouse.y = -9999
}
function onVisibility() {
  cancelAnimationFrame(raf)
  if (!document.hidden && !reduce) raf = requestAnimationFrame(loop)
}

let reduce = false
let resizeTimer = 0
function onResize() {
  clearTimeout(resizeTimer)
  resizeTimer = setTimeout(() => {
    init()
    if (reduce) draw()
  }, 150)
}

onMounted(() => {
  reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ctx = canvasEl.value.getContext('2d')
  init()
  if (reduce) draw()
  else raf = requestAnimationFrame(loop)
  window.addEventListener('resize', onResize)
  window.addEventListener('pointermove', onMove, { passive: true })
  document.addEventListener('pointerleave', onLeave)
  document.addEventListener('visibilitychange', onVisibility)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  clearTimeout(resizeTimer)
  window.removeEventListener('resize', onResize)
  window.removeEventListener('pointermove', onMove)
  document.removeEventListener('pointerleave', onLeave)
  document.removeEventListener('visibilitychange', onVisibility)
})
</script>

<template>
  <div class="universe-bg" aria-hidden="true">
    <div class="nebula nebula--blue" />
    <div class="nebula nebula--purple" />
    <div class="nebula nebula--deep" />
    <canvas ref="canvasEl" class="universe-bg__canvas" />
    <div class="grid-overlay" />
    <div class="vignette" />
  </div>
</template>

<style scoped>
.universe-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
  background: var(--bg);
}
.universe-bg__canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.nebula {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  opacity: 0.55;
  will-change: transform;
}
.nebula--blue {
  width: 55vmax;
  height: 55vmax;
  left: -18vmax;
  top: -14vmax;
  background: radial-gradient(circle, rgba(0, 150, 255, 0.28), transparent 65%);
  animation: drift-a 28s ease-in-out infinite alternate;
}
.nebula--purple {
  width: 60vmax;
  height: 60vmax;
  right: -22vmax;
  bottom: -20vmax;
  background: radial-gradient(circle, rgba(124, 58, 237, 0.3), transparent 65%);
  animation: drift-b 34s ease-in-out infinite alternate;
}
.nebula--deep {
  width: 35vmax;
  height: 35vmax;
  left: 40%;
  top: 35%;
  background: radial-gradient(circle, rgba(47, 123, 255, 0.12), transparent 70%);
  animation: drift-a 40s ease-in-out infinite alternate-reverse;
}

.grid-overlay {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(120, 140, 255, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(120, 140, 255, 0.035) 1px, transparent 1px);
  background-size: 64px 64px;
  -webkit-mask-image: radial-gradient(ellipse 80% 70% at 50% 40%, #000 30%, transparent 80%);
  mask-image: radial-gradient(ellipse 80% 70% at 50% 40%, #000 30%, transparent 80%);
}

.vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, transparent 50%, rgba(5, 5, 10, 0.85) 100%);
}

@keyframes drift-a {
  to {
    transform: translate3d(8vw, 6vh, 0) scale(1.1);
  }
}
@keyframes drift-b {
  to {
    transform: translate3d(-7vw, -8vh, 0) scale(1.08);
  }
}
</style>
