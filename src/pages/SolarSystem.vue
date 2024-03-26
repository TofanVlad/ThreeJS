<script setup>
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  65,
  window.innerWidth / window.innerHeight
);

// Renderer to render our scene
const renderer = new THREE.WebGLRenderer({ antialias: true });

// Orbit controls for camera movement
const controls = new OrbitControls(camera, renderer.domElement);

function init() {
  camera.position.z = 5;
  scene.add(camera);

  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById("app").appendChild(renderer.domElement);

  // Damping for smooth slow down of rotation of earth on mouse moving
  controls.enableDamping = true;

  // Disabling pan so user can't lose earth out of sight
  controls.enablePan = false;
  controls.minDistance = 1.5;
  controls.maxDistance = 15;
  controls.listenToKeyEvents(window);
}

init();

const light = new THREE.DirectionalLight(0xffffff);
light.position.set(-2, 0.5, 1.5);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.05);
scene.add(ambientLight);

scene.add(light);

// Group for easy align of textures
const earthGroup = new THREE.Group();

// Earth's natural tilt ( 23.4 deg )
earthGroup.rotation.z = (-23.4 * Math.PI) / 180;

scene.add(earthGroup);

// Initialising texture loader
const loader = new THREE.TextureLoader();

// Earth Geometry + Material
const earthGeometry = new THREE.IcosahedronGeometry(1, 12);
const earthMaterial = new THREE.MeshPhongMaterial({
  // color: "red",
  map: loader.load("/textures/8k_earth_daymap.jpg"),
  specularMap: loader.load("/textures/8k_earth_specular_map.tif"),
  bumpMap: loader.load("/textures/01_earthbump1k.jpg"),
  bumpScale: 1.5,
});

// Earth

const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
earthMesh.receiveShadow = true;
earthGroup.add(earthMesh);

// Earth's night time lights from cities
const earthLightsMaterial = new THREE.MeshBasicMaterial({
  map: loader.load("/textures/8k_earth_nightmap.jpg"),
  blending: THREE.AdditiveBlending,
});

const earthLightsMesh = new THREE.Mesh(earthGeometry, earthLightsMaterial);
earthGroup.add(earthLightsMesh);

// Earth's clouds
const earthCloudsMaterial = new THREE.MeshStandardMaterial({
  map: loader.load("/textures/8k_earth_clouds.jpg"),
  transparent: true,
  blending: THREE.AdditiveBlending,
});
const earthCloudsMesh = new THREE.Mesh(earthGeometry, earthCloudsMaterial);
earthCloudsMesh.scale.setScalar(1.005);
earthGroup.add(earthCloudsMesh);

// Earth's atmosphere
const earthAtmosphereMaterial = new THREE.MeshStandardMaterial({
  color: 0x14adff,
  opacity: 0.4,
  transparent: true,
});
const earthAtmosphere = new THREE.Mesh(earthGeometry, earthAtmosphereMaterial);
earthAtmosphere.scale.setScalar(1.01);
earthGroup.add(earthAtmosphere);

// Moon

const moonGeometry = new THREE.IcosahedronGeometry(0.25, 8);
const moonMaterial = new THREE.MeshPhongMaterial({
  map: loader.load("/textures/8k_moon.jpg"),
});

const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
const MoonGroup = new THREE.Group();
MoonGroup.add(moonMesh);
scene.add(MoonGroup);

moonMesh.position.x = 10;

// Moon's natural tilt ( about 5 deg )
MoonGroup.rotation.z = (-5 * Math.PI) / 180;

// Space

const spaceGeometry = new THREE.SphereGeometry(200, 6, 6);
const spaceMaterial = new THREE.MeshBasicMaterial({
  map: loader.load("/textures/8k_stars.jpg"),
  side: THREE.BackSide,
  transparent: true,
  opacity: 0.5,
  // wireframe: true,
  // color: "red",
});

const spaceMesh = new THREE.Mesh(spaceGeometry, spaceMaterial);
scene.add(spaceMesh);

// Saving current targeted by the camera object
let currentObject = earthMesh;
const direction = new THREE.Vector3();

// Animation function that updates every frame our scene
function animate() {
  requestAnimationFrame(animate);

  MoonGroup.rotation.y += 0.0005;

  // Getting current position of selected object and target camera on it
  currentObject.getWorldPosition(controls.target);

  // Targeting camera to object
  direction.subVectors(camera.position, controls.target);
  camera.position.copy(direction.add(controls.target));

  // Earth's rotation and Moon orbit
  earthGroup.rotation.y += 0.001;
  earthCloudsMesh.rotation.y += 0.0001;

  controls.update();
  renderer.render(scene, camera);
}

animate();

// Focuses camera on selected object
const focusObject = (object, min, max) => {
  currentObject = object;
  controls.minDistance = min;
  controls.maxDistance = max;

  // Checking if earth is selected placing it in center of scene and orbiting all other objects around it
  if (object === earthMesh) {
    moonMesh.position.x = 10;
    earthGroup.position.x = 0;
    camera.position.z = 5;

    MoonGroup.remove(earthGroup);
    scene.add(earthGroup);
  }

  // Checking if moon is selected placing it in center of the scene and orbiting all other objects around it
  if (object === moonMesh) {
    moonMesh.position.x = 0;
    earthGroup.position.x = -10;
    camera.position.z = 1;

    MoonGroup.add(earthGroup);
  }
};

// Function to reset our canvas before quiting this page
const reset = () => {
  document.getElementById("app").removeChild(renderer.domElement);
};

function handleWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", handleWindowResize, false);
</script>

<template>
  <h1 class="absolute top-2 left-2 text-3xl">Solar system</h1>
  <div class="flex absolute text-xl top-2 left-1/2 -translate-x-1/2 gap-4">
    <h2
      class="w-max h-max hover:underline hover:cursor-pointer"
      @click="focusObject(earthMesh, 1.5, 10)"
    >
      Earth
    </h2>
    <h2
      class="w-max h-max hover:underline hover:cursor-pointer"
      @click="focusObject(moonMesh, 0.5, 5)"
    >
      Moon
    </h2>
  </div>
  <router-link
    to="/"
    @click="reset()"
    class="hover:underline h-max absolute top-2 right-2 text-3xl"
    >Back</router-link
  >
</template>
