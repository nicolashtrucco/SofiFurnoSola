<script setup lang="ts">
/**
 * La Thonet N.º 14 en trazo técnico (vista frontal). Como en la silla real,
 * las patas traseras y el respaldo son una sola pieza de madera curvada.
 */
defineProps<{ setPath?: (el: unknown, i: number) => void }>()
const paths = [
  // patas traseras + aro exterior del respaldo (una pieza)
  'M122 560 C126 440 129 340 131 262 C131 34 269 34 269 262 C271 340 274 440 278 560',
  // aro interior del respaldo
  'M158 272 C152 104 248 104 242 272',
  // asiento (borde superior e inferior del aro)
  'M92 284 A108 19 0 1 0 308 284 A108 19 0 1 0 92 284',
  'M92 284 L92 294 A108 19 0 0 0 308 294 L308 284',
  // patas delanteras
  'M118 312 C112 400 104 480 96 560',
  'M282 312 C288 400 296 480 304 560',
  // aro de las patas
  'M106 440 A94 17 0 1 0 294 440 A94 17 0 1 0 106 440',
]
</script>

<template>
  <svg viewBox="70 30 260 540" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path
      v-for="(d, i) in paths"
      :key="i"
      :ref="(el) => setPath?.(el, i)"
      :d="d"
      pathLength="1"
      :stroke-dasharray="setPath ? 1 : undefined"
      :stroke-dashoffset="setPath ? 1 : undefined"
      vector-effect="non-scaling-stroke"
    />
  </svg>
</template>
