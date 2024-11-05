<script setup lang="ts">
import { onMounted, ref, Ref } from "vue";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import * as THREE from "three";

const canvas: Ref<HTMLCanvasElement | null> = ref(null);

function initArhiterra(canvas: HTMLCanvasElement) {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight
  );

  // const camera = new THREE.OrthographicCamera(-6, 6, 6, -6, 0.1, 100);

  camera.position.set(8, 0, 0);
  scene.add(camera);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setClearColor("black");
  renderer.setSize(window.innerWidth, window.innerHeight);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.listenToKeyEvents(window);

  const spotLight = new THREE.SpotLight("#ffffff", 100);
  const ambientLight = new THREE.AmbientLight("#ffffff", 5);
  spotLight.position.set(1, 5, 0);
  scene.add(spotLight, ambientLight);

  const geometryBottom = new THREE.CylinderGeometry(
    0.65 / Math.sqrt(2),
    1 / Math.sqrt(2),
    1,
    4,
    1
  ).toNonIndexed();
  geometryBottom.computeVertexNormals();
  geometryBottom.rotateY(Math.PI / 4);
  geometryBottom;

  const geometryMiddle = new THREE.CylinderGeometry(
    0.3 / Math.sqrt(2),
    0.6 / Math.sqrt(2),
    1,
    4,
    1
  ).toNonIndexed();
  geometryMiddle.computeVertexNormals();
  geometryMiddle.rotateY(Math.PI / 4);

  const topGeometry = new THREE.CylinderGeometry(
    0 / Math.sqrt(2),
    0.35 / Math.sqrt(2),
    1,
    4,
    1
  ).toNonIndexed();
  topGeometry.computeVertexNormals();
  topGeometry.rotateY(Math.PI / 4);

  const lineMaterial = new THREE.LineBasicMaterial({ color: "white" });

  const edgeTop = new THREE.EdgesGeometry(topGeometry);
  const lineTop = new THREE.LineSegments(edgeTop, lineMaterial);

  const edgeMiddle = new THREE.EdgesGeometry(geometryMiddle);
  const lineMiddle = new THREE.LineSegments(edgeMiddle, lineMaterial);

  const edgeBottom = new THREE.EdgesGeometry(geometryBottom);
  const linebottom = new THREE.LineSegments(edgeBottom, lineMaterial);

  linebottom.position.y = -1;
  lineMiddle.position.y = 0.25;
  lineTop.scale.set(3, 0.9, 3);
  lineTop.position.y = 1.45;
  lineMiddle.scale.set(4, 1, 4);
  linebottom.scale.set(4, 1, 4);

  const group = new THREE.Group();
  group.add(lineTop, lineMiddle, linebottom);

  scene.add(group);

  camera.lookAt(group.position);

  function tick() {
    controls.update();

    requestAnimationFrame(tick);
    renderer.render(scene, camera);
    // group.rotateY(t * 0.00000001);
  }

  tick();

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.render(scene, camera);
  });
}

onMounted(() => {
  if (canvas.value) initArhiterra(canvas.value);
});
</script>

<template>
  <h1 class="absolute text-3xl top-2 left-2">Arhiterra</h1>
  <router-link
    to="/"
    class="absolute text-3xl hover:underline h-max top-2 right-2"
    >Back</router-link
  >
  <canvas ref="canvas" class="w-screen h-screen"></canvas>
</template>
