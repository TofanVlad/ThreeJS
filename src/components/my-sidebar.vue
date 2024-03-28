<script setup lang="ts">
defineProps<{ orbits: Function }>();
</script>

<template>
  <div
    class="absolute top-1/2 -translate-y-1/2 left-0 outline outline-1 outline-white rounded-sm bg-gray-900 p-2 rounded-l-none"
  >
    <button
      class="outline outline-1 outline-white rounded-sm bg-gray-800 hover:bg-gray-950 transition-colors text-white"
      @click="orbits()"
    >
      Orbits
    </button>
  </div>
</template>
