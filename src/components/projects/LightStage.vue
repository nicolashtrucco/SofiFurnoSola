<script setup lang="ts">
/** Fotografías del prototipo encendido: el visitante cambia la luz y ve cómo responde la superficie. */
import { ref } from 'vue'
import { AnimatePresence, motion } from 'motion-v'
import ArchiveImage from '@/components/ui/ArchiveImage.vue'
import type { LightState } from '@/data/projects'

const props = defineProps<{ lights: LightState[] }>()
const active = ref(0)
void props
</script>

<template>
  <figure>
    <div class="relative overflow-hidden bg-night" style="aspect-ratio: 4 / 5">
      <AnimatePresence :initial="false">
        <motion.div
          :key="lights[active]!.key"
          class="absolute inset-0"
          :initial="{ opacity: 0 }"
          :animate="{ opacity: 1 }"
          :exit="{ opacity: 0 }"
          :transition="{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }"
        >
          <ArchiveImage
            :id="lights[active]!.img.id"
            :alt="lights[active]!.img.alt"
            ratio="4/5"
            :focus="lights[active]!.focus"
            :zoom="lights[active]!.zoom"
            sizes="(min-width: 1024px) 50vw, 100vw"
            class="h-full"
          />
        </motion.div>
      </AnimatePresence>
      <!-- viñeta: concentra la mirada en el objeto, atenúa el entorno doméstico -->
      <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_55%,transparent_38%,rgba(26,26,24,0.85)_100%)]" aria-hidden="true" />
    </div>

    <figcaption class="mt-5 flex flex-wrap items-center justify-between gap-4">
      <span class="t-meta text-ivory/60">Prototipo encendido</span>
      <div class="flex gap-1" role="radiogroup" aria-label="Color de luz">
        <button
          v-for="(l, i) in lights"
          :key="l.key"
          role="radio"
          :aria-checked="i === active"
          class="t-meta relative flex items-center gap-2.5 px-3 py-2"
          @click="active = i"
        >
          <motion.span
            v-if="i === active"
            layout-id="light-pill"
            class="absolute inset-0 border border-ivory/40"
            :transition="{ type: 'spring', stiffness: 400, damping: 36 }"
          />
          <span class="relative h-2.5 w-2.5 rounded-full" :style="{ background: l.swatch, boxShadow: i === active ? `0 0 12px ${l.swatch}` : 'none' }" />
          <span class="relative">{{ l.label }}</span>
        </button>
      </div>
    </figcaption>
  </figure>
</template>
