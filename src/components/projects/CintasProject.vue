<script setup lang="ts">
/** 02 — Lámpara de cintas. Geometría, punto de vista y documentación técnica. */
import { ref } from 'vue'
import ArchiveImage from '@/components/ui/ArchiveImage.vue'
import ProjectFicha from './ProjectFicha.vue'
import RibbonDiagram from './RibbonDiagram.vue'
import PlanViewer from './PlanViewer.vue'
import { cintas as p } from '@/data/projects'
import { useGsapContext, revealLines, clipReveal } from '@/composables/useScrollAnimations'

const root = ref<HTMLElement>()
const title = ref<HTMLElement>()
const plate = ref<HTMLElement>()
const geometry = ref<HTMLElement>()

useGsapContext(() => {
  revealLines(title.value)
  clipReveal(plate.value)
}, root)
</script>

<template>
  <article :id="p.anchor" ref="root" class="bg-stone" :aria-labelledby="`${p.anchor}-title`">
    <header class="wrap pt-[clamp(5rem,9vw,9rem)]">
      <div class="grid-12 items-start gap-y-6">
        <h3 :id="`${p.anchor}-title`" ref="title" class="t-display order-2 col-span-12 text-[clamp(3.4rem,9.4vw,11rem)] md:order-1 md:col-span-10">{{ p.title }}</h3>
        <span class="t-num order-1 col-span-12 text-[clamp(6rem,15vw,17rem)] text-wood-deep md:order-2 md:col-span-2 md:text-right">{{ p.n }}</span>
      </div>
    </header>

    <div class="wrap grid-12 mt-[clamp(3rem,6vw,6rem)] items-end gap-y-12">
      <figure class="col-span-12 md:col-span-6 lg:col-span-5">
        <div ref="plate" class="max-w-[520px] bg-white">
          <ArchiveImage :id="p.render.id" :alt="p.render.alt" sizes="520px" />
        </div>
        <figcaption class="t-meta muted mt-3">{{ p.render.caption }}</figcaption>
      </figure>
      <div class="col-span-12 md:col-span-6 lg:col-span-6 lg:col-start-7">
        <p class="t-lead">{{ p.concept[0] }}</p>
        <p class="t-body mt-6">{{ p.concept[1] }}</p>
        <div class="mt-10"><ProjectFicha :project="p" /></div>
      </div>
    </div>

    <!-- Geometría y punto de vista -->
    <section ref="geometry" class="wrap grid-12 gap-y-10 py-[clamp(5rem,10vw,10rem)] lg:min-h-[150svh]" aria-label="Geometría">
      <div class="col-span-12 lg:col-span-4">
        <div class="lg:sticky lg:top-28">
          <h4 class="t-meta mb-8 flex gap-3"><span class="text-wood-deep">2.1</span>Geometría y luz</h4>
          <p class="t-lead max-w-[20ch]">El objeto cambia según desde dónde se lo mire.</p>
          <p class="t-meta muted mt-8 hidden lg:block">Desplazá para girar el punto de vista ↓</p>
        </div>
      </div>
      <div class="col-span-12 lg:col-span-7 lg:col-start-6">
        <div class="lg:sticky lg:top-24">
          <RibbonDiagram :trigger="geometry" />
        </div>
      </div>
    </section>

    <!-- Datos técnicos -->
    <section class="wrap" aria-label="Datos técnicos">
      <h4 class="t-meta mb-6 flex gap-3"><span class="text-wood-deep">2.2</span>Desarrollo</h4>
      <dl class="grid grid-cols-2 border-y border-charcoal/25 md:grid-cols-5">
        <div v-for="(s, i) in p.specs" :key="s.k" class="flex min-h-36 flex-col justify-between gap-6 py-6 pr-4" :class="i > 0 ? 'md:border-l md:border-charcoal/25 md:pl-5' : ''">
          <dt class="t-meta muted">{{ s.k }}</dt>
          <dd>
            <span class="t-head block text-[clamp(1.4rem,2.2vw,2.2rem)]">{{ s.v }}</span>
            <span v-if="'src' in s" class="t-meta muted mt-1 block">Según {{ s.src }}</span>
          </dd>
        </div>
      </dl>
    </section>

    <!-- Planos -->
    <section class="wrap py-[clamp(5rem,10vw,10rem)]" aria-label="Planos técnicos">
      <div class="grid-12 mb-[clamp(2.5rem,5vw,5rem)] gap-y-6">
        <h4 class="t-meta col-span-12 flex gap-3 md:col-span-3"><span class="text-wood-deep">2.3</span>Documentación técnica</h4>
        <p class="t-lead col-span-12 max-w-[28ch] md:col-span-9 lg:col-span-7">Diez planos bajo normas IRAM, del ensamblaje a cada pieza.</p>
      </div>
      <PlanViewer :sheets="p.sheets" />
    </section>
  </article>
</template>
