<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { AnimatePresence, motion } from 'motion-v'
import { gsap } from '@/lib/gsap'
import { nav, site } from '@/data/site'
import { navOnDark, ui } from '@/composables/useUiState'
import { prefersReducedMotion } from '@/composables/useReducedMotion'

const open = ref(false)
const hidden = ref(false)
const visible = computed(() => ui.introDone && !hidden.value)

// Se retira al bajar para no pisar el contenido y vuelve apenas se sube.
let lastY = 0
function onScroll() {
  const y = window.scrollY
  if (!open.value) {
    if (y > lastY + 6 && y > 200) hidden.value = true
    else if (y < lastY - 6 || y <= 200) hidden.value = false
  }
  lastY = y
}
onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
watch(open, (v) => (document.documentElement.style.overflow = v ? 'hidden' : ''))

function go(id: string) {
  open.value = false
  const target = document.getElementById(id)
  if (!target) return
  gsap.to(window, {
    scrollTo: { y: target, autoKill: true },
    duration: prefersReducedMotion() ? 0 : 1.3,
    ease: 'power3.inOut',
  })
}
function top() {
  gsap.to(window, { scrollTo: 0, duration: prefersReducedMotion() ? 0 : 1.6, ease: 'power3.inOut' })
}
</script>

<template>
  <motion.header
    class="fixed inset-x-0 top-0 z-[60] transition-colors duration-500"
    :class="navOnDark || open ? 'text-ivory' : 'text-charcoal'"
    :initial="{ opacity: 0, y: -10 }"
    :animate="visible || open ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }"
    :transition="{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }"
  >
    <nav class="wrap flex h-[var(--nav-h)] items-center justify-between" aria-label="Principal">
      <a href="#top" class="t-ui relative z-10 flex items-baseline gap-3 uppercase transition-opacity duration-500" :class="ui.pastHero || open ? 'opacity-100' : 'pointer-events-none opacity-0'" :tabindex="ui.pastHero ? undefined : -1" @click.prevent="top">
        {{ site.name }}
        <span class="t-meta muted hidden lg:inline">— Diseño Industrial</span>
      </a>

      <ul class="hidden items-center gap-8 md:flex">
        <li v-for="(item, i) in nav" :key="item.id">
          <a
            :href="`#${item.id}`"
            class="t-ui group relative flex items-baseline gap-2 py-2 uppercase"
            :aria-current="ui.active === item.id ? 'true' : undefined"
            @click.prevent="go(item.id)"
          >
            <span class="t-meta muted">{{ String(i + 1).padStart(2, '0') }}</span>
            {{ item.label }}
            <motion.span
              class="absolute inset-x-0 bottom-1 h-px origin-left bg-current"
              :initial="false"
              :animate="{ scaleX: ui.active === item.id ? 1 : 0 }"
              :transition="{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }"
              aria-hidden="true"
            />
          </a>
        </li>
      </ul>

      <button class="t-ui relative z-10 py-2 uppercase md:hidden" :aria-expanded="open" aria-controls="menu" @click="open = !open">
        {{ open ? 'Cerrar' : 'Índice' }}
      </button>
    </nav>
  </motion.header>

  <AnimatePresence>
    <motion.div
      v-if="open"
      id="menu"
      class="fixed inset-0 z-[55] flex flex-col justify-between bg-charcoal px-[var(--gutter)] pb-10 pt-[calc(var(--nav-h)+2rem)] text-ivory md:hidden"
      :initial="{ clipPath: 'inset(0% 0% 100% 0%)' }"
      :animate="{ clipPath: 'inset(0% 0% 0% 0%)' }"
      :exit="{ clipPath: 'inset(0% 0% 100% 0%)' }"
      :transition="{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }"
    >
      <ol>
        <li v-for="(item, i) in nav" :key="item.id" class="rule">
          <a :href="`#${item.id}`" class="flex items-baseline justify-between py-4" @click.prevent="go(item.id)">
            <span class="t-display text-[17vw]">{{ item.label }}</span>
            <span class="t-meta muted">{{ String(i + 1).padStart(2, '0') }}</span>
          </a>
        </li>
      </ol>
      <div class="t-meta muted flex justify-between"><span>{{ site.city }}</span><span>{{ site.coords }}</span></div>
    </motion.div>
  </AnimatePresence>
</template>
