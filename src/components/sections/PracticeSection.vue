<script setup lang="ts">
/** Intereses, forma de proyectar, fortalezas y aspiraciones — superficie oscura, lectura pausada. */
import { ref } from 'vue'
import { practice } from '@/data/profile'
import { useGsapContext, markDarkSurface, revealLines } from '@/composables/useScrollAnimations'

const root = ref<HTMLElement>()
const title = ref<HTMLElement>()
useGsapContext(() => {
  markDarkSurface(root.value, 'practice')
  revealLines(title.value)
}, root)
</script>

<template>
  <section ref="root" class="bg-charcoal py-[clamp(5rem,11vw,11rem)] text-ivory" aria-labelledby="practica-title">
    <div class="wrap grid-12 gap-y-16">
      <header class="col-span-12 lg:col-span-4">
        <div class="lg:sticky lg:top-24">
          <p class="t-meta mb-8 flex gap-4"><span>02</span><span>Práctica</span></p>
          <h2 id="practica-title" ref="title" class="t-head text-[clamp(2.6rem,5vw,5.2rem)]">Intereses y forma de proyectar</h2>
        </div>
      </header>

      <div class="col-span-12 lg:col-span-8">
        <article
          v-for="(e, i) in practice"
          :key="e.key"
          class="rule grid gap-x-8 gap-y-5 pb-[clamp(3rem,5vw,5rem)] pt-6 md:grid-cols-[11rem_1fr]"
        >
          <h3 class="t-meta flex gap-3 md:flex-col md:gap-1">
            <span class="text-wood">2.{{ i + 1 }}</span>
            <span>{{ e.label }}</span>
          </h3>
          <div>
            <p class="t-lead max-w-[22ch]">{{ e.title }}</p>
            <p v-if="e.text" class="t-body mt-6 text-ivory/72">{{ e.text }}</p>
            <ol v-if="e.list" class="mt-8 max-w-[36rem]">
              <li v-for="(item, j) in e.list" :key="item" class="rule flex gap-6 py-3 text-[1.05rem] text-ivory/85">
                <span class="t-meta pt-[0.35em] text-wood">{{ String.fromCharCode(97 + j) }}</span>{{ item }}
              </li>
            </ol>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
