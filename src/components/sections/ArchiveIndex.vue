<script setup lang="ts">
/**
 * Índice del archivo: un registro de objetos, no una grilla de tarjetas.
 * En desktop, al recorrer una fila aparece la imagen del objeto siguiendo el puntero (Motion).
 */
import { ref } from 'vue'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'motion-v'
import ArchiveImage from '@/components/ui/ArchiveImage.vue'
import { projects } from '@/data/projects'
import { gsap } from '@/lib/gsap'
import { useGsapContext, revealLines, trackSection } from '@/composables/useScrollAnimations'
import { hasFinePointer } from '@/composables/useDevice'
import { prefersReducedMotion } from '@/composables/useReducedMotion'

const root = ref<HTMLElement>()
const list = ref<HTMLElement>()
const title = ref<HTMLElement>()
const hover = ref<number | null>(null)

const x = useMotionValue(0)
const y = useMotionValue(0)
const sx = useSpring(x, { stiffness: 260, damping: 30 })
const sy = useSpring(y, { stiffness: 260, damping: 30 })

function move(e: PointerEvent) {
  if (!hasFinePointer() || !list.value) return
  const r = list.value.getBoundingClientRect()
  x.set(e.clientX - r.left)
  y.set(e.clientY - r.top)
}
function go(anchor: string) {
  gsap.to(window, { scrollTo: { y: `#${anchor}`, autoKill: true }, duration: prefersReducedMotion() ? 0 : 1.3, ease: 'power3.inOut' })
}

useGsapContext(() => {
  trackSection(root.value, 'archivo')
  revealLines(title.value)
}, root)
</script>

<template>
  <section id="archivo" ref="root" class="bg-ivory pb-[clamp(5rem,10vw,10rem)] pt-[clamp(5rem,10vw,10rem)]" aria-labelledby="archivo-title">
    <div class="wrap">
      <div class="grid-12 items-end gap-y-6">
        <p class="t-meta col-span-12 flex gap-4 md:col-span-3"><span>03</span><span>Archivo</span></p>
        <h2 id="archivo-title" ref="title" class="t-display col-span-12 text-[clamp(4rem,13vw,15rem)] md:col-span-9">Archivo de objetos</h2>
      </div>

      <div ref="list" class="relative mt-[clamp(3rem,6vw,6rem)]" @pointermove="move" @pointerleave="hover = null">
        <div class="t-meta muted rule-b hidden grid-cols-12 gap-4 pb-3 md:grid" aria-hidden="true">
          <span class="col-span-1">Nº</span>
          <span class="col-span-5">Objeto</span>
          <span class="col-span-3">Categoría</span>
          <span class="col-span-3">Material</span>
        </div>

        <ol>
          <li v-for="(p, i) in projects" :key="p.n" class="rule-b">
            <a
              :href="`#${p.anchor}`"
              class="group grid grid-cols-[4.5rem_1fr] items-center gap-x-4 gap-y-2 py-6 md:grid-cols-12 md:py-8"
              @click.prevent="go(p.anchor)"
              @pointerenter="hover = i"
              @focus="hover = i"
              @blur="hover = null"
            >
              <span class="t-num row-span-2 text-[clamp(3rem,6vw,6rem)] md:col-span-1 md:row-span-1">{{ p.n }}</span>
              <span class="t-head text-[clamp(1.6rem,3vw,3rem)] transition-transform duration-500 ease-[var(--ease-out-expo)] md:col-span-5 md:group-hover:translate-x-3">
                {{ p.title }}
              </span>
              <span class="t-meta md:col-span-3">{{ p.category }}</span>
              <span class="t-meta muted hidden md:col-span-3 md:flex md:items-center md:justify-between">
                {{ p.material }}<span class="ml-4 transition-transform duration-500 group-hover:translate-y-1" aria-hidden="true">↓</span>
              </span>
            </a>
          </li>
        </ol>

        <!-- Vista previa flotante (solo puntero fino) -->
        <motion.div class="pointer-events-none absolute left-0 top-0 z-10 hidden w-[clamp(14rem,20vw,22rem)] md:block" :style="{ x: sx, y: sy }" aria-hidden="true">
          <AnimatePresence>
            <motion.div
              v-if="hover !== null"
              :key="hover"
              class="absolute -translate-y-1/2 translate-x-8 bg-stone"
              :initial="{ opacity: 0, scale: 0.94 }"
              :animate="{ opacity: 1, scale: 1 }"
              :exit="{ opacity: 0, scale: 0.97 }"
              :transition="{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }"
              :style="{ width: '100%' }"
            >
              <ArchiveImage :id="projects[hover]!.thumb.id" :alt="''" ratio="4/5" sizes="22vw" :focus="[50, 55]" />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  </section>
</template>
