<script setup lang="ts">
defineProps<{ text: string; path?: string }>();
</script>

<template>
  <router-link
    :to="path ? path : '/'"
    class="px-6 py-4 rounded-md bg-[#2c2c2c] hover:bg-[#2f2f2f] transition-all font-bold text-lg"
    >{{ text }}</router-link
  >
</template>
