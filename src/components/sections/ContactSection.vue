<script setup lang="ts">
/** Cierre: contacto directo; la silla de la apertura vuelve como dibujo. */
import { ref } from 'vue'
import ThonetLines from '@/components/ui/ThonetLines.vue'
import { site } from '@/data/site'
import { gsap } from '@/lib/gsap'
import { useGsapContext, drawOnScroll, markDarkSurface, trackSection } from '@/composables/useScrollAnimations'
import { prefersReducedMotion } from '@/composables/useReducedMotion'

const root = ref<HTMLElement>()
const lines = ref<Element[]>([])
const setPath = (el: unknown, i: number) => {
  if (el) lines.value[i] = el as Element
}
const top = () => gsap.to(window, { scrollTo: 0, duration: prefersReducedMotion() ? 0 : 2, ease: 'power3.inOut' })

useGsapContext(() => {
  markDarkSurface(root.value, 'contact')
  trackSection(root.value, 'contacto')
  drawOnScroll(lines.value, root.value!, 'top 70%', 'center 55%')
}, root)
</script>

<template>
  <footer id="contacto" ref="root" class="relative overflow-hidden bg-charcoal pt-[clamp(6rem,11vw,11rem)] text-ivory" aria-labelledby="contacto-title">
    <div class="wrap grid-12 gap-y-14">
      <div class="col-span-12 lg:col-span-8">
        <p class="t-meta mb-10 flex gap-4"><span>05</span><span>Contacto</span></p>
        <h2 id="contacto-title" class="sr-only">Contacto</h2>
        <a :href="`mailto:${site.email}`" class="t-head group block break-all text-[clamp(2.3rem,6.6vw,7.6rem)] leading-[0.95] sm:break-normal">
          <span class="text-link [background-size:0%_1px] group-hover:[background-size:100%_1px]">{{ site.email }}</span>
        </a>
        <div class="mt-12 flex flex-wrap gap-x-12 gap-y-4">
          <a :href="`mailto:${site.email}`" class="t-ui text-link uppercase">Escribir un email</a>
          <a :href="site.linkedin" target="_blank" rel="noopener noreferrer" class="t-ui text-link uppercase">LinkedIn ↗</a>
        </div>
      </div>

      <div class="col-span-12 flex items-end justify-between gap-8 lg:col-span-4 lg:flex-col lg:items-end">
        <dl class="t-meta grid grid-cols-[6rem_1fr] gap-y-2 text-ivory/80 lg:order-2 lg:w-full">
          <dt class="text-ivory/45">Nombre</dt><dd>{{ site.name }}</dd>
          <dt class="text-ivory/45">Disciplina</dt><dd>{{ site.discipline }}</dd>
          <dt class="text-ivory/45">Ciudad</dt><dd>{{ site.city }}</dd>
        </dl>
        <ThonetLines :set-path="setPath" class="h-[clamp(9rem,22vw,20rem)] w-auto shrink-0 text-wood lg:order-1" />
      </div>
    </div>

    <div class="wrap t-meta mt-[clamp(5rem,9vw,9rem)] flex flex-wrap justify-between gap-4 border-t border-ivory/15 py-6 text-ivory/55">
      <span>© 2026 {{ site.name }}</span>
      <span class="hidden sm:inline">{{ site.edition }}</span>
      <span class="hidden md:inline">{{ site.coords }}</span>
      <button class="text-ivory/80 hover:text-ivory" @click="top">Volver a la silla ↑</button>
    </div>
  </footer>
</template>
