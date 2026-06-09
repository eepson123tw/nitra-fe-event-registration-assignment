<script setup>
import { event } from '../mocks/event.js'
import brandmark from '../assets/brandmark.svg'
import LangSwitcher from './LangSwitcher.vue'
</script>

<template>
  <header class="bg-surface-l0 divider-b">
    <div class="row items-center justify-between no-wrap q-px-xl h-[72px]">
      <!-- Brand mark: white emblem on the brand-emphasis tile (matches Figma logo) -->
      <div class="row items-center no-wrap">
        <div class="flex flex-center h-10 w-10 rounded-2 bg-brand-emphasis-rest">
          <img :src="brandmark" alt="" class="h-[15px] w-[28px]" />
        </div>
        <span class="q-ml-md text-h4 font-bold text-neutral">{{ event.name }}</span>
      </div>
      <LangSwitcher />
    </div>
  </header>
</template>
