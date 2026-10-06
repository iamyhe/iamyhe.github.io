import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import reveal from './directives/reveal'
import spotlight from './directives/spotlight'

// We orchestrate scroll ourselves (intro → hero → about), so never let the
// browser restore a stale position on reload.
if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

createApp(App)
  .directive('reveal', reveal)
  .directive('spotlight', spotlight)
  .mount('#app')
