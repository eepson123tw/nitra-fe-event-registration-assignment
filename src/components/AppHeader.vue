<script setup>
import { event } from '../mocks/event.js'
import brandmark from '../assets/brandmark.svg'
import LangSwitcher from './LangSwitcher.vue'
</script>

<template>
  <header class="bg-surface-l0 divider-b">
    <!-- Padding shrinks below the tablet breakpoint so the brand + switcher
         keep their own line on narrow screens (48px would starve the title). -->
    <div class="row items-center justify-between no-wrap gap-3 px-4 md:px-12 h-[72px]">
      <!-- Brand mark: white emblem on the brand-emphasis tile (matches Figma logo) -->
      <div class="row items-center no-wrap min-w-0">
        <div class="flex flex-center h-10 w-10 shrink-0 rounded-2 bg-brand-emphasis-rest">
          <img :src="brandmark" alt="" class="h-[15px] w-[28px]" />
        </div>
        <span class="q-ml-md truncate text-h4 font-bold text-neutral">{{ event.name }}</span>
      </div>
      <LangSwitcher />
    </div>
  </header>
</template>
