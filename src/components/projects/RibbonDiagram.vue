<script setup lang="ts">
/**
 * Esquema ilustrativo: cintas torsionadas entre dos anillos.
 * El scroll gira el punto de vista para mostrar cómo cambia la lectura del objeto
 * y cómo se abren o cierran los espacios por donde pasa la luz.
 */
import { computed, ref } from 'vue'
import { ScrollTrigger } from '@/lib/gsap'
import { useGsapContext } from '@/composables/useScrollAnimations'
import { prefersReducedMotion } from '@/composables/useReducedMotion'

const props = withDefaults(defineProps<{ count?: number; trigger?: HTMLElement }>(), { count: 22 })

const W = 600
const H = 720
const cx = W / 2
const R = 210
const TILT = 0.26
const TOP = 110
const BOTTOM = 620
const TWIST = Math.PI * 0.85
const STEPS = 22

const view = ref(0.35) // ángulo de cámara en radianes
const draw = ref(0) // 0..1: el esquema se dibuja con el scroll antes de empezar a girar
const clamp01 = (n: number) => Math.min(Math.max(n, 0), 1)
/** Progreso de trazo de cada cinta (escalonado: se dibujan una tras otra) */
const local = (k: number) => clamp01(draw.value * 1.7 - 0.45 - (k / props.count) * 0.7)
const rings = computed(() => clamp01(draw.value * 3.2))

interface Ribbon {
  k: number
  d: string
  depth: number
}

const ribbons = computed<Ribbon[]>(() => {
  const out: Ribbon[] = []
  const width = ((Math.PI * 2) / props.count) * 0.5
  for (let k = 0; k < props.count; k++) {
    const theta = (k / props.count) * Math.PI * 2
    const edge = (offset: number) => {
      const pts: [number, number][] = []
      let depth = 0
      for (let s = 0; s <= STEPS; s++) {
        const t = s / STEPS
        const a = theta + offset + TWIST * t + view.value
        const r = R * (1 - 0.16 * Math.sin(Math.PI * t))
        const z = Math.sin(a)
        depth += z
        pts.push([cx + r * Math.cos(a), BOTTOM - t * (BOTTOM - TOP) + r * z * TILT])
      }
      return { pts, depth }
    }
    const a = edge(0)
    const b = edge(width)
    const poly = [...a.pts, ...b.pts.reverse()]
    out.push({
      k,
      d: 'M' + poly.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join('L') + 'Z',
      depth: (a.depth + b.depth) / (2 * (STEPS + 1)),
    })
  }
  return out.sort((x, y) => x.depth - y.depth)
})

const angle = computed(() => Math.round(((view.value * 180) / Math.PI) % 360))
const root = ref<HTMLElement>()

useGsapContext(() => {
  if (prefersReducedMotion()) {
    draw.value = 1
    return
  }
  ScrollTrigger.create({
    trigger: props.trigger ?? root.value,
    start: 'top 80%',
    end: 'bottom 20%',
    scrub: 0.8,
    onUpdate: (self) => {
      draw.value = clamp01(self.progress / 0.4)
      view.value = 0.35 + clamp01((self.progress - 0.15) / 0.85) * Math.PI * 0.9
    },
  })
}, root)
</script>

<template>
  <figure ref="root">
    <svg :viewBox="`0 0 ${W} ${H}`" class="h-auto w-full" role="img" aria-label="Esquema de cintas torsionadas entre dos anillos, visto desde distintos ángulos">
      <!-- anillos: se trazan primero -->
      <ellipse :cx="cx" :cy="BOTTOM" :rx="R + 14" :ry="(R + 14) * TILT" fill="none" stroke="#252522" stroke-opacity=".35" pathLength="1" stroke-dasharray="1" :stroke-dashoffset="1 - rings" />
      <path
        v-for="r in ribbons"
        :key="r.k"
        :d="r.d"
        :fill="r.depth > 0 ? '#b58a61' : '#8a6542'"
        :fill-opacity="(r.depth > 0 ? 0.25 + r.depth * 0.6 : 0.12) * Math.max(0, (local(r.k) - 0.6) / 0.4)"
        stroke="#3f2c1e"
        :stroke-opacity="r.depth > 0 ? 0.55 : 0.18"
        stroke-width="0.8"
        stroke-linejoin="round"
        pathLength="1"
        stroke-dasharray="1"
        :stroke-dashoffset="1 - local(r.k)"
      />
      <ellipse :cx="cx" :cy="TOP" :rx="R + 14" :ry="(R + 14) * TILT" fill="none" stroke="#252522" stroke-width="1.2" pathLength="1" stroke-dasharray="1" :stroke-dashoffset="1 - rings" />
      <path :d="`M${cx - R - 14},${BOTTOM} A${R + 14},${(R + 14) * TILT} 0 0 0 ${cx + R + 14},${BOTTOM}`" fill="none" stroke="#252522" stroke-width="1.2" pathLength="1" stroke-dasharray="1" :stroke-dashoffset="1 - rings" />
    </svg>
    <figcaption class="t-meta mt-4 flex justify-between gap-6">
      <span class="muted">Esquema ilustrativo — cintas torsionadas entre dos anillos</span>
      <span class="whitespace-nowrap tabular-nums">Vista {{ String(angle).padStart(3, '0') }}°</span>
    </figcaption>
  </figure>
</template>
