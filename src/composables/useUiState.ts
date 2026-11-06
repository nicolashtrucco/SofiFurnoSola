import { computed, reactive } from 'vue'

/**
 * Estado de interfaz compartido.
 * `dark` registra qué superficies oscuras están bajo la navegación (puede haber más de una fuente:
 * la transición del hero y las secciones carbón).
 */
export const ui = reactive({
  introDone: false,
  /** El nombre ya no está en pantalla: la navegación puede mostrarlo */
  pastHero: false,
  dark: {} as Record<string, boolean>,
  active: '' as string,
})

export const navOnDark = computed(() => Object.values(ui.dark).some(Boolean))
