<script setup>
defineProps({
  index: { type: String, required: true },
  kicker: { type: String, required: true },
  title: { type: String, required: true },
  align: { type: String, default: 'left' }, // left | center
})
</script>

<template>
  <header class="sh" :class="`sh--${align}`">
    <p v-reveal class="sh__kicker mono">
      <span class="sh__index">[{{ index }}]</span>
      <span class="sh__line" aria-hidden="true" />
      <span>{{ kicker }}</span>
    </p>
    <h2 v-reveal="120" class="sh__title">
      <slot>{{ title }}</slot>
    </h2>
  </header>
</template>

<style scoped>
.sh {
  margin-bottom: clamp(2.5rem, 6vw, 4.5rem);
}
.sh--center {
  text-align: center;
}
.sh--center .sh__kicker {
  justify-content: center;
}

.sh__kicker {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 0.75rem;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.sh__index {
  color: var(--blue);
  text-shadow: var(--glow-blue);
}
.sh__line {
  width: 48px;
  height: 1px;
  background: var(--grad);
  box-shadow: var(--glow-blue);
}

.sh__title {
  margin-top: 1rem;
  font-size: clamp(2.4rem, 7vw, 5.2rem);
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 0.98;
  background: linear-gradient(180deg, #fff 20%, #8d98d6 120%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
</style>
