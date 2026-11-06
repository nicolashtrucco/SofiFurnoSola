<script setup lang="ts">
/**
 * 01 — Reposera. Narrativa técnica y material:
 * objeto → contexto → problema → materiales → transformación → construcción → estructura.
 */
import { ref } from 'vue'
import ArchiveImage from '@/components/ui/ArchiveImage.vue'
import ProjectFicha from './ProjectFicha.vue'
import ConvergingProcess from './ConvergingProcess.vue'
import { reposera as p } from '@/data/projects'
import { gsap } from '@/lib/gsap'
import { useGsapContext, revealLines, clipReveal } from '@/composables/useScrollAnimations'
import { prefersReducedMotion } from '@/composables/useReducedMotion'

const root = ref<HTMLElement>()
const title = ref<HTMLElement>()
const hero = ref<HTMLElement>()
const context = ref<HTMLElement>()
const exploded = ref<HTMLElement>()
const details = ref<HTMLElement[]>([])

useGsapContext(() => {
  revealLines(title.value)
  clipReveal(exploded.value)
  details.value.forEach((d) => clipReveal(d))
  if (prefersReducedMotion()) return
  // El objeto llega: leve acercamiento mientras entra
  gsap.fromTo(hero.value!, { scale: 0.9, yPercent: 6 }, {
    scale: 1, yPercent: 0, ease: 'none',
    scrollTrigger: { trigger: hero.value, start: 'top bottom', end: 'center center', scrub: true },
  })
  // El contexto se abre hasta ocupar todo el ancho
  gsap.fromTo(context.value!, { clipPath: 'inset(10% 14% 10% 14%)' }, {
    clipPath: 'inset(0% 0% 0% 0%)', ease: 'none',
    scrollTrigger: { trigger: context.value, start: 'top 90%', end: 'top 15%', scrub: true },
  })
}, root)
const setDetail = (el: unknown, i: number) => {
  if (el) details.value[i] = el as HTMLElement
}
</script>

