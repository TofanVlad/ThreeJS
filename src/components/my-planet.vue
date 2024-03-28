<script setup lang="ts">
defineProps<{ text: string }>();
</script>

<template>
  <button
    class="rounded-sm outline outline-1 px-6 py-2 outline-white bg-zinc-900 hover:bg-zinc-950 transition-colors text-white text-2xl font-light"
  >
    {{ text }}
  </button>
</template>
