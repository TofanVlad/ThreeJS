<script setup lang="ts">
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { onMounted, ref, Ref } from "vue";
import vertex from "../shaders/Foliage/vertex.glsl";
import fragment from "../shaders/Foliage/fragment.glsl";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

const canvas: Ref<HTMLCanvasElement | null> = ref(null);

function initShaders(canvas: HTMLCanvasElement) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight
  );

  camera.position.z = 5;
  camera.position.x = 5;
  scene.add(camera);

  const renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setSize(window.innerWidth, window.innerHeight);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.listenToKeyEvents(window);

  const directionLight = new THREE.DirectionalLight(0xffffff, 1);
  directionLight.position.set(5, 5, 5);
  scene.add(directionLight, directionLight.target);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
  scene.add(ambientLight);

  const loader = new GLTFLoader();

  loader.load("/Shaders/Foliage.glb", function (obj) {
    obj.scene.traverse((mesh) => {
      mesh.material = new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        side: THREE.DoubleSide,
        uniforms: {
          uColorGradient: {
            value: [
              new THREE.Color("#427062").convertLinearToSRGB(),
              new THREE.Color("#33594e").convertLinearToSRGB(),
              new THREE.Color("#234549").convertLinearToSRGB(),
              new THREE.Color("#1e363f").convertLinearToSRGB(),
            ],
          },
          uBrightnessThresholds: {
            value: [0.85, 0.45, 0.001],
          },
          uLightPosition: {
            value: new THREE.Vector3(15, 15, 15),
          },
        },
      });
    });
    scene.add(obj.scene);
    obj.scene.name = "Foliage";
  });

  const clock = new THREE.Clock();

  const animate = () => {
    controls.update();

    const foliage = scene.getObjectByName("Foliage");
    if (foliage) {
      foliage.scale.x += Math.cos(clock.getElapsedTime()) * 0.001;
      foliage.scale.y += Math.sin(clock.getElapsedTime()) * 0.0005;
      foliage.rotation.y += 0.005;
    }
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
