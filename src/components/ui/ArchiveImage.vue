<script setup lang="ts">
/**
 * Imagen del archivo: WebP responsive, lazy, con proporción reservada (sin saltos de layout).
 * Con `ratio` se encuadra (object-cover) usando `focus` y `zoom` para centrar el objeto.
 */
import { computed } from 'vue'
import { media } from '@/lib/media'

const props = withDefaults(
  defineProps<{
    id: string
    alt: string
    sizes?: string
    eager?: boolean
    ratio?: string
    focus?: [number, number]
    zoom?: number
    imgClass?: string
  }>(),
  { sizes: '(min-width: 1024px) 60vw, 100vw', zoom: 1 },
)

const m = computed(() => media(props.id))
const frame = computed(() => (props.ratio ? { aspectRatio: props.ratio } : m.value ? { aspectRatio: `${m.value.w} / ${m.value.h}` } : {}))
const imgStyle = computed(() =>
  props.ratio
    ? {
        objectPosition: props.focus ? `${props.focus[0]}% ${props.focus[1]}%` : undefined,
        transform: props.zoom !== 1 ? `scale(${props.zoom})` : undefined,
        transformOrigin: props.focus ? `${props.focus[0]}% ${props.focus[1]}%` : undefined,
      }
    : {},
)
</script>

<template>
  <div class="relative overflow-hidden" :style="frame">
    <img
      v-if="m"
      :src="m.src"
      :srcset="m.srcset"
      :sizes="sizes"
      :alt="alt"
      :width="m.w"
      :height="m.h"
      :loading="eager ? 'eager' : 'lazy'"
      :fetchpriority="eager ? 'high' : undefined"
      decoding="async"
      class="absolute inset-0 h-full w-full"
      :class="[ratio ? 'object-cover' : 'object-contain', imgClass]"
      :style="imgStyle"
    />
  </div>
</template>
