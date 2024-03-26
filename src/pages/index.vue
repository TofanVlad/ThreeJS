<script setup>
import myBubbles from "../components/my-bubbles.vue";
import myButton from "../components/my-button.vue";
</script>

<template>
  <section class="z-[5]">
    <h1 class="text-6xl font-bold mb-8">My Journey of ThreeJS</h1>
    <div class="flex gap-4 justify-around">
      <my-button text="Cubes" to="/animated-cubes" />
      <my-button text="Shapes" to="/shapes" />
      <my-button text="Solar system" to="/solar-system" />
    </div>
  </section>
  <my-bubbles />
</template>
