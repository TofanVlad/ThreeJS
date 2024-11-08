<script setup lang="ts">
import { onMounted, Ref, ref } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import TWEEN from "three/examples/jsm/libs/tween.module";

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

  const directionLightTopFront = new THREE.DirectionalLight(0xffffff, 5);

  const directionLightTopRight = new THREE.DirectionalLight(0xffffff, 4);

  const directionLightBack = new THREE.PointLight(0xffffff, 1, 10, 2);

  directionLightTopFront.rotateX((Math.PI * 90) / 180);
  directionLightTopFront.position.set(-2, -2, 4);
  directionLightTopFront.rotateZ((Math.PI * 25) / 180);
  directionLightTopFront.rotateX((Math.PI * 25) / 180);

  directionLightBack.position.set(1, -1.5, -1);

  directionLightTopRight.position.set(4, 4, 0);
  directionLightTopRight.rotateZ((Math.PI * -45) / 180);
  scene.add(directionLightTopFront, directionLightBack, directionLightTopRight);

  const coinGeometry = new THREE.CylinderGeometry(1, 1, 0.2);
  const coinMaterial = new THREE.MeshStandardMaterial({
    metalness: 1,
    roughness: 0.1,
    color: "white",
  });
  const coinGroup = new THREE.Group();

  for (let i = 0; i < 8; i++) {
    const angle = i * ((2 * Math.PI) / 8);
    const mesh = new THREE.Mesh(coinGeometry, coinMaterial);
    mesh.rotateX((Math.PI * 90) / 180);
    mesh.position.set(Math.cos(angle), Math.sin(angle), 0);
    mesh.scale.setScalar(0.35);

    new TWEEN.Tween(mesh.rotation)
      .to(
        {
          x: Math.PI / 180,
          z: (Math.PI * i * 45) / 180,
        },
        7500
      )
      .start()
      .easing(TWEEN.Easing.Quadratic.Out)
      .yoyo(true)
      .repeat(Infinity);

    coinGroup.add(mesh);
  }

  scene.add(coinGroup);

  new TWEEN.Tween(coinGroup.rotation)
    .to({ z: coinGroup.rotation.z + 2 * Math.PI }, 7500)
    .start()
    .repeat(Infinity);

  function tick() {
    TWEEN.update();
    controls.update();

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
