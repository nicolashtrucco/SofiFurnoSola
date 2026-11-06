<script setup lang="ts">
/**
 * Canvas 3D de la Thonet N.º 14 (carga diferida del módulo three).
 * Si WebGL no está disponible o el modelo falla, muestra una ilustración técnica SVG.
 */
import { onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import type { ThonetStage } from './ThonetStage'
import ThonetFallback from './ThonetFallback.vue'
import { prefersReducedMotion } from '@/composables/useReducedMotion'
import { isMobileViewport } from '@/composables/useDevice'

const props = defineProps<{ progress: number; intro: number }>()
const emit = defineEmits<{ ready: []; loading: [ratio: number] }>()

const canvas = ref<HTMLCanvasElement>()
const stage = shallowRef<ThonetStage>()
const fallback = ref(false)

onMounted(async () => {
  const mod = await import('./ThonetStage')
  if (!canvas.value) return
  if (!mod.hasWebGL()) {
    fallback.value = true
    emit('ready')
    return
  }
  const mobile = isMobileViewport()
  try {
    stage.value = new mod.ThonetStage({
      canvas: canvas.value,
      mobile,
      reducedMotion: prefersReducedMotion(),
      modelUrl: mobile ? '/models/thonet-14-mobile.glb' : '/models/thonet-14.glb',
      onProgress: (r) => emit('loading', r),
      onReady: () => {
        if (!(import.meta.env.DEV && new URLSearchParams(location.search).has('p'))) {
          stage.value?.setProgress(props.progress)
          stage.value!.intro = props.intro
        }
        emit('ready')
      },
      onError: () => {
        fallback.value = true
        emit('ready')
      },
    })
  } catch {
    fallback.value = true
    emit('ready')
  }

  if (import.meta.env.DEV) {
    const p = new URLSearchParams(location.search).get('p')
    if (p !== null) {
      ;(window as unknown as { __stage: ThonetStage }).__stage = stage.value!
      stage.value!.intro = 1
      stage.value!.jumpTo(parseFloat(p))
    }
  }
})

watch(() => props.progress, (p) => stage.value?.setProgress(p))
watch(() => props.intro, (v) => (stage.value ? (stage.value.intro = v) : undefined))

// Parallax sutil del puntero (solo dispositivos con puntero fino)
const onMove = (e: PointerEvent) => {
  stage.value?.setPointer((e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1))
}
onMounted(() => {
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && !prefersReducedMotion())
    window.addEventListener('pointermove', onMove, { passive: true })
})
onBeforeUnmount(() => {
  window.removeEventListener('pointermove', onMove)
  stage.value?.dispose()
  stage.value = undefined
})
</script>

<template>
  <div class="absolute inset-0">
    <canvas v-show="!fallback" ref="canvas" class="block h-full w-full" aria-hidden="true" />
    <ThonetFallback v-if="fallback" :progress="progress" :intro="intro" />
  </div>
</template>
