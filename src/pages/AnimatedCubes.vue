<script setup>
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight
);

camera.position.z = 3;
scene.add(camera);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("app").appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.listenToKeyEvents(window);

controls.minDistance = 2;
controls.maxDistance = 8;

controls.enableDamping = true;
controls.dampingFactor = 0.05;

const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);

const group = new THREE.Group();

const cubeArray = [];
const colors = [0xb7e8d8, 0xe86344, 0xe8ab9c];

for (let x = -1.2; x <= 1.2; x += 1.2) {
  for (let y = -1.2; y <= 1.2; y += 1.2) {
    const cubeMaterial = new THREE.MeshBasicMaterial({
      color: colors[(Math.random() * 3) | 0],
      wireframe: true,
    });

    const mesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
    mesh.scale.set(0.5, 0.5, 0.5);
    mesh.position.set(x, y, 0);
    cubeArray.push(mesh);
  }
}
group.add(...cubeArray);
scene.add(group);

const clock = new THREE.Clock();

const animate = () => {
  controls.update();

  const elapsedTime = clock.getElapsedTime();
  cubeArray.forEach((item, index) => {
    const mult = index % 2 === 0 ? 1 : -1;
    item.rotation.y = elapsedTime * 0.4 * mult;
    item.rotation.x = elapsedTime * mult;
  });

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

animate();

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
  <h1 class="absolute top-2 left-2 text-3xl">Cubes</h1>
  <router-link
    to="/"
    @click="reset()"
    class="hover:underline h-max absolute top-2 right-2 text-3xl"
    >Back</router-link
  >
</template>

<style scoped>
canvas:hover {
  cursor: grab;
}
</style>
