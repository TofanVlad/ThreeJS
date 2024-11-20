<script setup lang="ts">
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { onMounted, ref, Ref } from "vue";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { getGhilbiMaterial, getGradientMaterial } from "./helper";

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

  //   controls.maxPolarAngle = (Math.PI * 75) / 180;

  //
  // LIGHTS
  //

  const directionLight = new THREE.DirectionalLight(0xffffff, 10);
  directionLight.position.set(2, 18, 2);
  scene.add(directionLight);

  const ambientLight = new THREE.AmbientLight(0xffffff, 3);
  scene.add(ambientLight);

  const loader = new GLTFLoader();

  const waterGeometry = new THREE.CylinderGeometry(6, 6, 2, 128, 128);

  const waterMaterial = getGradientMaterial(
    [
      new THREE.Color("#00f9ff").convertLinearToSRGB(),
      new THREE.Color("#00ecff").convertLinearToSRGB(),
      new THREE.Color("#00dfff").convertLinearToSRGB(),
      new THREE.Color("#00d2ff").convertLinearToSRGB(),
      new THREE.Color("#00c5ff").convertLinearToSRGB(),
    ],
    [0.7, 0.65, 0.6],
    new THREE.Vector3(0, 3, 0)
  );
  waterMaterial.transparent = true;
  waterMaterial.side = THREE.DoubleSide;

  const water = new THREE.Mesh(waterGeometry, waterMaterial);
  water.position.y = -0.5;
  // water.rotation.x = Math.PI / 2;
  water.material.side = THREE.DoubleSide;
  scene.add(water);

  //
  // BOAT
  //

  const boatGroup = new THREE.Group();

  loader.load("/PodcoavaVerde/Boat.glb", function (obj) {
    obj.scene.scale.setScalar(0.5);
    obj.scene.position.y = 0.5;
    boatGroup.add(obj.scene);
  });

  scene.add(boatGroup);

  //
  // SAND
  //

  const sandGeometry = new THREE.CylinderGeometry(6.1, 6.1, 0.5, 128, 128);
  const sandMaterial = getGhilbiMaterial(
    [
      new THREE.Color("#f2d2a9").convertLinearToSRGB(),
      new THREE.Color("#eccca2").convertLinearToSRGB(),
      new THREE.Color("#e7c496").convertLinearToSRGB(),
      new THREE.Color("#e1bf92").convertLinearToSRGB(),
    ],
    [0.55, 0.45, 0.4],
    new THREE.Vector3(0, 1, 0)
  );

  const sand = new THREE.Mesh(sandGeometry, sandMaterial);
  sand.position.y = -1.75;
  scene.add(sand);

  //
  // FISH
  //

  let mixer: THREE.AnimationMixer | null = null;
  const fishGroup = new THREE.Group();
  fishGroup.name = "Fish";

  loader.load("/PodcoavaVerde/Fish.glb", function (obj) {
    obj.scene.rotation.y = Math.PI;
    obj.scene.scale.setScalar(2.5);
    obj.scene.position.x = 4;

    mixer = new THREE.AnimationMixer(obj.scene);
    const clips = obj.animations;

    const clip = THREE.AnimationClip.findByName(clips, "idle");
    const action = mixer.clipAction(clip);
    action.play();

    fishGroup.add(obj.scene);
  });

  scene.add(fishGroup);

  //
  // ROCKS
  //

  const rockGeometry = new THREE.TetrahedronGeometry(0.95, 1);
  const rockMaterial = new THREE.MeshToonMaterial({ color: "#474747" });

  const rock1 = new THREE.Mesh(rockGeometry, rockMaterial);
  const rock2 = new THREE.Mesh(rockGeometry, rockMaterial);
  rock1.rotation.x = Math.PI / 4;
  rock1.position.set(3, -1.5, -2);
  rock2.position.set(-3, -1.4, 1.5);
  scene.add(rock1, rock2);

  //
  // SEAWEED
  //

  let mixer2: THREE.AnimationMixer | null = null;
  loader.load("/PodcoavaVerde/Seaweed.glb", function (obj) {
    obj.scene.scale.setScalar(0.5);
    obj.scene.position.set(1, -1.5, 1.5);

    mixer2 = new THREE.AnimationMixer(obj.scene);
    const clips = obj.animations;
    console.log(clips);

    const clip = THREE.AnimationClip.findByName(clips, "Sway");
    const action = mixer2.clipAction(clip);
    action.play();

    scene.add(obj.scene);
  });

  //
  // ANIMATION
  //

  const clock = new THREE.Clock();
  const animate = () => {
    controls.update();

    if (mixer && mixer2) {
      mixer.update(clock.getDelta());
      mixer2.update(clock.getDelta());
    }

    water.material.uniforms.uTime.value = clock.getElapsedTime();
    water.material.uniforms.uLightPosition.value = new THREE.Vector3(
      0,
      5 + Math.sin(clock.getElapsedTime() / 3) / 5,
      0
    );

    boatGroup.position.y = Math.sin(clock.getElapsedTime()) * 0.25 + 0.15;
    boatGroup.rotation.z = Math.sin(clock.getElapsedTime()) * -0.05;
    boatGroup.rotation.x = Math.sin(clock.getElapsedTime()) * 0.1;

    fishGroup.position.y = Math.sin(clock.getElapsedTime() * 1) / 4 - 0.5;
    fishGroup.rotation.y += 0.005;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  };

  animate();

  //
  //  RESPONSIVENESS
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
  <h1 class="absolute text-3xl top-2 left-2">Boat</h1>
  <router-link
    to="/"
    class="absolute text-3xl hover:underline h-max top-2 right-2"
    >Back</router-link
  >
  <canvas ref="canvas" class="w-screen h-screen"></canvas>
</template>
