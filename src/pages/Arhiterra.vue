<script setup lang="ts">
import { onMounted, ref, Ref } from "vue";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { FlakesTexture, RGBELoader } from "three/examples/jsm/Addons.js";

const canvas: Ref<HTMLCanvasElement | null> = ref(null);

function initArhiterra(canvas: HTMLCanvasElement) {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight
  );

  // const camera = new THREE.OrthographicCamera(-6, 6, 6, -6, 0.1, 100);

  camera.position.set(4, 0, 0);
  scene.add(camera);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setClearColor("black");
  renderer.setSize(window.innerWidth, window.innerHeight);

  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.listenToKeyEvents(window);

  // controls.autoRotate = true;
  // controls.autoRotateSpeed = 0.5;
  // controls.enableDamping = true;

  const spotLight = new THREE.SpotLight(
    "#FFFFFF",
    150,
    0,
    (Math.PI * 30) / 180,
    0.5,
    2
  );
  const ambientLight = new THREE.AmbientLight("#ffffff", 1);
  spotLight.position.set(3, 6, 0);
  scene.add(spotLight, ambientLight);

  let metalTexture = new THREE.CanvasTexture(new FlakesTexture());
  metalTexture.wrapS = THREE.RepeatWrapping;
  metalTexture.wrapT = THREE.RepeatWrapping;
  metalTexture.repeat.x = 10;
  metalTexture.repeat.y = 10;

  const loader = new GLTFLoader();

  let envMapLoader = new THREE.PMREMGenerator(renderer);

  new RGBELoader()
    .setPath("/Arhiterra/")
    .load("small_empty_room_1_4k.hdr", function (hdrmap) {
      let envmap = envMapLoader.fromCubemap(hdrmap);

      loader.load("/Arhiterra/Arhiterra_v2.glb", function (obj) {
        obj.scene.traverse((mesh) => {
          mesh.material = new THREE.MeshStandardMaterial({
            side: THREE.DoubleSide,
            color: 0x313131,
            metalness: 1,
            roughness: 0.75,
            normalMap: metalTexture,
            normalScale: new THREE.Vector2(0.15, 0.15),
            transparent: false,
            envMap: envmap.texture,
          });
          function animateMesh(t = 0) {
            mesh.rotateY((Math.PI * t) / 10000000 / 180);

            requestAnimationFrame(animateMesh);
          }
          animateMesh();
        });
        scene.add(obj.scene);
      });
    });

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
