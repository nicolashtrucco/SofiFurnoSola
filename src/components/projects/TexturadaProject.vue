<script setup lang="ts">
/** 03 — Lámpara texturada. Composición nocturna: textura, capas y luz. */
import { ref } from 'vue'
import ArchiveImage from '@/components/ui/ArchiveImage.vue'
import ProjectFicha from './ProjectFicha.vue'
import LightStage from './LightStage.vue'
import { texturada as p } from '@/data/projects'
import { useGsapContext, revealLines, clipReveal, markDarkSurface } from '@/composables/useScrollAnimations'

const root = ref<HTMLElement>()
const title = ref<HTMLElement>()
const strip = ref<HTMLElement>()

useGsapContext(() => {
  markDarkSurface(root.value, 'texturada')
  revealLines(title.value)
  clipReveal(strip.value, 'inset(0% 50% 0% 50%)')
}, root)
</script>

<template>
  <article :id="p.anchor" ref="root" class="bg-night text-ivory" :aria-labelledby="`${p.anchor}-title`">
    <div class="wrap grid-12 gap-y-14 pt-[clamp(5rem,9vw,9rem)]">
      <header class="col-span-12 flex flex-col lg:col-span-5">
        <span class="t-num text-[clamp(6rem,15vw,17rem)] text-wood">{{ p.n }}</span>
        <h3 :id="`${p.anchor}-title`" ref="title" class="t-display mt-6 text-[clamp(3.4rem,8vw,9rem)]">{{ p.title }}</h3>
        <p class="t-lead mt-10 text-ivory/90">{{ p.concept[0] }}</p>
        <p class="t-body mt-6 text-ivory/65">{{ p.concept[1] }}</p>
        <div class="mt-10 text-ivory/85 lg:mt-auto lg:pt-12"><ProjectFicha :project="p" /></div>
      </header>

      <div class="col-span-12 lg:col-span-6 lg:col-start-7">
        <LightStage :lights="p.lights" />
      </div>
    </div>

    <section class="wrap grid-12 gap-y-10 py-[clamp(5rem,10vw,10rem)]" aria-label="Desarrollo">
      <h4 class="t-meta col-span-12 flex gap-3 md:col-span-3"><span class="text-wood">3.1</span>Geometría, textura, material y luz</h4>
      <p class="t-lead col-span-12 max-w-[30ch] md:col-span-9 lg:col-span-6">{{ p.development }}</p>
      <ul class="col-span-12 grid grid-cols-2 gap-x-6 md:col-span-9 md:col-start-4 lg:col-span-3 lg:col-start-10 lg:grid-cols-1">
        <li v-for="n in p.notes" :key="n" class="t-meta border-t border-ivory/20 py-3 text-ivory/80">{{ n }}</li>
      </ul>
    </section>

    <figure class="pb-[clamp(6rem,11vw,11rem)]">
      <div class="wrap">
        <div ref="strip" class="mx-auto max-w-[1150px]">
          <ArchiveImage :id="p.strip.id" :alt="p.strip.alt" sizes="(min-width: 1200px) 1150px, 100vw" />
        </div>
        <figcaption class="t-meta mx-auto mt-3 flex max-w-[1150px] justify-between text-ivory/60">
          <span>{{ p.strip.caption }}</span><span>03 — b</span>
        </figcaption>
      </div>
    </figure>
  </article>
</template>
