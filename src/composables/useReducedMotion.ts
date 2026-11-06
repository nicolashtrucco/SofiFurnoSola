import { onBeforeUnmount, ref } from 'vue'

/** Reactivo a la preferencia del sistema `prefers-reduced-motion`. */
export function useReducedMotion() {
  const mq = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)') : null
  const reduced = ref(mq?.matches ?? false)
  const on = (e: MediaQueryListEvent) => (reduced.value = e.matches)
  mq?.addEventListener('change', on)
  onBeforeUnmount(() => mq?.removeEventListener('change', on))
  return reduced
}

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
