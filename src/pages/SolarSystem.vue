<script setup>
import { ref } from "vue";
import myPlanet from "../components/my-planet.vue";
import mySideBar from "../components/my-sidebar.vue";

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { UnrealBloomPass } from "/node_modules/three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { EffectComposer } from "/node_modules/three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "/node_modules/three/examples/jsm/postprocessing/RenderPass.js";

const areOrbitsShown = ref(true);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  65,
  window.innerWidth / window.innerHeight,
  0.1,
  2600
);

// Renderer to render our scene
const renderer = new THREE.WebGLRenderer({ antialias: true });

const orbitColor = new THREE.Color(0x808080);

// Orbit controls for camera movement
const controls = new OrbitControls(camera, renderer.domElement);

function init() {
  camera.position.z = 10;
  scene.add(camera);

  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById("app").appendChild(renderer.domElement);

  // Damping for smooth slow down of rotation of earth on mouse moving
  controls.enableDamping = true;

  // Disabling pan so user can't lose earth out of sight
  controls.enablePan = false;
  controls.minDistance = 3;
  controls.maxDistance = 10;
  controls.listenToKeyEvents(window);

  // controls.autoRotate = true;
}

init();

// const size = 100;
// const divisions = 100;

// const gridHelper = new THREE.GridHelper(size, divisions);
// scene.add(gridHelper);

const sunLight = new THREE.PointLight(0xffffff, 1, 0, 0.01);
sunLight.position.set(0, 0, 0);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.05);
scene.add(ambientLight);

scene.add(sunLight);

// Initialising texture loader
const loader = new THREE.TextureLoader();

// Sun

const sunGeometry = new THREE.IcosahedronGeometry(5, 12);
const sunMaterial = new THREE.MeshStandardMaterial({
  emissive: 0xffff66,
  emissiveMap: loader.load("/textures/2k_sun.jpg"),
  emissiveIntensity: 1.5,
});

const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sunMesh);

// Earth Geometry + Material
const earthGeometry = new THREE.IcosahedronGeometry(1, 12);
const earthMaterial = new THREE.MeshPhongMaterial({
  // color: "red",
  map: loader.load("/textures/2k_earth_daymap.jpg"),
  specularMap: loader.load("/textures/2k_earth_specular_map.tif"),
  bumpMap: loader.load("/textures/earthbump1k.jpg"),
  bumpScale: 1.5,
});

// Earth

// Group for easy align of textures
const earthGroup = new THREE.Group();

const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
earthMesh.receiveShadow = true;
earthGroup.add(earthMesh);

// Earth's night time lights from cities
const earthLightsMaterial = new THREE.MeshBasicMaterial({
  map: loader.load("/textures/2k_earth_nightmap.jpg"),
  blending: THREE.AdditiveBlending,
});

const earthLightsMesh = new THREE.Mesh(earthGeometry, earthLightsMaterial);
earthGroup.add(earthLightsMesh);

