<script setup>
import * as THREE from "three";
import TWEEN from "three/examples/jsm/libs/tween.module";

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight
);
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("app").appendChild(renderer.domElement);

camera.position.z = 25;
scene.add(camera);

const group = new THREE.Group();

const geometries = [
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.ConeGeometry(1, 2, 32, 1),
  new THREE.RingGeometry(0.5, 1, 16),
  new THREE.TorusGeometry(0.75, 0.35, 16, 100),
  new THREE.DodecahedronGeometry(1, 0),
  new THREE.SphereGeometry(1, 32, 16),
  new THREE.TorusKnotGeometry(1, 0.25, 100, 16, 2, 5),
  new THREE.OctahedronGeometry(1, 0),
  new THREE.CylinderGeometry(0.5, 1, 2, 16, 4),
];

let index = 0;
let activeIndex = -1;

for (let i = -5; i <= 5; i += 5) {
  for (let j = -5; j <= 5; j += 5) {
    const shapesMaterial = new THREE.MeshBasicMaterial({
      color: "gray",
      wireframe: true,
    });

    const shapeMesh = new THREE.Mesh(geometries[index], shapesMaterial);
    shapeMesh.position.set(i, j, 10);
    shapeMesh.index = index;
    shapeMesh.basePosition = new THREE.Vector3(i, j, 10);
    group.add(shapeMesh);

    index++;
  }
}

scene.add(group);

const resetActive = () => {
  const groupElement = group.children[activeIndex];
  groupElement.material.color.set("gray");
  new TWEEN.Tween(groupElement.position)
    .to(
      { x: groupElement.basePosition.x, y: groupElement.basePosition.y, z: 10 },
      2000
    )
    .easing(TWEEN.Easing.Exponential.InOut)
    .start();
  activeIndex = -1;
};

const rayCaster = new THREE.Raycaster();
const handleClick = (event) => {
  const pointer = new THREE.Vector2();
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

  rayCaster.setFromCamera(pointer, camera);
  const intersections = rayCaster.intersectObjects(group.children);

  if (activeIndex !== -1) resetActive();

  for (let i = 0; i < intersections.length; i++) {
    intersections[i].object.material.color.set("yellow");
    activeIndex = intersections[i].object.index;

    new TWEEN.Tween(intersections[i].object.position)
      .to({ x: 0, y: 0, z: 20 }, 2000)
      .easing(TWEEN.Easing.Exponential.InOut)
      .start();
  }
};

window.addEventListener("click", handleClick);

renderer.render(scene, camera);

const clock = new THREE.Clock();
const tick = () => {
  const delta = clock.getDelta();

  if (activeIndex !== -1) group.children[activeIndex].rotation.y += delta;

  TWEEN.update();
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
};

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

tick();
</script>

<template>
  <h1 class="absolute top-2 left-2 text-3xl">Shapes</h1>
  <router-link
    to="/"
    @click="reset()"
    class="hover:underline h-max absolute top-2 right-2 text-3xl"
    >Back</router-link
  >
</template>
