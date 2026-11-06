<script setup lang="ts">
/** Ficha de archivo de un proyecto: número, categoría, material y competencias. */
import type { ProjectBase } from '@/data/projects'
defineProps<{ project: ProjectBase }>()
</script>

<template>
  <dl class="t-meta grid grid-cols-[7rem_1fr] gap-y-2.5">
    <dt class="muted">Nº</dt>
    <dd>{{ project.n }}</dd>
    <dt class="muted">Categoría</dt>
    <dd>{{ project.category }}</dd>
    <dt class="muted">Material</dt>
    <dd>{{ project.material }}</dd>
    <dt class="muted">Competencias</dt>
    <dd>{{ project.skills.join(' · ') }}</dd>
  </dl>
</template>
