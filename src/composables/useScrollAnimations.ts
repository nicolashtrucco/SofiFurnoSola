import { onBeforeUnmount, onMounted, type Ref } from 'vue'
import { gsap, ScrollTrigger, SplitText } from '@/lib/gsap'
import { prefersReducedMotion } from './useReducedMotion'
import { ui } from './useUiState'

/**
 * gsap.context ligado al ciclo de vida del componente: tweens y ScrollTriggers creados
 * dentro se revierten al desmontar (sin fugas). `setup` puede devolver una limpieza extra.
 */
export function useGsapContext(setup: () => void | (() => void), scope?: Ref<HTMLElement | undefined>) {
  let ctx: gsap.Context | undefined
  onMounted(() => {
    ctx = gsap.context(() => setup(), scope?.value)
    requestAnimationFrame(() => ScrollTrigger.refresh())
  })
  onBeforeUnmount(() => ctx?.revert())
}

/** Títulos: las líneas suben detrás de una máscara. Solo para títulos, no para cuerpo de texto. */
export function revealLines(target: Element | null | undefined, opts: { start?: string; delay?: number } = {}) {
  if (!target || prefersReducedMotion()) return
  const split = SplitText.create(target, { type: 'lines', mask: 'lines' })
  // aire para tildes y descendentes (Á, ñ, g) sin cambiar el interlineado
  gsap.set(split.masks, { paddingTop: '0.16em', marginTop: '-0.16em', paddingBottom: '0.06em', marginBottom: '-0.06em' })
  gsap.from(split.lines, {
    yPercent: 104,
    duration: 1.15,
    ease: 'expo.out',
    stagger: 0.07,
    delay: opts.delay ?? 0,
    scrollTrigger: { trigger: target, start: opts.start ?? 'top 85%', once: true },
  })
}

/** Imagen que se descubre de abajo hacia arriba la primera vez que entra en pantalla. */
export function clipReveal(target: Element | null | undefined, from = 'inset(100% 0% 0% 0%)') {
  if (!target || prefersReducedMotion()) return
  gsap.fromTo(
    target,
    { clipPath: from },
    {
      clipPath: 'inset(0% 0% 0% 0%)',
      duration: 1.5,
      ease: 'expo.out',
      scrollTrigger: { trigger: target, start: 'top 88%', once: true },
    },
  )
}

/** Trazos SVG que se dibujan sincronizados con el scroll (y se borran al volver). */
export function drawOnScroll(paths: Element[], trigger: Element, start = 'top 75%', end = 'bottom 60%') {
  if (!paths.length) return
  if (prefersReducedMotion()) {
    gsap.set(paths, { strokeDashoffset: 0 })
    return
  }
  gsap.fromTo(
    paths,
    { strokeDashoffset: 1 },
    { strokeDashoffset: 0, ease: 'none', stagger: 0.08, scrollTrigger: { trigger, start, end, scrub: 0.8 } },
  )
}

/** Marca una superficie oscura para que la navegación cambie a marfil mientras está debajo. */
export function markDarkSurface(el: Element | null | undefined, key: string) {
  if (!el) return
  ScrollTrigger.create({
    trigger: el,
    start: 'top 32px',
    end: 'bottom 32px',
    onToggle: (self) => (ui.dark[key] = self.isActive),
  })
}

/** Registra la sección activa para la navegación. */
export function trackSection(el: Element | null | undefined, id: string) {
  if (!el) return
  ScrollTrigger.create({
    trigger: el,
    start: 'top 45%',
    end: 'bottom 45%',
    onToggle: (self) => {
      if (self.isActive) ui.active = id
      else if (ui.active === id) ui.active = ''
    },
  })
}
