<script setup>
import SectionHeading from './SectionHeading.vue'
import { about } from '../data/portfolio'

const lastLine = about.manifesto[about.manifesto.length - 1]
const leadLines = about.manifesto.slice(0, -1)
</script>

<template>
  <section id="about" class="section about" aria-labelledby="about-title">
    <div class="container">
      <SectionHeading index="01" kicker="About" :title="about.title">
        <span id="about-title">WHO IS <span class="grad-text about__yhe">YHE?</span></span>
      </SectionHeading>

      <div class="about__grid">
        <!-- Manifesto -->
        <div v-reveal:left="100" class="about__manifesto">
          <p class="about__label mono">// manifesto</p>
          <blockquote class="manifesto">
            <p v-for="line in leadLines" :key="line" class="manifesto__line manifesto__line--muted">
              {{ line }}
            </p>
            <p class="manifesto__line manifesto__line--hero">{{ lastLine }}</p>
          </blockquote>
          <div class="about__sign">
            <span class="about__sign-line" aria-hidden="true" />
            <span class="mono">YHE</span>
          </div>
        </div>

        <!-- Storytelling -->
        <div class="about__story-wrapper">
          <ol class="about__story">
            <li v-for="(s, i) in about.story" :key="s.key" v-reveal:right="150 + i * 140">
              <article v-spotlight class="story-card glass">
                <div class="story-card__letter" aria-hidden="true">{{ s.letter }}</div>
                <div class="story-card__body">
                  <h3 class="story-card__key">
                    <span class="grad-text">{{ s.letter }}</span>
                    <span class="story-card__dash" aria-hidden="true">—</span>
                    {{ s.key }}
                  </h3>
                  <p class="story-card__text">{{ s.text }}</p>
                </div>
                <span class="story-card__num mono" aria-hidden="true">0{{ i + 1 }}</span>
              </article>
            </li>
          </ol>
          <div v-reveal="300" class="about__quote glass">
            <p>"LEARN FROM THE GREAT. BECOME GREATER. BUILD WHAT COMES NEXT."</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about__yhe {
  display: inline-block;
}

.about__grid {
  display: grid;
  grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
  gap: clamp(2.5rem, 6vw, 5.5rem);
  align-items: start;
}

/* ---- Manifesto ---- */
.about__manifesto {
  position: sticky;
  top: calc(var(--nav-h) + 3rem);
}
.about__label {
  font-size: 0.75rem;
  color: var(--blue);
  letter-spacing: 0.2em;
  margin-bottom: 1.5rem;
}
.manifesto {
  margin: 0;
  position: relative;
  padding-left: clamp(1.25rem, 2.5vw, 2rem);
  border-left: 2px solid transparent;
  border-image: var(--grad) 1;
}
.manifesto__line {
  font-family: var(--font-display);
  font-weight: 600;
  letter-spacing: -0.03em;
  line-height: 1.12;
}
.manifesto__line--muted {
  font-size: clamp(1.6rem, 3.4vw, 2.6rem);
  color: var(--text-dim);
  text-decoration: line-through;
  text-decoration-color: rgba(124, 58, 237, 0.55);
  text-decoration-thickness: 2px;
}
.manifesto__line--hero {
  margin-top: 1rem;
  font-size: clamp(1.9rem, 4vw, 3.1rem);
  background: linear-gradient(110deg, #fff 0%, #fff 35%, var(--blue) 65%, var(--purple-2) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.about__sign {
  margin-top: 2.2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.72rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.about__sign-line {
  width: 60px;
  height: 1px;
  background: var(--grad);
}

/* ---- Story cards ---- */
.about__story {
  display: grid;
  gap: 1.25rem;
}
.story-card {
  position: relative;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: clamp(1rem, 2.5vw, 1.75rem);
  padding: clamp(1.4rem, 3vw, 2rem);
  overflow: hidden;
  transition:
    transform 0.5s var(--ease-out),
    border-color 0.4s,
    box-shadow 0.5s;
}
.story-card::after {
  /* gradient hairline on hover */
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: var(--grad);
  -webkit-mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.4s;
  pointer-events: none;
}
.story-card:hover {
  transform: translateX(-6px);
  box-shadow:
    0 20px 60px -20px rgba(47, 123, 255, 0.35),
    0 0 0 1px rgba(124, 58, 237, 0.1);
}
.story-card:hover::after {
  opacity: 1;
}

.story-card__letter {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(3.5rem, 7vw, 5rem);
  line-height: 0.85;
  color: transparent;
  -webkit-text-stroke: 1.5px rgba(140, 160, 255, 0.45);
  transition:
    color 0.5s,
    -webkit-text-stroke-color 0.5s,
    text-shadow 0.5s,
    transform 0.6s var(--ease-out);
}
.story-card:hover .story-card__letter {
  color: rgba(0, 198, 255, 0.12);
  -webkit-text-stroke-color: var(--blue);
  text-shadow: 0 0 30px rgba(0, 198, 255, 0.45);
  transform: scale(1.06) rotate(-4deg);
}

.story-card__key {
  font-size: 0.95rem;
  letter-spacing: 0.22em;
  font-weight: 600;
  color: var(--text);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.story-card__dash {
  color: var(--text-dim);
}
.story-card__text {
  margin-top: 0.7rem;
  color: var(--text-muted);
  font-size: 0.98rem;
  line-height: 1.7;
}
.story-card__num {
  position: absolute;
  top: 1rem;
  right: 1.2rem;
  font-size: 0.7rem;
  color: var(--text-dim);
}

/* ---- Quote ---- */
.about__quote {
  margin-top: 2rem;
  padding: 1.75rem 2rem;
  text-align: center;
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 600;
  font-size: clamp(1.15rem, 2vw, 1.45rem);
  line-height: 1.5;
  color: var(--text);
  border-left: 3px solid var(--blue);
  background: linear-gradient(90deg, rgba(47, 123, 255, 0.08) 0%, transparent 100%);
  border-radius: 0 12px 12px 0;
  box-shadow: -10px 0 30px -10px rgba(47, 123, 255, 0.15);
}
.about__quote p {
  background: linear-gradient(110deg, #fff 0%, #aabfff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  letter-spacing: -0.02em;
}

@media (max-width: 900px) {
  .about__grid {
    grid-template-columns: 1fr;
  }
  .about__manifesto {
    position: static;
  }
  .story-card:hover {
    transform: translateY(-4px);
  }
}
@media (max-width: 480px) {
  .story-card {
    grid-template-columns: 1fr;
  }
  .story-card__letter {
    font-size: 3rem;
  }
}
</style>
