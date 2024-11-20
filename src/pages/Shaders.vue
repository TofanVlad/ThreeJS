<script setup lang="ts">
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { onMounted, ref, Ref } from "vue";
import foliageVertex from "../shaders/Foliage/foliageVertex.glsl";
import folaigeFragment from "../shaders/Foliage/folaigeFragment.glsl";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

const canvas: Ref<HTMLCanvasElement | null> = ref(null);

function initShaders(canvas: HTMLCanvasElement) {
  //
  // INIT SETUP
  //

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight
  );

  camera.position.set(-1, 4, 8);
  scene.add(camera);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.listenToKeyEvents(window);

  //
  // LIGHTS
  //

  const directionLight = new THREE.DirectionalLight(0xffffff, 3);
  directionLight.position.set(15, 15, 15);
  scene.add(directionLight);

  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);

  //
  // MODEL LOADER
  //

  const loader = new GLTFLoader();

  loader.load("/PodcoavaVerde/Bush.glb", function (obj) {
    obj.scene.traverse((mesh) => {
      if (mesh.name === "Foliage") {
        mesh.material = new THREE.ShaderMaterial({
          vertexShader: foliageVertex,
          fragmentShader: folaigeFragment,
          side: THREE.DoubleSide,
          uniforms: {
            uColorGradient: {
              value: [
                new THREE.Color("#4a8d7e").convertLinearToSRGB(),
                new THREE.Color("#377f6a").convertLinearToSRGB(),
                new THREE.Color("#184f52").convertLinearToSRGB(),
                new THREE.Color("#143b36").convertLinearToSRGB(),
              ],
            },
            uBrightnessThresholds: {
              value: [0.9, 0.45, 0.001],
            },
            uLightPosition: {
              value: directionLight.position,
            },
            uRepeatPattern: {
              value: false,
            },
          },
        });
      }
    });
    scene.add(obj.scene);
  });

  //
  // ANIMATION
  //

  const animate = () => {
    controls.update();

    const object = scene.getObjectByName("Foliage");
    if (object) {
      object.rotation.x += 0.005;
      object.rotation.y += 0.005;
    }

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  };

  animate();

  //
  // RESPONSIVENESS
  //

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.render(scene, camera);
  });
}

onMounted(() => {
  if (canvas.value) {
    initShaders(canvas.value);
  }
});
</script>

<template>
  <h1 class="absolute text-3xl top-2 left-2">Shaders</h1>
  <router-link
    to="/"
    class="absolute text-3xl hover:underline h-max top-2 right-2"
    >Back</router-link
  >
  <canvas ref="canvas" class="w-screen h-screen"></canvas>
</template>
