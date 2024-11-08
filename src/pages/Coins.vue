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

  //
  // LIGHNING
  //

  const directLightFront = new THREE.DirectionalLight(0xffffff, 10);

  const directionLightTopFront = new THREE.DirectionalLight(0xffffff, 10);

  const directionLightTopRight = new THREE.DirectionalLight(0xffffff, 10);

  const directionLightBack = new THREE.PointLight(0xffffff, 10);

  directLightFront.position.set(1, 0, 5);
  directLightFront.rotateX((Math.PI * 75) / 180);

  directionLightTopFront.rotateX((Math.PI * 90) / 180);
  directionLightTopFront.position.set(-2, -2, 1);
  directionLightTopFront.rotateZ((Math.PI * 60) / 180);
  directionLightTopFront.rotateX((Math.PI * 45) / 180);

  directionLightBack.position.set(0, 0, -2);
  directionLightBack.rotateX((Math.PI * -90) / 180);

  directionLightTopRight.position.set(4, 4, 0);
  directionLightTopRight.rotateZ((Math.PI * -45) / 180);
  scene.add(
    directionLightTopFront,
    directionLightTopFront.target,
    directionLightBack,
    directionLightTopRight,
    directionLightTopRight.target,
    directLightFront,
    directLightFront.target
  );

  //
  // COIN GEOMETRY
  //

  const coinGeometry = new THREE.CylinderGeometry(1, 1, 0.1);
  const coinMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.6,
    roughness: 0.3,
    color: "black",
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
        10000
      )
      .start()
      .yoyo(true)
      .repeat(Infinity);

    coinGroup.add(mesh);
  }

  scene.add(coinGroup);

  //
  // COIN GROUP ROTATION
  //

  new TWEEN.Tween(coinGroup.rotation)
    .to({ z: coinGroup.rotation.z - 2 * Math.PI }, 7500)
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
