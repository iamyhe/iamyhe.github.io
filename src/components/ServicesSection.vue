<script setup>
import SectionHeading from './SectionHeading.vue'
</script>

<template>
  <section id="services" class="section services" aria-labelledby="services-title">
    <div class="container">
      <SectionHeading index="02" kicker="Services" title="OFFERED SERVICES" align="center">
        <span id="services-title">OFFERED <span class="grad-text">SERVICES</span></span>
      </SectionHeading>

      <div class="services__grid">
        <article v-reveal:up="100" v-spotlight class="service-card glass">
          <div class="service-card__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
              <path d="M22 12A10 10 0 0 0 12 2v10z" />
            </svg>
          </div>
          <h3 class="service-card__title">Data Analysis & Visualization</h3>
          <p class="service-card__desc">Turning complex datasets into clear, interactive dashboards and actionable insights.</p>
        </article>

        <article v-reveal:up="200" v-spotlight class="service-card glass">
          <div class="service-card__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <h3 class="service-card__title">Machine Learning Models</h3>
          <p class="service-card__desc">Building predictive algorithms and intelligent models to solve real-world problems.</p>
        </article>

        <article v-reveal:up="300" v-spotlight class="service-card glass">
          <div class="service-card__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <ellipse cx="12" cy="5" rx="9" ry="3" />
              <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
              <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
            </svg>
          </div>
          <h3 class="service-card__title">Database Architecture</h3>
          <p class="service-card__desc">Designing scalable, normalized, and secure relational databases.</p>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.services {
  overflow: hidden;
}

.services__grid {
  margin-top: clamp(2.5rem, 5vw, 4rem);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: clamp(1.5rem, 3vw, 2.5rem);
}

.service-card {
  position: relative;
  padding: clamp(2rem, 4vw, 3rem) clamp(1.5rem, 3vw, 2rem);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.5s var(--ease-out), box-shadow 0.5s;
}

.service-card::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: var(--grad);
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.4s;
  pointer-events: none;
}

.service-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 60px -20px rgba(47, 123, 255, 0.35), 0 0 0 1px rgba(124, 58, 237, 0.1);
}

.service-card:hover::after {
  opacity: 1;
}

.service-card__icon {
  width: 72px;
  height: 72px;
  margin-bottom: 1.75rem;
  border-radius: 18px;
  display: grid;
  place-items: center;
  background: rgba(47, 123, 255, 0.08);
  border: 1px solid rgba(47, 123, 255, 0.15);
  color: var(--blue);
  transition: all 0.5s var(--ease-out);
}

.service-card:hover .service-card__icon {
  background: var(--grad);
  color: #fff;
  border-color: transparent;
  box-shadow: 0 0 30px rgba(47, 123, 255, 0.5);
  transform: scale(1.1) rotate(-4deg);
}

.service-card__icon svg {
  width: 32px;
  height: 32px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: stroke 0.4s;
}

.service-card__title {
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  margin-bottom: 1rem;
  color: var(--text);
}

.service-card__desc {
  font-size: 0.98rem;
  line-height: 1.6;
  color: var(--text-muted);
}
</style>
