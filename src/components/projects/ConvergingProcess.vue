<script setup lang="ts">
/**
 * Dos cadenas de proceso que convergen en un paso final.
 * Las líneas SVG se calculan a partir de la posición real de cada nodo (ResizeObserver)
 * y se dibujan sincronizadas con el scroll.
 */
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { gsap } from '@/lib/gsap'
import { drawOnScroll, useGsapContext } from '@/composables/useScrollAnimations'

const props = defineProps<{
  left: { label: string; steps: string[] }
  right: { label: string; steps: string[] }
  final: string
}>()

const root = ref<HTMLElement>()
const paths = ref<string[]>(['', ''])
const size = ref({ w: 0, h: 0 })
const pathEls = ref<SVGPathElement[]>([])

function nodeCenter(el: Element, box: DOMRect) {
  const r = el.getBoundingClientRect()
  return { x: r.left + r.width / 2 - box.left, y: r.top + r.height / 2 - box.top }
}

function measure() {
  const el = root.value
  if (!el) return
  const box = el.getBoundingClientRect()
  size.value = { w: box.width, h: box.height }
  const end = el.querySelector('[data-node="final"]')
  if (!end) return
  const e = nodeCenter(end, box)
  paths.value = (['left', 'right'] as const).map((side) => {
    const nodes = [...el.querySelectorAll(`[data-node="${side}"]`)].map((n) => nodeCenter(n, box))
    if (!nodes.length) return ''
    const first = nodes[0]!
    const last = nodes[nodes.length - 1]!
    const midY = last.y + (e.y - last.y) * 0.5
    return `M${first.x},${first.y} L${last.x},${last.y} C${last.x},${midY} ${e.x},${midY} ${e.x},${e.y - 8}`
  })
}

let ro: ResizeObserver | undefined
onMounted(async () => {
  await nextTick()
  measure()
  ro = new ResizeObserver(() => measure())
  ro.observe(root.value!)
})
onBeforeUnmount(() => ro?.disconnect())

useGsapContext(() => {
  drawOnScroll(pathEls.value, root.value!, 'top 70%', 'bottom 75%')
  // Los nodos se encienden cuando la línea los alcanza
  gsap.utils.toArray<HTMLElement>('[data-node]', root.value).forEach((n) => {
    gsap.fromTo(n, { backgroundColor: 'rgba(181,138,97,0)' }, {
      backgroundColor: 'rgba(181,138,97,1)',
      duration: 0.3,
      scrollTrigger: { trigger: n, start: 'top 62%', toggleActions: 'play none none reverse' },
    })
  })
}, root)
const setPath = (el: unknown, i: number) => {
  if (el) pathEls.value[i] = el as SVGPathElement
}
void props
</script>

<template>
  <div ref="root" class="relative">
    <svg class="pointer-events-none absolute inset-0 h-full w-full text-wood" :viewBox="`0 0 ${size.w} ${size.h}`" fill="none" aria-hidden="true">
      <path
        v-for="(d, i) in paths"
        :key="i"
        :ref="(el) => setPath(el, i)"
        :d="d"
        stroke="currentColor"
        stroke-width="1"
        pathLength="1"
        stroke-dasharray="1"
        stroke-dashoffset="1"
      />
    </svg>

    <div class="relative grid gap-x-[clamp(1.5rem,4vw,4rem)] gap-y-14 md:grid-cols-2">
      <div v-for="(col, side) in { left, right }" :key="side">
        <p class="t-meta muted mb-8 pl-8">{{ col.label }}</p>
        <ol class="flex flex-col gap-[clamp(2rem,3.5vw,3.5rem)]">
          <li v-for="(s, i) in col.steps" :key="s" class="relative grid grid-cols-[2rem_1fr] items-start">
            <span :data-node="side" class="mt-[0.55em] h-[9px] w-[9px] rounded-full border border-wood bg-ivory" aria-hidden="true" />
            <div>
              <span class="t-meta muted">{{ String((side === 'left' ? 0 : left.steps.length) + i + 1).padStart(2, '0') }}</span>
              <p class="t-head mt-1 max-w-[20ch] text-[clamp(1.35rem,2vw,1.9rem)]">{{ s }}</p>
            </div>
          </li>
        </ol>
      </div>
    </div>

    <div class="relative mt-[clamp(5rem,9vw,9rem)] flex flex-col items-start md:items-center">
      <span data-node="final" class="mb-6 ml-[calc(1rem-4.5px)] h-[9px] w-[9px] rounded-full border border-wood bg-ivory md:ml-0" aria-hidden="true" />
      <p class="t-meta muted pl-8 md:pl-0">{{ String(left.steps.length + right.steps.length + 1).padStart(2, '0') }} — Unión</p>
      <p class="t-head mt-2 pl-8 text-[clamp(1.8rem,3.4vw,3.4rem)] md:pl-0 md:text-center">{{ final }}</p>
    </div>
  </div>
</template>
