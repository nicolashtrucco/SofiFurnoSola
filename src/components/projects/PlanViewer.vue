<script setup lang="ts">
/**
 * Visor de planos: hoja grande + índice de láminas, ampliación a pantalla completa
 * con zoom (clic / doble toque) y navegación con teclado (← → Esc).
 */
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { AnimatePresence, motion } from 'motion-v'
import ArchiveImage from '@/components/ui/ArchiveImage.vue'
import { media } from '@/lib/media'
import type { Sheet } from '@/data/projects'

const props = defineProps<{ sheets: Sheet[]; total: number }>()
const current = ref(0)
const open = ref(false)
const zoom = ref(false)
const scroller = ref<HTMLElement>()
const sheet = computed(() => props.sheets[current.value]!)
const full = computed(() => media(sheet.value.img.id))

function step(d: number) {
  current.value = (current.value + d + props.sheets.length) % props.sheets.length
  zoom.value = false
}
async function toggleZoom(e: MouseEvent) {
  const el = scroller.value
  if (!el) return
  const rx = (e.clientX - el.getBoundingClientRect().left + el.scrollLeft) / el.scrollWidth
  const ry = (e.clientY - el.getBoundingClientRect().top + el.scrollTop) / el.scrollHeight
  zoom.value = !zoom.value
  await nextTick()
  if (zoom.value) {
    el.scrollLeft = rx * el.scrollWidth - el.clientWidth / 2
    el.scrollTop = ry * el.scrollHeight - el.clientHeight / 2
  }
}
function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') open.value = false
  else if (e.key === 'ArrowRight') step(1)
  else if (e.key === 'ArrowLeft') step(-1)
}
watch(open, (v) => {
  document.documentElement.style.overflow = v ? 'hidden' : ''
  zoom.value = false
  if (v) window.addEventListener('keydown', onKey)
  else window.removeEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  document.documentElement.style.overflow = ''
})
</script>

<template>
  <div class="grid-12 gap-y-8">
    <!-- Hoja principal -->
    <div class="col-span-12 lg:col-span-9">
      <button
        class="group relative block w-full bg-white text-left shadow-[0_1px_0_rgba(37,37,34,0.12)]"
        :aria-label="`Ampliar plano ${sheet.n}: ${sheet.title}`"
        @click="open = true"
        @keydown.right.prevent="step(1)"
        @keydown.left.prevent="step(-1)"
      >
        <AnimatePresence mode="wait" :initial="false">
          <motion.div :key="sheet.n" :initial="{ opacity: 0 }" :animate="{ opacity: 1 }" :exit="{ opacity: 0 }" :transition="{ duration: 0.25 }">
            <ArchiveImage :id="sheet.img.id" :alt="sheet.img.alt" sizes="(min-width: 1024px) 72vw, 100vw" />
          </motion.div>
        </AnimatePresence>
        <span class="t-meta absolute right-3 top-3 bg-charcoal px-2.5 py-1.5 text-ivory opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
          Ampliar
        </span>
      </button>
      <div class="t-meta mt-4 flex flex-wrap justify-between gap-3">
        <span>Plano {{ sheet.n }} — {{ sheet.title }}</span>
        <span class="muted">Escala {{ sheet.scale }} · Normas IRAM</span>
      </div>
    </div>

    <!-- Índice de láminas -->
    <div class="col-span-12 lg:col-span-3">
      <p class="t-meta muted mb-4">{{ sheets.length }} de {{ total }} láminas publicadas</p>
      <ol class="flex gap-3 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible">
        <li v-for="(s, i) in sheets" :key="s.n" class="w-[46vw] shrink-0 sm:w-[30vw] lg:w-auto">
          <button
            class="relative grid w-full grid-cols-1 gap-2 text-left lg:grid-cols-[7.5rem_1fr] lg:items-center lg:gap-4"
            :aria-pressed="i === current"
            @click="current = i"
          >
            <span class="relative block bg-white p-1">
              <ArchiveImage :id="s.img.id" :alt="''" sizes="(min-width: 1024px) 8rem, 46vw" />
              <motion.span
                class="pointer-events-none absolute inset-0 border border-charcoal"
                :initial="false"
                :animate="{ opacity: i === current ? 1 : 0 }"
                :transition="{ duration: 0.3 }"
              />
            </span>
            <span class="t-meta" :class="i === current ? '' : 'muted'">{{ s.n }}<br />{{ s.title }}</span>
          </button>
        </li>
      </ol>
    </div>
  </div>

  <Teleport to="body">
    <AnimatePresence>
      <motion.div
        v-if="open && full"
        class="fixed inset-0 z-[80] flex flex-col bg-[#fbfaf7] text-charcoal"
        role="dialog"
        aria-modal="true"
        :aria-label="`Plano ${sheet.n} — ${sheet.title}`"
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 1 }"
        :exit="{ opacity: 0 }"
        :transition="{ duration: 0.3 }"
      >
        <div class="wrap t-meta flex h-14 w-full shrink-0 items-center justify-between gap-4 border-b border-charcoal/15">
          <span>Plano {{ sheet.n }} — {{ sheet.title }} <span class="muted">· {{ current + 1 }}/{{ sheets.length }}</span></span>
          <span class="flex items-center gap-6">
            <button @click="step(-1)" aria-label="Plano anterior">← Ant.</button>
            <button @click="step(1)" aria-label="Plano siguiente">Sig. →</button>
            <button @click="open = false">Cerrar ✕</button>
          </span>
        </div>
        <div ref="scroller" class="relative min-h-0 flex-1 overflow-auto" :class="zoom ? 'cursor-zoom-out' : 'cursor-zoom-in'" @click="toggleZoom">
          <img
            :key="full.src"
            :src="full.src"
            :alt="sheet.img.alt"
            class="mx-auto max-w-none"
            :class="zoom ? 'w-[240%] lg:w-[180%]' : 'h-full w-full object-contain p-4'"
          />
        </div>
        <p class="t-meta muted py-3 text-center">{{ zoom ? 'Desplazá para recorrer la lámina — clic para alejar' : 'Clic sobre el plano para ampliar' }}</p>
      </motion.div>
    </AnimatePresence>
  </Teleport>
</template>
