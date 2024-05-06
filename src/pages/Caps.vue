<script setup>
import * as THREE from "three";
import TWEEN from "three/examples/jsm/libs/tween.module";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RectAreaLightHelper } from "three/addons/helpers/RectAreaLightHelper.js";

const camera = new THREE.PerspectiveCamera(
  65,
  window.innerWidth / window.innerHeight
);

const scene = new THREE.Scene();
scene.add(camera);

camera.position.set(3, 15, 3);

const sunLight = new THREE.PointLight(0xffffff, 15);
sunLight.position.y = 5;
scene.add(sunLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientLight);

const size = 10;
const divisions = 10;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("app").appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.listenToKeyEvents(window);

const keyboardGeometry = new THREE.PlaneGeometry(17, 4);
const keyboardMaterial = new THREE.MeshPhongMaterial({
  color: 0x1c1c1c,
  side: THREE.DoubleSide,
});

const keyboardPanel = new THREE.Mesh(keyboardGeometry, keyboardMaterial);
keyboardPanel.rotation.x = (Math.PI / 180) * 100;
keyboardPanel.position.y = -1;
scene.add(keyboardPanel);

const keyCapLight = new THREE.RectAreaLight(0xd63230, 3, 16.5, 3.5);
keyCapLight.rotation.x = (Math.PI / 180) * 100;
keyCapLight.position.y = -0.95;

const rectLightHelper = new RectAreaLightHelper(keyCapLight);
keyCapLight.add(rectLightHelper);

scene.add(keyCapLight);

let myModels = [];
const loader = new GLTFLoader();

for (let i = -7.8; i <= 7.8; i += 1.3) {
  for (let j = -1.3; j <= 1.3; j += 1.3) {
    loader.load(
      "/keycap/keycap.glb",
      function (gltf) {
        gltf.scene.position.set(i, j * -0.2, j);
        myModels.push(gltf.scene);
        scene.add(gltf.scene);
      },
      undefined,
      function (error) {
        console.error(error);
      }
    );
  }
}

// Raycaster

const pointer = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

// Random keyPress animation
const randomKeyPress = () => {
  setInterval(() => {
    const randomIndex = Math.floor(Math.random() * myModels.length);
    if (myModels[randomIndex].isAnimated) return;
    new TWEEN.Tween(myModels[randomIndex].position)
      .to(
        {
          x: myModels[randomIndex].position.x,
          y: myModels[randomIndex].position.y - 0.3,
          z: myModels[randomIndex].position.z,
        },
        250
      )
      .onStart(() => {
        myModels[randomIndex].isAnimated = true;
      })
      .onComplete(() => {
        myModels[randomIndex].isAnimated = false;
      })

      .dynamic(true)
      .repeat(1)
      .repeatDelay(250)
      .yoyo(true)
      .start();
  }, 250);
};

randomKeyPress();

// Animate keyboard lightning
new TWEEN.Tween(keyCapLight.color)
  .to({ r: 0.1, g: 0.46, b: 0.76 }, 5000)
  .repeat(Infinity)
  .yoyo(true)
  .repeatDelay(1000)
  .start();

const onMouseMove = (event) => {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);

  const intersects = raycaster.intersectObjects(myModels);
  const rayCastedObject = intersects[0];

  if (intersects.length > 0 && !rayCastedObject.object.isAnimated) {
    new TWEEN.Tween(rayCastedObject.object.parent.position)
      .to(
        {
          x: rayCastedObject.object.position.x,
          y: rayCastedObject.object.position.y - 0.3,
          z: rayCastedObject.object.position.z,
        },
        250
      )
      .onStart(() => {
        rayCastedObject.object.isAnimated = true;
      })
      .onComplete(() => {
        rayCastedObject.object.isAnimated = false;
      })

      .dynamic(true)
      .repeat(1)
      .repeatDelay(250)
      .yoyo(true)
      .start();
  }
};

const tick = () => {
  controls.update();
  TWEEN.update();
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
};

tick();

window.addEventListener("mousemove", onMouseMove);

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
  <h1 class="absolute top-2 left-2 text-3xl">Caps</h1>
  <router-link
    to="/"
    @click="reset()"
    class="hover:underline h-max absolute top-2 right-2 text-3xl"
    >Back</router-link
  >
</template>
