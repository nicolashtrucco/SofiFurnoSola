<script setup lang="ts">
import SiteHeader from '@/components/layout/SiteHeader.vue'
import ScrollProgress from '@/components/ui/ScrollProgress.vue'
import HeroSection from '@/components/sections/HeroSection.vue'
import ProfileSection from '@/components/sections/ProfileSection.vue'
import PracticeSection from '@/components/sections/PracticeSection.vue'
import ArchiveIndex from '@/components/sections/ArchiveIndex.vue'
import ReposeraProject from '@/components/projects/ReposeraProject.vue'
import CintasProject from '@/components/projects/CintasProject.vue'
import TexturadaProject from '@/components/projects/TexturadaProject.vue'
import ProcessSection from '@/components/sections/ProcessSection.vue'
import ContactSection from '@/components/sections/ContactSection.vue'
</script>

<template>
  <a href="#perfil" class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-charcoal focus:px-4 focus:py-2 focus:text-ivory">
    Saltar la apertura
  </a>
  <SiteHeader />
  <ScrollProgress />
  <main>
    <HeroSection />
    <ProfileSection />
    <PracticeSection />
    <ArchiveIndex />
    <ReposeraProject />
    <CintasProject />
    <TexturadaProject />
    <ProcessSection />
  </main>
  <ContactSection />
</template>
