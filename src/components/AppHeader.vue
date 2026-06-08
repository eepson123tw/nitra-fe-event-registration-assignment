<script setup>
import { event } from '../mocks/event.js'
import brandmark from '../assets/brandmark.svg'
</script>

<template>
  <header class="bg-surface-l0" style="border-bottom: 1px solid var(--divider-default)">
    <div class="row items-center q-px-xl" style="height: 72px">
      <!-- Brand mark: white emblem on the brand-emphasis tile (matches Figma logo) -->
      <div
        class="flex flex-center bg-brand-emphasis-rest"
        style="width: 40px; height: 40px; border-radius: 8px"
      >
        <img :src="brandmark" alt="" style="width: 28px; height: 15px" />
      </div>
      <span class="q-ml-md text-h4 font-bold text-neutral">{{ event.name }}</span>
    </div>
  </header>
</template>
