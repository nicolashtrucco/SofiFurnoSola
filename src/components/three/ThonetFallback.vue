<script setup lang="ts">
/** Alternativa sin WebGL: la silla en trazo técnico, que se acerca con el scroll. */
import { computed } from 'vue'
import ThonetLines from '@/components/ui/ThonetLines.vue'
const props = defineProps<{ progress: number; intro: number }>()
const style = computed(() => ({
  transform: `translateY(${(1 - props.intro) * 24}px) scale(${1 + props.progress * props.progress * 6})`,
  opacity: props.intro,
  transformOrigin: '50% 28%',
}))
</script>

<template>
  <div class="absolute inset-0 flex items-center justify-center" role="img" aria-label="Silla Thonet N.º 14, dibujo de línea">
    <ThonetLines class="h-[66%] w-auto text-charcoal" :style="style" />
  </div>
</template>
