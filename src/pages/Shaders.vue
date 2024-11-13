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

  camera.position.set(-1, 4, 8);
  scene.add(camera);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.listenToKeyEvents(window);

  const directionLight = new THREE.DirectionalLight(0xffffff, 3);
  directionLight.position.set(2, 10, 2);
  scene.add(directionLight);

  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);

  const loader = new GLTFLoader();
  let mixer: THREE.AnimationMixer | null = null;

  const sceneGroup = new THREE.Group();

  loader.load("/Shaders/Potcoava2.glb", function (obj) {
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

  loader.load("/Shaders/ToonHorse/PotcoavaHorse.glb", function (obj) {
    obj.scene.traverse((mesh) => {
      if (mesh.type === "SkinnedMesh") {
        mesh.material.metalness = 0;
      }
    });

    obj.scene.scale.setScalar(1.9);
    obj.scene.position.y = 0.25;
    obj.scene.rotation.y = (Math.PI * -45) / 180;

    mixer = new THREE.AnimationMixer(obj.scene);
    const clips = obj.animations;
    const clip = THREE.AnimationClip.findByName(clips, "Walk");
    const action = mixer.clipAction(clip);
    action.play();

    sceneGroup.add(obj.scene);
  });

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

  const clock = new THREE.Clock();

  const animate = () => {
    controls.update();

    if (mixer) {
      mixer.update(clock.getDelta());
    }
    sceneGroup.rotation.y += 0.001;

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