// Earth's clouds
const earthCloudsMaterial = new THREE.MeshStandardMaterial({
  map: loader.load("/textures/2k_earth_clouds.jpg"),
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

const earthOrbitGeometry = new THREE.EllipseCurve(0.4, 0, 39.8, 40);
const earthOrbitMaterial = new THREE.LineBasicMaterial({ color: orbitColor });
const earthOrbitLine = new THREE.Line(
  new THREE.BufferGeometry().setFromPoints(
    earthOrbitGeometry.getSpacedPoints(256)
  ),
  earthOrbitMaterial
);

earthOrbitLine.rotation.x = (90 * Math.PI) / 180;

// Earth's orbit 7 degree tilt
earthOrbitLine.rotation.y = (7 * Math.PI) / 180;

scene.add(earthGroup);
scene.add(earthOrbitLine);

// Moon

const moonGeometry = new THREE.IcosahedronGeometry(0.25, 8);
const moonMaterial = new THREE.MeshPhongMaterial({
  map: loader.load("/textures/2k_moon.jpg"),
});

const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);

const moonOrbitGeometry = new THREE.EllipseCurve(-1.1, 0, 4.4, 4);
const moonOrbitMaterial = new THREE.LineBasicMaterial({ color: orbitColor });
const moonOrbitLine = new THREE.Line(
  new THREE.BufferGeometry().setFromPoints(
    moonOrbitGeometry.getSpacedPoints(256)
  ),
  moonOrbitMaterial
);

scene.add(moonMesh);

moonOrbitLine.rotation.x = (95.1 * Math.PI) / 180;
earthGroup.add(moonOrbitLine);

// Mars

const marsGeometry = new THREE.IcosahedronGeometry(0.55, 12);
const marsMaterial = new THREE.MeshPhongMaterial({
  map: loader.load("/textures/2k_mars.jpg"),
});

const marsMesh = new THREE.Mesh(marsGeometry, marsMaterial);
const marsOrbitGeometry = new THREE.EllipseCurve(-10, 0, 60.8, 60.9);
const marsOrbitMaterial = new THREE.LineBasicMaterial({ color: orbitColor });
const marsOrbitLine = new THREE.Line(
  new THREE.BufferGeometry().setFromPoints(
    marsOrbitGeometry.getSpacedPoints(256)
  ),
  marsOrbitMaterial
);
scene.add(marsMesh);
scene.add(marsOrbitLine);

// Mars natural axial tilt of 25 deg
marsMesh.rotation.z = (-25 * Math.PI) / 180;
marsOrbitLine.rotation.x = (90 * Math.PI) / 180;
marsOrbitLine.rotation.y = (5.6 * Math.PI) / 180;
marsOrbitLine.rotation.z = (102 * Math.PI) / 180;

// Mercury

const mercuryGeometry = new THREE.IcosahedronGeometry(0.3, 8);
const mercuryMaterial = new THREE.MeshPhongMaterial({
  map: loader.load("/textures/2k_mercury.jpg"),
});

const mercuryMesh = new THREE.Mesh(mercuryGeometry, mercuryMaterial);

// Natural Mercury's tilt of 2 deg
mercuryMesh.rotation.x = (2 * Math.PI) / 180;
scene.add(mercuryMesh);

const mercuryOrbitGeometry = new THREE.EllipseCurve(4.6, 0, 15.2, 15);
const mercuryOrbitMaterial = new THREE.LineBasicMaterial({ color: orbitColor });
const mercuryOrbitLine = new THREE.Line(
  new THREE.BufferGeometry().setFromPoints(
    mercuryOrbitGeometry.getSpacedPoints(256)
  ),
  mercuryOrbitMaterial
);

mercuryOrbitLine.rotation.x = (90 * Math.PI) / 180;
mercuryOrbitLine.rotation.y = (3.38 * Math.PI) / 180;
mercuryOrbitLine.rotation.z = (-41 * Math.PI) / 180;

scene.add(mercuryOrbitLine);

// Venus

const venusGeometry = new THREE.IcosahedronGeometry(1, 12);
const venusMaterial = new THREE.MeshPhongMaterial({
  map: loader.load("/textures/2k_venus_surface.jpg"),
});

const venusMesh = new THREE.Mesh(venusGeometry, venusMaterial);

const venusAtmosphereGeometry = new THREE.IcosahedronGeometry(1, 12);
const venusAtmosphereMaterial = new THREE.MeshPhongMaterial({
  map: loader.load("/textures/4k_venus_atmosphere.jpg"),
  transparent: true,
  blending: THREE.AdditiveBlending,
});

const venusAtmosphere = new THREE.Mesh(
  venusAtmosphereGeometry,
  venusAtmosphereMaterial
);

venusAtmosphere.scale.setScalar(1.005);

const venusGroup = new THREE.Group();
venusGroup.add(venusMesh);
venusGroup.add(venusAtmosphere);

const venusOrbitGeometry = new THREE.EllipseCurve(-0.5, 0, 28.6, 28.8);
const venusOrbitMaterial = new THREE.LineBasicMaterial({ color: orbitColor });
const venusOrbitLine = new THREE.Line(
  new THREE.BufferGeometry().setFromPoints(
    venusOrbitGeometry.getSpacedPoints(256)
  ),
  venusOrbitMaterial
);
venusOrbitLine.rotation.x = (90 * Math.PI) / 180;

// Venus natural axial tilt of 3 deg
venusOrbitLine.rotation.y = (3.86 * Math.PI) / 180;
venusOrbitLine.rotation.z = (-72 * Math.PI) / 180;

scene.add(venusOrbitLine);
scene.add(venusGroup);

// Jupiter

const jupiterGeometry = new THREE.IcosahedronGeometry(2.5, 12);
const jupiterMaterial = new THREE.MeshPhongMaterial({
  map: loader.load("/textures/2k_jupiter.jpg"),
});

const jupiterMesh = new THREE.Mesh(jupiterGeometry, jupiterMaterial);

// Jupiter natural axial tilt of 3 deg
jupiterMesh.rotation.z = (-3 * Math.PI) / 180;

const jupiterOrbitGeometry = new THREE.EllipseCurve(24.5, 0, 206, 208);
const jupiterOrbitMaterial = new THREE.LineBasicMaterial({ color: orbitColor });
const jupiterOrbitLine = new THREE.Line(
  new THREE.BufferGeometry().setFromPoints(
    jupiterOrbitGeometry.getSpacedPoints(256)
  ),
  jupiterOrbitMaterial
);
jupiterOrbitLine.rotation.x = (90 * Math.PI) / 180;
jupiterOrbitLine.rotation.y = (6 * Math.PI) / 180;
jupiterOrbitLine.rotation.z = (-54 * Math.PI) / 180;

scene.add(jupiterMesh);
scene.add(jupiterOrbitLine);

// Saturn

const saturnGeometry = new THREE.IcosahedronGeometry(2.2, 12);
const saturnMaterial = new THREE.MeshPhongMaterial({
  map: loader.load("/textures/2k_saturn.jpg"),
});

const saturnMesh = new THREE.Mesh(saturnGeometry, saturnMaterial);
const saturnGroup = new THREE.Group();

const saturnRingGeometry = new THREE.RingGeometry(2.5, 4.2, 32);
const saturnRingMaterial = new THREE.MeshLambertMaterial({
  map: loader.load("/textures/saturn_rings.png"),
  side: THREE.DoubleSide,
  transparent: true,
});

const saturnRings = new THREE.Mesh(saturnRingGeometry, saturnRingMaterial);
saturnRings.rotation.x = (107 * Math.PI) / 180;

saturnGroup.add(saturnMesh);
saturnGroup.add(saturnRings);

const saturnOrbitGeometry = new THREE.EllipseCurve(-42.1, 0, 382.8, 383.2);
const saturnOrbitMaterial = new THREE.LineBasicMaterial({ color: orbitColor });
const saturnOrbitLine = new THREE.Line(
  new THREE.BufferGeometry().setFromPoints(
    saturnOrbitGeometry.getSpacedPoints(256)
  ),
  saturnOrbitMaterial
);
saturnOrbitLine.rotation.x = (90 * Math.PI) / 180;
saturnOrbitLine.rotation.y = (5.5 * Math.PI) / 180;
saturnOrbitLine.rotation.z = (65 * Math.PI) / 180;

scene.add(saturnGroup);
scene.add(saturnOrbitLine);

// Uranus

const uranusGeometry = new THREE.IcosahedronGeometry(1, 12);
const uranusMaterial = new THREE.MeshPhongMaterial({
  map: loader.load("/textures/2k_uranus.jpg"),
});

const uranusMesh = new THREE.Mesh(uranusGeometry, uranusMaterial);
scene.add(uranusMesh);

const uranusOrbitGeometry = new THREE.EllipseCurve(60, 0, 764, 767.6);
const uranusOrbitMaterial = new THREE.LineBasicMaterial({ color: orbitColor });
const uranusOrbitLine = new THREE.Line(
  new THREE.BufferGeometry().setFromPoints(
    uranusOrbitGeometry.getSpacedPoints(256)
  ),
  uranusOrbitMaterial
);
uranusOrbitLine.rotation.x = (90 * Math.PI) / 180;
uranusOrbitLine.rotation.y = (6.48 * Math.PI) / 180;
uranusOrbitLine.rotation.z = (-152 * Math.PI) / 180;

scene.add(uranusOrbitLine);

// Neptune

const neptuneGeometry = new THREE.IcosahedronGeometry(1, 12);
const neptuneMaterial = new THREE.MeshPhongMaterial({
  map: loader.load("/textures/2k_neptune.jpg"),
});

const neptuneMesh = new THREE.Mesh(neptuneGeometry, neptuneMaterial);
scene.add(neptuneMesh);

const neptuneOrbitGeometry = new THREE.EllipseCurve(-340, 0, 1220, 1200);
const neptuneOrbitMaterial = new THREE.LineBasicMaterial({ color: orbitColor });
const neptuneOrbitLine = new THREE.Line(
  new THREE.BufferGeometry().setFromPoints(
    neptuneOrbitGeometry.getSpacedPoints(256)
  ),
  neptuneOrbitMaterial
);
neptuneOrbitLine.rotation.x = (90 * Math.PI) / 180;
neptuneOrbitLine.rotation.y = (6.43 * Math.PI) / 180;

scene.add(neptuneOrbitLine);

// Space

const spaceGeometry = new THREE.SphereGeometry(1300, 12, 12);
const spaceMaterial = new THREE.MeshBasicMaterial({
  map: loader.load("/textures/2k_stars.jpg"),
  side: THREE.BackSide,
  transparent: true,
  opacity: 0.1,
  // wireframe: true,
  // color: "red",
});

const spaceMesh = new THREE.Mesh(spaceGeometry, spaceMaterial);
scene.add(spaceMesh);

// Saving current targeted by the camera object
let currentObject = earthMesh;
const direction = new THREE.Vector3();

const mercuryVector = new THREE.Vector3();
const venusVector = new THREE.Vector3();
const earthVector = new THREE.Vector3();
const moonVector = new THREE.Vector3();
const marsVector = new THREE.Vector3();
const jupiterVector = new THREE.Vector3();
const saturnVector = new THREE.Vector3();
const uranusVector = new THREE.Vector3();
const neptuneVector = new THREE.Vector3();

const clock = new THREE.Clock();

const orbitPlanet = (planet, orbitGeo, orbitLine, vector, speed, t) => {
  t = (t * speed) % 1;

  orbitGeo.getPointAt(t, vector);
  planet.position.copy(vector);
  planet.position.applyMatrix4(orbitLine.matrixWorld);
};

const toggleOrbits = () => {
  areOrbitsShown.value = !areOrbitsShown.value;

  // Toggle each planet visibility
  mercuryOrbitLine.visible = areOrbitsShown.value;
  venusOrbitLine.visible = areOrbitsShown.value;
  earthOrbitLine.visible = areOrbitsShown.value;
  moonOrbitLine.visible = areOrbitsShown.value;
  marsOrbitLine.visible = areOrbitsShown.value;
  jupiterOrbitLine.visible = areOrbitsShown.value;
  saturnOrbitLine.visible = areOrbitsShown.value;
  uranusOrbitLine.visible = areOrbitsShown.value;
  neptuneOrbitLine.visible = areOrbitsShown.value;
};

// Animation function that updates every frame our scene
function animate() {
  requestAnimationFrame(animate);

  let t = clock.getElapsedTime();

  // Mercury's orbit around sun
  orbitPlanet(
    mercuryMesh,
    mercuryOrbitGeometry,
    mercuryOrbitLine,
    mercuryVector,
    0.001,
    t
  );

  mercuryMesh.rotation.y += 0.001;

  // Venus orbit around sun
  orbitPlanet(
    venusGroup,
    venusOrbitGeometry,
    venusOrbitLine,
    venusVector,
    0.00039,
    t
  );

  venusMesh.rotation.y -= 0.001;
  venusAtmosphere.rotation.y -= 0.002;

  // Earth's orbit around sun
  orbitPlanet(
    earthGroup,
    earthOrbitGeometry,
    earthOrbitLine,
    earthVector,
    0.0016,
    t
  );

  // Earth's rotation and Earth's atmosphere
  earthCloudsMesh.rotation.y += 0.0001;
  earthGroup.rotation.y += 0.0001;

  // Moon's orbit around earth
  orbitPlanet(moonMesh, moonOrbitGeometry, moonOrbitLine, moonVector, 0.019, t);

  moonMesh.rotation.y += 0.0014;

  // Mars orbit around sun
  orbitPlanet(
    marsMesh,
    marsOrbitGeometry,
    marsOrbitLine,
    marsVector,
    0.00016,
    t
  );

  marsMesh.rotation.y += 0.0001;

  // Jupiter orbit around sun
  orbitPlanet(
    jupiterMesh,
    jupiterOrbitGeometry,
    jupiterOrbitLine,
    jupiterVector,
    0.00016,
    t
  );

  jupiterMesh.rotation.y += 0.001;

  // Saturn orbit around sun
  orbitPlanet(
    saturnGroup,
    saturnOrbitGeometry,
    saturnOrbitLine,
    saturnVector,
    0.00016,
    t
  );

  saturnGroup.rotation.y += 0.001;

  // Uranus orbit around sun

  orbitPlanet(
    uranusMesh,
    uranusOrbitGeometry,
    uranusOrbitLine,
    uranusVector,
    0.00001,
    t
  );

  uranusMesh.rotation.y += 0.001;

  // Neptune orbit around sun

  orbitPlanet(
    neptuneMesh,
    neptuneOrbitGeometry,
    neptuneOrbitLine,
    neptuneVector,
    0.0001,
    t
  );

  neptuneMesh.rotation.y += 0.0001;

  // Getting current position of selected object and target camera on it
  currentObject.getWorldPosition(controls.target);

  // Targeting camera to object
  direction.subVectors(camera.position, controls.target);
  camera.position.copy(direction.add(controls.target));

  controls.update();
  renderer.render(scene, camera);
}

animate();

// Focuses camera on selected object
const focusObject = (object, min, max) => {
  currentObject = object;
  controls.minDistance = min;
  controls.maxDistance = max;
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
  <div
    class="flex flex-wrap w-screen justify-center absolute text-xl bottom-2 gap-4 px-2"
  >
    <my-planet @click="focusObject(sunMesh, 10, 360)" text="Sun" />
    <my-planet @click="focusObject(mercuryMesh, 0.5, 10)" text="Mercury" />
    <my-planet @click="focusObject(venusGroup, 2, 15)" text="Venus" />
    <my-planet @click="focusObject(earthMesh, 2, 15)" text="Earth" />
    <my-planet @click="focusObject(moonMesh, 0.5, 5)" text="Moon" />
    <my-planet @click="focusObject(marsMesh, 1, 15)" text="Mars" />
    <my-planet @click="focusObject(jupiterMesh, 5, 25)" text="Jupiter" />
    <my-planet @click="focusObject(saturnGroup, 5, 35)" text="Saturn" />
    <my-planet @click="focusObject(uranusMesh, 5, 35)" text="Uranus" />
    <my-planet @click="focusObject(neptuneMesh, 5, 35)" text="Neptune" />
  </div>
  <my-side-bar :orbits="toggleOrbits" />
  <router-link
    to="/"
    @click="reset()"
    class="hover:underline h-max absolute top-2 right-2 text-3xl"
    >Back</router-link
  >
</template>
