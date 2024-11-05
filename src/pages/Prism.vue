<script setup lang="ts">
import { onMounted, ref } from "vue";
import * as THREE from "three";
import TWEEN from "three/examples/jsm/libs/tween.module";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { vertex, fragment } from "../shaders/rayshader.ts";

const canvas = ref(null);

function initPrism(canvas: HTMLCanvasElement) {
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

  // const loader = new GLTFLoader();
  // loader.load("/prism/scene.gltf", (obj) => {
  //   obj.scene.position.y = -0.5;
  //   scene.add(obj.scene);
  // });

  const spotLight = new THREE.SpotLight(
    "#FFFFFF",
    120,
    0,
    (Math.PI * 30) / 180,
    1
  );
  spotLight.position.y = 4;
  scene.add(spotLight);

  const planeGeo = new THREE.PlaneGeometry(10, 10);
  const planeMat = new THREE.MeshPhongMaterial({
    color: "#111111",
    side: THREE.DoubleSide,
  });

  const plane = new THREE.Mesh(planeGeo, planeMat);
  plane.rotateX((Math.PI * 90) / 180);
  plane.position.y = -0.51;
  scene.add(plane);

  const prismGeometry = new THREE.ConeGeometry(0.75, 1, 4, 1);
  const prismMaterial = new THREE.MeshPhysicalMaterial({
    color: "#ADD8E6",
    transmission: 0.985,
    thickness: 2,
    roughness: 0.5,
    reflectivity: 0.002,
    side: THREE.DoubleSide,
  });

  const prismMesh = new THREE.Mesh(prismGeometry, prismMaterial);
  scene.add(prismMesh);

  // const axesHelper = new THREE.AxesHelper(5);
  // scene.add(axesHelper);

  const inGeo = new THREE.CylinderGeometry(0, 0.01, 1.32, 56, 1, true);
  const insideGeo = new THREE.CylinderGeometry(0.01, 0.02, 0.58, 56, 1, true);
  const outGeo = new THREE.CylinderGeometry(0.02, 0.05, 1.32, 56, 1, true);

  const inMat = new THREE.MeshBasicMaterial({
    color: "#ffffff",
    side: THREE.DoubleSide,
  });
  const colorMat = new THREE.ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    side: THREE.DoubleSide,
  });

  const inMesh = new THREE.Mesh(inGeo, inMat);
  inMesh.rotateY((Math.PI * -45) / 180);
  inMesh.rotateZ((Math.PI * -63.5) / 180);
  inMesh.position.set(1, 0.5, 1);
  inMesh.scale.setScalar(0.1);
  scene.add(inMesh);

  const insideMesh = new THREE.Mesh(insideGeo, colorMat);
  insideMesh.rotateX((Math.PI * 90) / 180);
  insideMesh.rotateZ((Math.PI * -45) / 180);
  insideMesh.rotateY((Math.PI * -65) / 180);
  insideMesh.position.set(0.2, -0.045, 0.2);

  insideMesh.scale.setScalar(0);
  scene.add(insideMesh);

  const outMesh = new THREE.Mesh(outGeo, colorMat);
  outMesh.rotateY((Math.PI * -45) / 180);
  outMesh.rotateZ((Math.PI * -116.5) / 180);
  outMesh.position.set(-0.2, -0.05, -0.2);
  outMesh.scale.setScalar(0);
  scene.add(outMesh);

  const inTween = () => {
    new TWEEN.Tween(inMesh.scale).to({ x: 1, y: 1, z: 1 }, 2500).start();
    new TWEEN.Tween(inMesh.position)
      .to({ x: 0.625, y: 0.25, z: 0.625 }, 2500)
      .easing(TWEEN.Easing.EaseInQuad)
      .start().start;
  };

  const insideTween = () => {
    new TWEEN.Tween(insideMesh.scale)
      .to({ x: 1, y: 1, z: 1 }, 2500)
      .delay(2500)
      .start();
    new TWEEN.Tween(insideMesh.position)
      .to({ x: 0, y: -0.045, z: 0 }, 2500)
      .easing(TWEEN.Easing.EaseInQuad)
      .delay(2500)
      .start();
  };

  const outTween = () => {
    new TWEEN.Tween(outMesh.scale)
      .to({ x: 1, y: 1, z: 1 }, 2500)
      .delay(5000)
      .start();
    new TWEEN.Tween(outMesh.position)
      .to({ x: -0.625, y: 0.25, z: -0.625 }, 2500)
      .easing(TWEEN.Easing.EaseInQuad)
      .delay(5000)
      .start();
  };

  inTween();
  insideTween();
  outTween();

  const animate = () => {
    TWEEN.update();
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
  if (canvas.value) initPrism(canvas.value);
});
</script>

<template>
  <h1 class="absolute text-3xl top-2 left-2">Prism</h1>
  <router-link
    to="/"
    class="absolute text-3xl hover:underline h-max top-2 right-2"
    >Back</router-link
  >
  <canvas ref="canvas" class="w-screen h-screen"></canvas>
</template>
