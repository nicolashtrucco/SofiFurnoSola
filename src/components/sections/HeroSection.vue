<script setup lang="ts">
/**
 * Apertura + inmersión + transición al perfil.
 * Three.js dibuja la Thonet; un timeline GSAP con ScrollTrigger (scrub) convierte el scroll
 * en progreso de cámara y coordina textos y capas. Reversible en ambos sentidos.
 */
import { ref } from 'vue'
import ThonetScene from '@/components/three/ThonetScene.vue'
import { gsap, SplitText } from '@/lib/gsap'
import { useGsapContext } from '@/composables/useScrollAnimations'
import { prefersReducedMotion } from '@/composables/useReducedMotion'
import { ui } from '@/composables/useUiState'
import { site } from '@/data/site'

const root = ref<HTMLElement>()
const words = ref<HTMLElement[]>([])
const woodLayer = ref<HTMLElement>()
const iris = ref<HTMLElement>()
const arcs = ref<SVGPathElement[]>([])

const camProgress = ref(0)
const intro = ref(0)
const loadRatio = ref(0)
const ready = ref(false)
const reduced = prefersReducedMotion()

/** Fracción del tramo dedicada a la cámara; el resto es la transición. */
const CAM_END = 0.7

const figures = [
  { id: 'f2', text: 'Fig. 02 — Respaldo: una curva continua', at: 0.16, out: 0.31 },
  { id: 'f3', text: 'Fig. 03 — Madera curvada al vapor', at: 0.34, out: 0.48 },
  { id: 'f4', text: 'Fig. 04 — Sección del arco', at: 0.51, out: 0.63 },
]

let startIntro: (() => void) | null = null
function onReady() {
  ready.value = true
  startIntro?.()
}
const setWord = (el: unknown, i: number) => {
  if (el) words.value[i] = el as HTMLElement
}
const setArc = (el: unknown, i: number) => {
  if (el) arcs.value[i] = el as SVGPathElement
}

useGsapContext(() => {
  const q = gsap.utils.selector(root.value!)
  const proxy = { cam: 0 }
  const splits = words.value.map((w) => SplitText.create(w, { type: 'chars', mask: 'chars' }))
  const chars = splits.map((s) => s.chars)
  gsap.set(splits.flatMap((s) => s.masks), { paddingTop: '0.16em', marginTop: '-0.16em' })

  // ───── Apertura ─────
  if (!reduced) {
    gsap.set(chars.flat(), { yPercent: 108 })
    gsap.set(q('[data-intro]'), { opacity: 0 })
  }
  gsap.set(words.value, { visibility: 'visible' })

  let started = false
  startIntro = () => {
    if (started) return
    started = true
    if (reduced) {
      intro.value = 1
      ui.introDone = true
      return
    }
    const state = { v: 0 }
    gsap
      .timeline({ defaults: { ease: 'expo.out' }, onComplete: () => void (ui.introDone = true) })
      .to(state, { v: 1, duration: 2.6, ease: 'power3.out', onUpdate: () => void (intro.value = state.v) }, 0)
      .to(chars[0]!, { yPercent: 0, duration: 1.4, stagger: 0.05 }, 0.3)
      .to(chars[1]!, { yPercent: 0, duration: 1.4, stagger: 0.05 }, 0.5)
      .to(chars[2]!, { yPercent: 0, duration: 1.4, stagger: 0.05 }, 0.62)
      .to(q('[data-intro]'), { opacity: 1, duration: 1, stagger: 0.08, ease: 'power2.out' }, 1.2)
  }
  const safety = window.setTimeout(() => startIntro?.(), 6000)

  // ───── Scroll ─────
  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: root.value,
      start: 'top top',
      end: 'bottom bottom',
      scrub: reduced ? true : 0.6,
      onUpdate: (self) => {
        ui.dark.hero = self.progress > CAM_END - 0.06 && self.progress < CAM_END + 0.11
        ui.pastHero = self.progress > CAM_END + 0.12
      },
    },
  })

  tl.to(proxy, { cam: 1, duration: CAM_END, onUpdate: () => void (camProgress.value = proxy.cam) }, 0)

  // El nombre se abre hacia los costados: la silla queda sola
  tl.to(words.value[0]!, { xPercent: -14, opacity: 0, duration: 0.12 }, 0.01)
  tl.to(words.value[1]!, { xPercent: -14, opacity: 0, duration: 0.12 }, 0.01)
  tl.to(words.value[2]!, { xPercent: 14, opacity: 0, duration: 0.12 }, 0.01)
  tl.to(q('[data-intro]'), { opacity: 0, duration: 0.05 }, 0)

  figures.forEach((f) => {
    const el = q(`[data-fig="${f.id}"]`)
    tl.fromTo(el, { opacity: 0, x: -12 }, { opacity: 1, x: 0, duration: 0.035 }, f.at)
    tl.to(el, { opacity: 0, duration: 0.03 }, f.out)
  })

  // Dentro de la madera → nogal → se abre el marfil del perfil
  tl.to(woodLayer.value!, { opacity: 1, duration: 0.09 }, CAM_END - 0.08)
  tl.fromTo(
    iris.value!,
    { clipPath: 'circle(0% at 62% 52%)' },
    { clipPath: 'circle(150% at 62% 52%)', duration: 0.16, ease: 'power2.inOut' },
    CAM_END + 0.02,
  )
  arcs.value.forEach((p, i) => tl.fromTo(p, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.16 }, CAM_END + 0.05 + i * 0.03))
  tl.fromTo(q('[data-iris-line]'), { yPercent: 105 }, { yPercent: 0, duration: 0.07, stagger: 0.02, ease: 'power3.out' }, CAM_END + 0.1)
  tl.fromTo(q('[data-iris-fade]'), { opacity: 0 }, { opacity: 1, duration: 0.05 }, CAM_END + 0.16)
  tl.to({}, { duration: 1 - (CAM_END + 0.21) }, CAM_END + 0.21)

  return () => {
    window.clearTimeout(safety)
    splits.forEach((s) => s.revert())
    ui.dark.hero = false
  }
}, root)
</script>