<template>
  <article :id="p.anchor" ref="root" class="bg-ivory" :aria-labelledby="`${p.anchor}-title`">
    <!-- Apertura del proyecto -->
    <header class="wrap pt-[clamp(5rem,9vw,9rem)]">
      <div class="grid-12 items-start gap-y-6">
        <span class="t-num col-span-12 text-[clamp(6rem,15vw,17rem)] text-wood md:col-span-2">{{ p.n }}</span>
        <h3 :id="`${p.anchor}-title`" ref="title" class="t-display col-span-12 text-[clamp(3.2rem,8vw,10rem)] md:col-span-10">{{ p.title }}</h3>
      </div>
    </header>

    <figure class="wrap mt-[clamp(1rem,3vw,3rem)]">
      <div ref="hero" class="mx-auto w-full max-w-[1500px] will-change-transform md:w-[88%]">
        <ArchiveImage :id="p.hero.id" :alt="p.hero.alt" sizes="(min-width: 768px) 88vw, 100vw" img-class="mix-blend-multiply" />
      </div>
    </figure>

    <div class="wrap grid-12 mt-[clamp(2rem,4vw,4rem)] gap-y-10">
      <div class="col-span-12 md:col-span-5 lg:col-span-4"><ProjectFicha :project="p" /></div>
      <div class="col-span-12 md:col-span-7 lg:col-span-6 lg:col-start-7">
        <p class="t-lead">{{ p.concept[0] }}</p>
        <p class="t-body muted mt-6">{{ p.concept[1] }}</p>
      </div>
    </div>

    <!-- Contexto -->
    <figure class="mt-[clamp(5rem,10vw,10rem)]">
      <div ref="context" class="will-change-[clip-path]">
        <ArchiveImage :id="p.context.id" :alt="p.context.alt" ratio="16/8" sizes="100vw" :focus="[40, 70]" />
      </div>
      <figcaption class="wrap t-meta muted mt-3 flex justify-between"><span>{{ p.context.caption }}</span><span>01 — a</span></figcaption>
    </figure>

    <!-- Problema e investigación -->
    <section class="wrap grid-12 gap-y-10 py-[clamp(5rem,10vw,10rem)]" aria-label="Problema e investigación">
      <h4 class="t-meta col-span-12 flex gap-3 md:col-span-3"><span class="text-wood-deep">1.1</span>Problema e investigación</h4>
      <div class="col-span-12 md:col-span-9 lg:col-span-6">
        <p class="t-lead">{{ p.research.lead }}</p>
        <p class="t-body mt-8">{{ p.research.text }}</p>
      </div>
      <div class="col-span-12 lg:col-span-3">
        <p class="t-meta muted mb-4">Referencias</p>
        <ol class="t-meta">
          <li v-for="(r, i) in p.research.references" :key="r" class="rule flex gap-4 py-2.5">
            <span class="text-wood-deep">[{{ i + 1 }}]</span>{{ r }}
          </li>
        </ol>
      </div>
    </section>

    <!-- Materiales -->
    <section class="bg-stone py-[clamp(5rem,9vw,9rem)]" aria-label="Materiales">
      <div class="wrap">
        <div class="grid-12 gap-y-6">
          <h4 class="t-meta col-span-12 flex gap-3 md:col-span-3"><span class="text-wood-deep">1.2</span>Propuesta y materiales</h4>
          <p class="t-lead col-span-12 max-w-[30ch] md:col-span-9 lg:col-span-7">{{ p.proposal }}</p>
        </div>
        <div class="mt-[clamp(3rem,6vw,6rem)] grid border-y border-charcoal/25 md:grid-cols-2">
          <div
            v-for="(m, i) in p.materials"
            :key="m.code"
            class="flex min-h-[18rem] flex-col justify-between gap-10 py-8 md:px-8"
            :class="i === 0 ? 'border-b border-charcoal/25 md:border-b-0 md:border-r md:pl-0' : 'md:pr-0'"
          >
            <div class="flex items-start justify-between">
              <span class="t-num text-[clamp(5rem,9vw,9rem)]">{{ m.code }}</span>
              <span class="t-meta text-right">{{ m.role }}</span>
            </div>
            <div>
              <p class="t-head text-[clamp(2rem,3.6vw,3.6rem)]">{{ m.name }}</p>
              <p class="t-meta muted mt-3">{{ m.origin }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Transformación -->
    <section class="wrap py-[clamp(5rem,10vw,10rem)]" aria-label="Desarrollo constructivo">
      <div class="grid-12 mb-[clamp(3rem,6vw,6rem)] gap-y-6">
        <h4 class="t-meta col-span-12 flex gap-3 md:col-span-3"><span class="text-wood-deep">1.3</span>Transformación de los materiales</h4>
        <p class="t-lead col-span-12 max-w-[28ch] md:col-span-9 lg:col-span-7">Dos materiales recuperados, dos procesos que se encuentran en el montaje.</p>
      </div>
      <ConvergingProcess
        :left="{ label: 'A — Aluminio de llantas', steps: p.process.aluminio }"
        :right="{ label: 'B — Cinturones de seguridad', steps: p.process.cintas }"
        :final="p.process.montaje"
      />
    </section>

    <!-- Construcción -->
    <section class="wrap pb-[clamp(5rem,10vw,10rem)]" aria-label="Construcción">
      <div class="grid-12 items-end gap-y-10">
        <figure class="col-span-12 lg:col-span-8">
          <div ref="exploded"><ArchiveImage :id="p.construction.exploded.id" :alt="p.construction.exploded.alt" sizes="(min-width: 1024px) 64vw, 100vw" img-class="mix-blend-multiply" /></div>
          <figcaption class="t-meta muted mt-3">{{ p.construction.exploded.caption }}</figcaption>
        </figure>
        <div class="col-span-12 lg:col-span-4 lg:pb-16">
          <h4 class="t-meta mb-8 flex gap-3"><span class="text-wood-deep">1.4</span>Construcción sin remaches</h4>
          <ol>
            <li v-for="(n, i) in p.construction.notes" :key="i" class="rule grid grid-cols-[2rem_1fr] py-5">
              <span class="t-meta text-wood-deep">{{ String.fromCharCode(97 + i) }}</span>
              <p class="text-[1.15rem] leading-[1.45]">{{ n }}</p>
            </li>
          </ol>
        </div>
      </div>

      <div class="grid-12 mt-[clamp(4rem,8vw,8rem)] gap-y-10">
        <figure
          v-for="(d, i) in p.construction.details"
          :key="d.id"
          :class="i === 0 ? 'col-span-12 sm:col-span-6 lg:col-span-5' : 'col-span-12 sm:col-span-6 lg:col-span-4 lg:col-start-8 lg:mt-[22%]'"
        >
          <div :ref="(el) => setDetail(el, i)">
            <ArchiveImage :id="d.id" :alt="d.alt" ratio="1/1" :focus="i === 0 ? [50, 78] : [50, 66]" sizes="(min-width: 1024px) 40vw, 100vw" img-class="mix-blend-multiply" />
          </div>
          <figcaption class="t-meta muted mt-3">{{ d.caption }}</figcaption>
        </figure>
      </div>
    </section>

    <!-- Estructura -->
    <section class="wrap grid-12 rule gap-y-8 pb-[clamp(6rem,11vw,11rem)] pt-[clamp(3rem,5vw,5rem)]" aria-label="Optimización topológica">
      <h4 class="t-meta col-span-12 flex gap-3 md:col-span-3"><span class="text-wood-deep">1.5</span>Optimización topológica</h4>
      <p class="t-lead col-span-12 max-w-[34ch] md:col-span-9 lg:col-span-7">{{ p.topology.text }}</p>
      <div v-if="p.topology.images.length" class="col-span-12 grid gap-6 md:grid-cols-3">
        <figure v-for="img in p.topology.images" :key="img.id">
          <ArchiveImage :id="img.id" :alt="img.alt" sizes="33vw" />
          <figcaption v-if="img.caption" class="t-meta muted mt-3">{{ img.caption }}</figcaption>
        </figure>
      </div>
    </section>
  </article>
</template>
