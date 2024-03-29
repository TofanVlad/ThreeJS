<script setup lang="ts">
import { ref, Ref } from "vue";
defineProps<{ orbits: Function }>();
const emit = defineEmits<{ (e: "orbitSpeed", value: number): number }>();

const orbitSpeed: Ref<number> = ref(1);

const handleEmit = (event: Event): void => {
  emit("orbitSpeed", +(event.target as HTMLInputElement).value);
};
</script>

<template>
  <div
    class="absolute top-1/2 -translate-y-1/2 left-0 outline outline-1 outline-white rounded-sm bg-gray-900 p-2 rounded-l-none flex flex-col gap-2 w-[155px]"
  >
    <label
      for="orbitSpeed"
      class="h-max text-white text-center font-light text-xl"
    >
      <h2 class="whitespace-nowrap">Orbit Speed: x{{ orbitSpeed }}</h2>
      <input
        type="range"
        min="0"
        max="10"
        step="1"
        value="1"
        id="orbitSpeed"
        name="orbitSpeed"
        v-model="orbitSpeed"
        @change="handleEmit"
      />
    </label>
    <button
      class="outline outline-1 outline-white rounded-sm bg-gray-800 hover:bg-gray-950 transition-colors text-white px-2 py-1"
      @click="orbits()"
    >
      Toggle Orbits
    </button>
  </div>
</template>

<style scoped>
input[type="range"] {
  -webkit-appearance: none;
  width: 100%;
  height: 5px;
  border-radius: 30px;
  background: rgb(55 65 81);
  outline: none;
  opacity: 0.7;
  -webkit-transition: 0.2s;
  transition: opacity 0.2s;
}

input[type="range"]:hover {
  opacity: 1;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 7px;
  height: 15px;
  border-radius: 5px;
  background: white;
  cursor: pointer;
}

input[type="range"]::-moz-range-thumb {
  width: 7px;
  height: 15px;
  border-radius: 5px;
  background: white;
  cursor: pointer;
}
</style>
