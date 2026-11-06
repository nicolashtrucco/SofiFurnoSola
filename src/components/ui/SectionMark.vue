<script setup lang="ts">
/** Encabezado mínimo de sección: índice + nombre, como el lomo de una carpeta de archivo. */
defineProps<{ index: string; label: string; aside?: string }>()
</script>

<template>
  <div class="t-meta flex items-baseline gap-4">
    <span>{{ index }}</span>
    <span class="rule mb-[0.3em] w-10 shrink-0" aria-hidden="true" />
    <span>{{ label }}</span>
    <span v-if="aside" class="muted ml-auto">{{ aside }}</span>
  </div>
</template>
