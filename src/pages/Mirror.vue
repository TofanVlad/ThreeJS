<script setup lang="ts">
import { onMounted, ref } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";

const canvas = ref(null);

function initMirror(canvas: HTMLCanvasElement) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight
  );

  camera.position.z = 3;
  scene.add(camera);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.listenToKeyEvents(window);

  const animate = () => {
    controls.update();

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  };

  animate();

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.render(scene, camera);
  });
}

onMounted(() => {
  if (canvas.value) initMirror(canvas.value);
});
</script>

<template>
  <h1 class="absolute text-3xl top-2 left-2">Mirror</h1>
  <router-link
    to="/"
    class="absolute text-3xl hover:underline h-max top-2 right-2"
    >Back</router-link
  >
  <canvas ref="canvas" class="w-screen h-screen"></canvas>
</template>
