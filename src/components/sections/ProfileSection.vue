<script setup lang="ts">
/** Presentación: continúa el título revelado en la apertura. Incluye la formación y el contacto directo. */
import { ref } from 'vue'
import { profile } from '@/data/profile'
import { site } from '@/data/site'
import { useGsapContext, trackSection } from '@/composables/useScrollAnimations'

const root = ref<HTMLElement>()
useGsapContext(() => trackSection(root.value, 'perfil'), root)
const [first, ...rest] = profile.intro
</script>

<template>
  <section ref="root" class="bg-ivory pb-[clamp(6rem,12vw,12rem)] pt-[clamp(3rem,6vw,6rem)]" aria-labelledby="perfil-title">
    <div class="wrap grid-12 gap-y-14">
      <!-- Ficha -->
      <aside class="col-span-12 md:col-span-4 lg:col-span-3" aria-label="Ficha">
        <dl class="t-meta grid grid-cols-[6.5rem_1fr] gap-y-3 md:sticky md:top-24">
          <dt class="muted">Nombre</dt>
          <dd>{{ site.name }}</dd>
          <dt class="muted">Formación</dt>
          <dd>{{ profile.education.career }}</dd>
          <dt class="muted">Universidad</dt>
          <dd>{{ profile.education.university }} ({{ profile.education.short }})</dd>
          <dt class="muted">Ciudad</dt>
          <dd>{{ site.city }}</dd>
          <dt class="muted">Contacto</dt>
          <dd class="flex flex-col items-start gap-1 normal-case">
            <a :href="`mailto:${site.email}`" class="text-link">{{ site.email }}</a>
            <a :href="site.linkedin" target="_blank" rel="noopener noreferrer" class="text-link">LinkedIn ↗</a>
          </dd>
        </dl>
      </aside>

      <div class="col-span-12 md:col-span-8 lg:col-span-8 lg:col-start-5">
        <p class="t-lead max-w-[26ch] !text-[clamp(1.75rem,3.3vw,3.3rem)]">{{ first }}</p>
        <div class="mt-[clamp(2.5rem,5vw,5rem)] grid gap-x-[clamp(1.5rem,3vw,3rem)] gap-y-6 sm:grid-cols-2">
          <p v-for="(t, i) in rest" :key="i" class="t-body text-[1.15rem] leading-[1.55]">{{ t }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
