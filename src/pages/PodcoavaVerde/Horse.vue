<script setup lang="ts">
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { onMounted, ref, Ref } from "vue";
import vertex from "../../shaders/Foliage/vertex.glsl";
import fragment from "../../shaders/Foliage/fragment.glsl";
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

  //   controls.minPolarAngle = (Math.PI * 40) / 180;
  controls.maxPolarAngle = (Math.PI * 75) / 180;

  //
  // LIGHTS
  //

  const directionLight = new THREE.DirectionalLight(0xffffff, 3);
  directionLight.position.set(2, 10, 2);
  scene.add(directionLight);

  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);

  //
  // SCENE GROUP
  //

  const sceneGroup = new THREE.Group();

  //
  // MODEL + ANIMATION LOADER
  //

  const loader = new GLTFLoader();
  let mixer: THREE.AnimationMixer | null = null;

  //
  // GRASS MODEL
  //

  loader.load("/PodcoavaVerde/Grass.glb", function (obj) {
    obj.scene.traverse((mesh) => {
      if (mesh.name === "Foliage") {
        mesh.material = new THREE.ShaderMaterial({
          vertexShader: vertex,
          fragmentShader: fragment,
          side: THREE.DoubleSide,
          uniforms: {
            uColorGradient: {
              value: [
                new THREE.Color("#41980a").convertLinearToSRGB(),
                new THREE.Color("#268b07").convertLinearToSRGB(),
                new THREE.Color("#117c13").convertLinearToSRGB(),
                new THREE.Color("#136d15").convertLinearToSRGB(),
              ],
            },
            uBrightnessThresholds: {
              value: [0.8, 0.3, 0],
            },
            uLightPosition: {
              value: new THREE.Vector3().copy(directionLight.position),
            },
          },
        });
      }
      if (mesh.name === "Grass") {
        mesh.material = new THREE.MeshBasicMaterial({
          color: "#136d15",
        });
      }

      if (mesh.name === "Dirt") {
        mesh.material = new THREE.MeshBasicMaterial({ color: "#5c463e" });
      }
    });
    sceneGroup.add(obj.scene);
  });

  //
  // HORSE MODEL
  //

  loader.load("/PodcoavaVerde/Horse.glb", function (obj) {
    obj.scene.traverse((mesh) => {
      if (mesh.name === "Western_horse") {
        mesh.material.metalness = 0.1;
        mesh.material.roughness = 1;
      }
    });

    obj.scene.scale.setScalar(1.85);
    obj.scene.position.y = 0.4;
    obj.scene.rotation.y = (Math.PI * -45) / 180;

    mixer = new THREE.AnimationMixer(obj.scene);
    const clips = obj.animations;

    const clip = THREE.AnimationClip.findByName(
      clips,
      "Root_M|WesternHorse_Idle|Animation Base Layer"
    );
    const action = mixer.clipAction(clip);
    action.play();

    sceneGroup.add(obj.scene);
  });

  //
  // ROCK MESHES
  //

  const rockGeometry = new THREE.TetrahedronGeometry(0.95, 1);
  const rockMaterial = new THREE.MeshToonMaterial({ color: "#7f8387" });

  const clusterRock1 = new THREE.Mesh(rockGeometry, rockMaterial);
  const clusterRock2 = new THREE.Mesh(rockGeometry, rockMaterial);
  const frontRock = new THREE.Mesh(rockGeometry, rockMaterial);
  frontRock.position.set(-0.5, 0.5, -3);
  clusterRock1.position.set(2.5, 0, 2.5);
  clusterRock2.position.set(2.6, 0.25, 2.7);
  clusterRock2.rotation.y = (Math.PI * 65) / 180;
  sceneGroup.add(clusterRock1, clusterRock2, frontRock);

  scene.add(sceneGroup);

  //
  // ANIMATION
  //

  const clock = new THREE.Clock();
  const animate = () => {
    controls.update();

    if (mixer) {
      mixer.update(clock.getDelta() * 0.75);
    }

    sceneGroup.rotation.y += 0.001;

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
  <h1 class="absolute text-3xl top-2 left-2">Horse</h1>
  <router-link
    to="/"
    class="absolute text-3xl hover:underline h-max top-2 right-2"
    >Back</router-link
  >
  <canvas ref="canvas" class="w-screen h-screen"></canvas>
</template>
