<script setup>
import { event } from '../mocks/event.js'
</script>

<template>
  <header class="bg-surface-l0 border-b border-neutral-muted">
    <div class="row items-center q-px-lg" style="height: 72px">
      <!-- Brand mark (approximation of the Figma logo) -->
      <div
        class="flex flex-center bg-brand-bold-rest"
        style="width: 40px; height: 40px; border-radius: 10px"
      >
        <svg width="22" height="22" viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <path
            d="M3 21 L10 8 L14 15 L18 8 L25 21"
            stroke="white"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <span class="q-ml-md text-h4 font-bold text-neutral">{{ event.name }}</span>
    </div>
  </header>
</template>