<template>
  <section id="top" ref="root" class="relative h-[480svh] md:h-[640svh]" aria-label="Apertura">
    <!-- Ancla del perfil: el momento en que el iris ya mostró el título -->
    <span id="perfil" class="pointer-events-none absolute inset-x-0 bottom-[100svh] h-px" aria-hidden="true" />

    <div class="sticky top-0 h-[100svh] w-full overflow-hidden bg-ivory">
      <!-- Nombre (detrás de la silla) -->
      <h1
        class="t-display absolute inset-x-[var(--gutter)] bottom-[13svh] top-[calc(var(--nav-h)+5.5svh)] z-0 flex flex-col justify-between text-[clamp(4.6rem,19.5vw,24rem)] md:bottom-[11svh]"
        aria-label="Sofía Furno Sola"
      >
        <span :ref="(el) => setWord(el, 0)" class="invisible block self-start" aria-hidden="true">Sofía</span>
        <span class="flex items-end justify-between" aria-hidden="true">
          <span :ref="(el) => setWord(el, 1)" class="invisible block">Furno</span>
          <span :ref="(el) => setWord(el, 2)" class="invisible block">Sola</span>
        </span>
      </h1>

      <ThonetScene class="pointer-events-none z-10" :progress="camProgress" :intro="intro" @ready="onReady" @loading="(r: number) => (loadRatio = r)" />

      <!-- Anotaciones -->
      <div class="pointer-events-none absolute inset-0 z-20">
        <div class="wrap absolute inset-x-0 top-[var(--nav-h)] grid grid-cols-2 gap-4 pt-2 md:grid-cols-3">
          <p data-intro class="t-ui uppercase">{{ site.role }}</p>
          <p data-intro class="t-meta hidden text-center md:block">{{ site.edition }}</p>
          <p data-intro class="t-meta text-right">Obj. 00 — Thonet N.º 14<span class="muted hidden sm:inline"> · 1859</span></p>
        </div>

        <div class="wrap absolute inset-x-0 bottom-0 grid grid-cols-2 items-end gap-4 pb-6 md:grid-cols-3">
          <p data-intro class="t-meta">{{ site.city }}<span class="muted hidden sm:inline"> — {{ site.coords }}</span></p>
          <p data-intro class="t-meta hidden items-center justify-center gap-3 md:flex">
            <span class="relative block h-px w-12 overflow-hidden bg-charcoal/20"><span class="hero-tick absolute inset-0 bg-charcoal" /></span>
            Entrar al archivo
          </p>
          <p data-intro class="t-meta text-right">Scroll</p>
        </div>

        <p
          v-for="f in figures"
          :key="f.id"
          :data-fig="f.id"
          class="t-meta absolute left-[var(--gutter)] top-[46%] max-w-[16rem] opacity-0 md:top-[58%]"
        >
          {{ f.text }}
        </p>

        <div class="absolute left-1/2 top-1/2 w-36 -translate-x-1/2 transition-opacity duration-700" :class="ready ? 'opacity-0' : 'opacity-100'" role="status" aria-live="polite">
          <p class="t-meta mb-3 flex justify-between"><span>Modelo 3D</span><span>{{ Math.round(loadRatio * 100) }}%</span></p>
          <div class="h-px bg-charcoal/15"><div class="h-px origin-left bg-charcoal transition-transform duration-300" :style="{ transform: `scaleX(${loadRatio})` }" /></div>
        </div>
      </div>

      <!-- La cámara ya está dentro de la madera -->
      <div ref="woodLayer" class="absolute inset-0 z-30 bg-[#3f2c1e] opacity-0" aria-hidden="true" />

      <!-- Del objeto a quien lo diseña -->
      <div ref="iris" class="absolute inset-0 z-40 bg-ivory" style="clip-path: circle(0% at 62% 52%)">
        <svg class="absolute bottom-0 right-[-8%] h-[92%] w-auto text-wood md:right-[2%]" viewBox="0 0 600 900" fill="none" aria-hidden="true">
          <path :ref="(el) => setArc(el, 0)" d="M70 900 V380 C70 60 530 60 530 380 V900" stroke="currentColor" stroke-width="1" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" vector-effect="non-scaling-stroke" />
          <path :ref="(el) => setArc(el, 1)" d="M150 900 V420 C150 190 450 190 450 420 V900" stroke="currentColor" stroke-width="1" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" vector-effect="non-scaling-stroke" opacity=".6" />
        </svg>
        <div class="wrap relative flex h-full flex-col justify-end pb-[14svh] md:pb-[16svh]">
          <p data-iris-fade class="t-meta mb-8 flex gap-4"><span>01</span><span>Perfil</span></p>
          <h2 id="perfil-title" class="t-head text-[clamp(2.5rem,7vw,8.2rem)]">
            <span class="mask"><span data-iris-line class="block">Diseñar es investigar,</span></span>
            <span class="mask"><span data-iris-line class="block">explorar y</span></span>
            <span class="mask pb-[0.08em]"><span data-iris-line class="block font-serif text-[0.94em] font-light italic tracking-[-0.03em] text-wood-deep">materializar ideas.</span></span>
          </h2>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@keyframes tick {
  0% { transform: translateX(-100%); }
  60%, 100% { transform: translateX(100%); }
}
.hero-tick {
  animation: tick 2.6s var(--ease-in-out-quart) infinite;
}
</style>
