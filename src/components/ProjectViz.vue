<script setup>
/**
 * ProjectViz — small animated SVG "data signature" for each project.
 * Re-mounting (via :key) replays the draw-in animation.
 */
defineProps({
  type: { type: String, required: true }, // regression | scheduler | space | erd
})

// Deterministic pseudo-random scatter for the regression plot.
function seeded(seed) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}
const r = seeded(42)
const scatter = Array.from({ length: 34 }, (_, i) => {
  const x = 24 + (i / 33) * 330 + (r() - 0.5) * 10
  const y = 128 - (x - 24) * 0.3 + (r() - 0.5) * 46
  return { x, y, d: i * 25 }
})

const gantt = [
  { p: 'P1', start: 0, len: 70, row: 0 },
  { p: 'P2', start: 70, len: 45, row: 1 },
  { p: 'P3', start: 115, len: 95, row: 2 },
  { p: 'P1', start: 210, len: 40, row: 0 },
  { p: 'P4', start: 250, len: 80, row: 3 },
]
</script>

<template>
  <div class="viz" aria-hidden="true">
    <!-- Regression: scatter + fitted line -->
    <svg v-if="type === 'regression'" viewBox="0 0 380 150" class="viz__svg">
      <g class="axis">
        <line x1="20" y1="140" x2="370" y2="140" />
        <line x1="20" y1="10" x2="20" y2="140" />
      </g>
      <circle
        v-for="(p, i) in scatter"
        :key="i"
        class="dot"
        :cx="p.x"
        :cy="p.y"
        r="3"
        :style="{ animationDelay: `${p.d}ms` }"
      />
      <line class="fit" x1="24" y1="130" x2="360" y2="30" pathLength="1" />
      <text x="300" y="22" class="label">ŷ = βx + ε</text>
    </svg>

    <!-- Scheduler: Gantt chart -->
    <svg v-else-if="type === 'scheduler'" viewBox="0 0 380 150" class="viz__svg">
      <g class="axis">
        <line x1="40" y1="134" x2="370" y2="134" />
      </g>
      <text v-for="n in 4" :key="n" x="10" :y="16 + (n - 1) * 30 + 12" class="label">P{{ n }}</text>
      <rect
        v-for="(g, i) in gantt"
        :key="i"
        class="bar"
        :class="`bar--${g.row}`"
        :x="40 + g.start"
        :y="14 + g.row * 30"
        :width="g.len"
        height="18"
        rx="4"
        :style="{ animationDelay: `${i * 260}ms` }"
      />
      <line class="cursor" x1="40" y1="8" x2="40" y2="134" />
      <text x="300" y="148" class="label">t (ms) →</text>
    </svg>

    <!-- Space: orbit + live API ping -->
    <svg v-else-if="type === 'space'" viewBox="0 0 380 150" class="viz__svg">
      <circle v-for="n in 26" :key="n" class="star" :cx="(n * 73) % 380" :cy="(n * 41) % 150" :r="(n % 3) * 0.5 + 0.5" :style="{ animationDelay: `${n * 120}ms` }" />
      <ellipse class="orbit" cx="190" cy="78" rx="140" ry="44" />
      <circle class="planet" cx="190" cy="78" r="22" />
      <g class="moon-track">
        <circle class="moon" cx="330" cy="78" r="6" />
      </g>
      <text x="16" y="22" class="label">GET /api.nasa.gov</text>
      <circle class="ping" cx="10" cy="18" r="3" />
    </svg>

    <!-- ERD: entities + relations -->
    <svg v-else viewBox="0 0 380 150" class="viz__svg">
      <path class="rel" d="M 112 50 L 160 50 L 160 96 L 200 96" pathLength="1" />
      <path class="rel" d="M 280 96 L 312 96 L 312 70" pathLength="1" style="animation-delay: 0.3s" />
      <g class="entity" style="--d: 0ms">
        <rect x="14" y="22" width="98" height="64" rx="8" />
        <text x="26" y="42" class="ent-title">Customer</text>
        <text x="26" y="60" class="ent-field">PK id</text>
        <text x="26" y="75" class="ent-field">email</text>
      </g>
      <g class="entity" style="--d: 200ms">
        <rect x="200" y="66" width="80" height="64" rx="8" />
        <text x="212" y="86" class="ent-title">Order</text>
        <text x="212" y="104" class="ent-field">PK id</text>
        <text x="212" y="119" class="ent-field">fk_*</text>
      </g>
      <g class="entity" style="--d: 400ms">
        <rect x="268" y="14" width="98" height="56" rx="8" />
        <text x="280" y="34" class="ent-title">Product</text>
        <text x="280" y="52" class="ent-field">PK id</text>
      </g>
      <text x="20" y="140" class="label">normalized schema</text>
    </svg>
  </div>
