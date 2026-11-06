<script setup lang="ts">
/** Proceso y herramientas: un índice técnico de conocimiento aplicado (sin niveles inventados). */
import { ref } from 'vue'
import { method, tools } from '@/data/profile'
import { projects } from '@/data/projects'
import { gsap } from '@/lib/gsap'
import { useGsapContext, revealLines, trackSection } from '@/composables/useScrollAnimations'
import { prefersReducedMotion } from '@/composables/useReducedMotion'

const root = ref<HTMLElement>()
const title = ref<HTMLElement>()
const byNumber = Object.fromEntries(projects.map((p) => [p.n, p]))

function go(anchor: string) {
  gsap.to(window, { scrollTo: { y: `#${anchor}`, autoKill: true }, duration: prefersReducedMotion() ? 0 : 1.3, ease: 'power3.inOut' })
}
useGsapContext(() => {
  trackSection(root.value, 'proceso')
  revealLines(title.value)
}, root)
</script>

<template>
  <section id="proceso" ref="root" class="bg-ivory py-[clamp(6rem,11vw,11rem)]" aria-labelledby="proceso-title">
    <div class="wrap">
      <div class="grid-12 items-end gap-y-6">
        <p class="t-meta col-span-12 flex gap-4 md:col-span-3"><span>04</span><span>Proceso</span></p>
        <h2 id="proceso-title" ref="title" class="t-display col-span-12 text-[clamp(3.6rem,10vw,12rem)] md:col-span-9">Proceso y herramientas</h2>
      </div>

      <!-- Secuencia de trabajo -->
      <ol class="mt-[clamp(3rem,7vw,7rem)] grid border-t border-charcoal/25 sm:grid-cols-5" aria-label="Secuencia de trabajo">
        <li
          v-for="(m, i) in method"
          :key="m"
          class="flex gap-4 border-b border-charcoal/25 py-5 sm:min-h-44 sm:flex-col sm:justify-between sm:border-b-0 sm:pr-5"
          :class="i > 0 ? 'sm:border-l sm:border-charcoal/25 sm:pl-5' : ''"
        >
          <span class="t-meta text-wood-deep">{{ String(i + 1).padStart(2, '0') }}<span class="hidden sm:inline"> {{ i < method.length - 1 ? '→' : '' }}</span></span>
          <span class="t-head text-[clamp(1.25rem,1.7vw,1.7rem)]">{{ m }}</span>
        </li>
      </ol>
      <p class="t-meta muted mt-4 border-t border-charcoal/25 pt-3 sm:border-t-0">Secuencia descrita por Sofía en "Forma de proyectar"</p>

      <!-- Índice de herramientas -->
      <div class="mt-[clamp(4rem,8vw,8rem)]">
        <div class="t-meta muted hidden grid-cols-12 gap-4 border-b border-charcoal/25 pb-3 md:grid" aria-hidden="true">
          <span class="col-span-1">Ref.</span><span class="col-span-5">Herramienta / capacidad</span><span class="col-span-3">Área</span><span class="col-span-3">Aplicado en</span>
        </div>
        <ul>
          <li v-for="(t, i) in tools" :key="t.name" class="grid grid-cols-[3rem_1fr] items-baseline gap-x-4 gap-y-1 border-b border-charcoal/25 py-5 md:grid-cols-12">
            <span class="t-meta muted md:col-span-1">T{{ String(i + 1).padStart(2, '0') }}</span>
            <span class="t-head text-[clamp(1.5rem,2.6vw,2.6rem)] md:col-span-5">{{ t.name }}</span>
            <span class="t-meta col-start-2 md:col-span-3 md:col-start-auto">{{ t.kind }}</span>
            <span class="t-meta col-start-2 flex flex-wrap gap-x-4 md:col-span-3 md:col-start-auto">
              <template v-if="t.used.length">
                <a v-for="n in t.used" :key="n" :href="`#${byNumber[n]?.anchor}`" class="text-link" @click.prevent="go(byNumber[n]!.anchor)">{{ n }} {{ byNumber[n]?.title }}</a>
              </template>
            </span>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
