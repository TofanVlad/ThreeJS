<script setup>
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const camera = new THREE.PerspectiveCamera(
  65,
  window.innerWidth / window.innerHeight
);

const scene = new THREE.Scene();
scene.add(camera);

camera.position.set(10, 15, 10);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("app").appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.listenToKeyEvents(window);

controls.minDistance = 10;
controls.maxDistance = 30;

const ambientLight = new THREE.AmbientLight(0xffffff, 5);
scene.add(ambientLight);

const loader = new THREE.TextureLoader();

const globeGeometry = new THREE.SphereGeometry(8, 128, 128);
const globeMaterial = new THREE.PointsMaterial({
  alphaMap: loader.load("/textures/earthspec1k_inverted.jpg"),
  alphaHash: true,
  color: 0x808080,
  transparent: true,
  size: 0.05,
  //   sizeAttenuation: false,
  opacity: 0.7,
});

const globeMesh = new THREE.Points(globeGeometry, globeMaterial);

scene.add(globeMesh);

const tick = () => {
  controls.update();

  globeMesh.rotation.y += 0.001;
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
};

tick();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio, 2);
  renderer.render(scene, camera);
});

const reset = () => {
  document.getElementById("app").removeChild(renderer.domElement);
};
</script>

<template>
  <h1 class="absolute top-2 left-2 text-3xl">Globe</h1>
  <router-link
    to="/"
    @click="reset()"
    class="hover:underline h-max absolute top-2 right-2 text-3xl"
    >Back</router-link
  >
</template>