</template>

<style scoped>
.viz {
  position: relative;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  background:
    linear-gradient(rgba(120, 140, 255, 0.04) 1px, transparent 1px) 0 0 / 20px 20px,
    linear-gradient(90deg, rgba(120, 140, 255, 0.04) 1px, transparent 1px) 0 0 / 20px 20px,
    rgba(5, 5, 12, 0.7);
  padding: 0.75rem;
  overflow: hidden;
}
.viz__svg {
  width: 100%;
  height: auto;
  overflow: visible;
}
.axis line {
  stroke: rgba(140, 160, 255, 0.25);
  stroke-width: 1;
}
.label {
  font-family: var(--font-mono);
  font-size: 10px;
  fill: var(--text-muted);
}

/* Regression */
.dot {
  fill: var(--blue);
  opacity: 0;
  animation: pop 0.5s var(--ease-out) forwards;
  filter: drop-shadow(0 0 3px rgba(0, 198, 255, 0.8));
}
.fit {
  stroke: var(--purple-2);
  stroke-width: 2.5;
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  animation: draw 1.4s var(--ease-out) 0.7s forwards;
  filter: drop-shadow(0 0 6px rgba(168, 85, 247, 0.9));
}

/* Scheduler */
.bar {
  transform-box: fill-box;
  transform-origin: left;
  transform: scaleX(0);
  animation: grow 0.6s var(--ease-out) forwards;
}
.bar--0 {
  fill: #00c6ff;
}
.bar--1 {
  fill: #2f7bff;
}
.bar--2 {
  fill: #7c3aed;
}
.bar--3 {
  fill: #a855f7;
}
.cursor {
  stroke: #fff;
  stroke-width: 1;
  opacity: 0.6;
  animation: sweep 1.6s linear forwards;
}

/* Space */
.star {
  fill: #fff;
  animation: twinkle 2.4s ease-in-out infinite;
}
.orbit {
  fill: none;
  stroke: rgba(140, 160, 255, 0.3);
  stroke-dasharray: 4 5;
}
.planet {
  fill: #2f7bff;
  filter: drop-shadow(0 0 14px rgba(47, 123, 255, 0.9));
}
.moon-track {
  transform-origin: 190px 78px;
  animation: orbit 6s linear infinite;
}
.moon {
  fill: var(--purple-2);
  filter: drop-shadow(0 0 6px var(--purple-2));
}
.ping {
  fill: #22e3a5;
  animation: blink 1.2s ease-in-out infinite;
}

/* ERD */
.entity {
  opacity: 0;
  animation: pop 0.6s var(--ease-out) forwards;
  animation-delay: var(--d);
}
.entity rect {
  fill: rgba(16, 16, 36, 0.95);
  stroke: rgba(0, 198, 255, 0.5);
}
.ent-title {
  font-family: var(--font-display);
  font-size: 12px;
  font-weight: 600;
  fill: #fff;
}
.ent-field {
  font-family: var(--font-mono);
  font-size: 9.5px;
  fill: var(--text-muted);
}
.rel {
  fill: none;
  stroke: var(--purple-2);
  stroke-width: 1.5;
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  animation: draw 1s var(--ease-out) 0.6s forwards;
}

@keyframes pop {
  from {
    opacity: 0;
    transform: scale(0.4);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
.dot,
.entity {
  transform-box: fill-box;
  transform-origin: center;
}
@keyframes draw {
  to {
    stroke-dashoffset: 0;
  }
}
@keyframes grow {
  to {
    transform: scaleX(1);
  }
}
@keyframes sweep {
  to {
    transform: translateX(330px);
  }
}
@keyframes twinkle {
  50% {
    opacity: 0.2;
  }
}
@keyframes orbit {
  to {
    transform: rotate(360deg);
  }
}
@keyframes blink {
  50% {
    opacity: 0.2;
  }
}
</style>
