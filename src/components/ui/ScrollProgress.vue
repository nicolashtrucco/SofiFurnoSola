<script setup lang="ts">
import { motion, useScroll, useSpring } from 'motion-v'

// Línea fina de progreso de lectura (Motion). Solo escala, no toca ningún elemento animado por GSAP.
const { scrollYProgress } = useScroll()
const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })
</script>

<template>
  <motion.div
    class="pointer-events-none fixed inset-x-0 top-0 z-[70] h-px origin-left bg-wood-deep"
    :style="{ scaleX }"
    aria-hidden="true"
  />
</template>
