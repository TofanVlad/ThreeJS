<script setup lang="ts">
import { onMounted, Ref, ref } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import TWEEN from "three/examples/jsm/libs/tween.module";
import { fragment, vertex } from "../shaders/coins";

const canvas: Ref<HTMLCanvasElement | null> = ref(null);

function initCoins(canvas: HTMLCanvasElement) {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(60, w / h);

  camera.position.set(0, 0, 5);
  scene.add(camera);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
  });
  renderer.setClearColor(0x171717);
  renderer.setSize(w, h);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.listenToKeyEvents(window);

  const coinGeometry = new THREE.CylinderGeometry(1, 1, 0.2);
  const coinMaterial = new THREE.ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    uniforms: {
      u_tick: {
        value: 1.0,
      },
      u_resolution: {
        value: new THREE.Vector2(w, h),
      },
    },
  });

  const coinGroup = new THREE.Group();

  for (let i = 0; i < 8; i++) {
    const angle = i * ((2 * Math.PI) / 8);
    const mesh = new THREE.Mesh(coinGeometry, coinMaterial);
    mesh.rotateX((Math.PI * 90) / 180);
    mesh.position.set(Math.cos(angle), Math.sin(angle), 0);
    mesh.scale.setScalar(0.35);

    coinGroup.add(mesh);
  }

  scene.add(coinGroup);

  function tick(t = 0) {
    controls.update();
    coinGroup.children.map((item) => {
      item.material.uniforms.u_tick.value = Math.sin(t * 0.00025);
    });
    coinGroup.rotateZ((Math.PI * t * 0.0000025) / 180);

    requestAnimationFrame(tick);
    renderer.render(scene, camera);
  }
  tick();
}

onMounted(() => {
  if (!canvas.value) return;
  initCoins(canvas.value);
});
</script>

<template>
  <h1 class="absolute text-3xl top-2 left-2">Coins</h1>
  <router-link
    to="/"
    class="absolute text-3xl hover:underline h-max top-2 right-2"
    >Back</router-link
  >
  <canvas ref="canvas" class="w-screen h-screen"></canvas>
</template>
