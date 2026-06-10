<!-- Informational (blue) note banner shared by Step 3's reminders — the
     workshop-conflict note and the merchandise shipping note. Body paragraphs
     come from the slot; the chrome (border, icon, layout) lives here once.
     text-blue-500 is deliberate: Quasar's global .text-info shadows the
     UnoCSS semantic class (see PLAN §5). -->
<template>
  <div
    role="note"
    class="flex items-start gap-3 rounded-2 border border-solid border-info-opacity bg-info-subtle-rest p-4"
  >
    <q-icon name="info" size="20px" class="shrink-0 text-blue-500" />
    <div class="flex min-w-0 flex-1 flex-col gap-1">
      <slot />
    </div>
  </div>
</template>
