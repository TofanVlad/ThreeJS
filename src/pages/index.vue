<script setup>
import myBubbles from "../components/my-bubbles.vue";
import myButton from "../components/my-button.vue";
</script>

<template>
  <section class="z-[5]">
    <h1 class="mb-8 text-6xl font-bold text-center">My Journey of ThreeJS</h1>
    <div class="flex flex-wrap justify-around gap-4">
      <my-button text="Cubes" to="/animated-cubes" />
      <my-button text="Shapes" to="/shapes" />
      <my-button text="Solar system" to="/solar-system" />
      <my-button text="Globe" to="/globe" />
      <my-button text="Caps" to="/caps" />
      <my-button text="Prism" to="/prism" />
      <my-button text="Arhiterra" to="/arhiterra" />
      <my-button text="Coins" to="/coins" />
      <my-button text="Shaders" to="/shaders" />
    </div>
  </section>
  <my-bubbles />
</template>
