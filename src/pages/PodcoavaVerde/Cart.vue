<script setup lang="ts">
import { ref, Ref, onMounted } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import vertex from "../../shaders/Foliage/vertex.glsl";
import fragment from "../../shaders/Foliage/fragment.glsl";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

const canvas: Ref<HTMLCanvasElement | null> = ref(null);

function initCart(canvas: HTMLCanvasElement) {
  //
  //  INIT PROJECT
  //

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight
  );

  camera.position.set(-1, 4, 8);
  scene.add(camera);
  scene.position.y = -1;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.listenToKeyEvents(window);

  controls.maxPolarAngle = (Math.PI * 75) / 180;

  //
  // LIGHTS
  //

  const directionLight = new THREE.DirectionalLight(0xffffff, 3);
  directionLight.castShadow = true;
  directionLight.shadow.mapSize.width = 4096;
  directionLight.shadow.mapSize.height = 4096;

  directionLight.position.set(2, 18, 2);
  scene.add(directionLight);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
  scene.add(ambientLight);

  //
  // SCENE GROUP
  //

  const sceneGroup = new THREE.Group();
  const grassGroup = new THREE.Group();
  const loader = new GLTFLoader();

  // Foliage material generator

  function getGhilbiMaterial(
    colorGradient: THREE.Color[],
    brightnessThreshold: number[],
    lightPosition?: THREE.Vector3,
    repeatPattern: boolean = false
  ) {
    return new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      side: THREE.DoubleSide,
      uniforms: {
        uColorGradient: {
          value: colorGradient,
        },
        uBrightnessThresholds: {
          value: brightnessThreshold,
        },
        uLightPosition: {
          value:
            lightPosition ?? new THREE.Vector3().copy(directionLight.position),
        },
        uRepeatPattern: {
          value: repeatPattern,
        },
      },
    });
  }

  //
  // GRASS MODEL
  //

  loader.load("/PodcoavaVerde/Grass.glb", function (obj) {
    obj.scene.traverse((mesh) => {
      if (mesh.name === "Foliage") {
        (mesh as THREE.Mesh).material = getGhilbiMaterial(
          [
            new THREE.Color("#268b07").convertLinearToSRGB(),
            new THREE.Color("#138510").convertLinearToSRGB(),
            new THREE.Color("#117c13").convertLinearToSRGB(),
            new THREE.Color("#136d15").convertLinearToSRGB(),
          ],
          [0.8, 0.55, 0.3]
        );
        mesh.receiveShadow = true;
      }
      if (mesh.name === "Grass") {
        (mesh as THREE.Mesh).material = new THREE.MeshBasicMaterial({
          color: "#136d15",
        });
      }
    });
    grassGroup.add(obj.scene);
  });

  //
  //  CART MODEL
  //

  loader.load("/PodcoavaVerde/Cart.glb", function (obj) {
    obj.scene.traverse((mesh) => {
      if (mesh.type === "Mesh") {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        (mesh as THREE.Mesh).material.side = THREE.FrontSide;
        (mesh as THREE.Mesh).material.roughness = 1;
      }
    });
    obj.scene.position.set(0, 1.35, 0);
    obj.scene.rotation.y = (Math.PI * -45) / 180;
    sceneGroup.add(obj.scene);
  });

  //
  // TREE STUMP MODEL
  //

  loader.load("/PodcoavaVerde/TreeStump.glb", function (obj) {
    obj.scene.scale.setScalar(1.35);
    obj.scene.position.set(1, 0.45, -4);
    obj.scene.castShadow = true;
    obj.scene.receiveShadow = true;
    sceneGroup.add(obj.scene);
  });

  //
  // BUSH MODEL
  //

  const bushGroup = new THREE.Group();
  loader.load("/PodcoavaVerde/Bush.glb", function (obj) {
    obj.scene.traverse((mesh) => {
      (mesh as THREE.Mesh).material = getGhilbiMaterial(
        [
          new THREE.Color("#268b07").convertLinearToSRGB(),
          new THREE.Color("#138510").convertLinearToSRGB(),
          new THREE.Color("#117c13").convertLinearToSRGB(),
          new THREE.Color("#136d15").convertLinearToSRGB(),
        ],
        [0.95, 0.55, 0.3]
      );
    });
    obj.scene.position.set(3.5, 0.25, -0.5);
    obj.scene.scale.setScalar(0.4);
    bushGroup.add(obj.scene);
  });

  //
  // TREE
  //

  const treeGroup = new THREE.Group();

  loader.load("/PodcoavaVerde/Tree.glb", function (obj) {
    obj.scene.name = "Tree";
    obj.scene.traverse((mesh) => {
      if (mesh.name.includes("Leaves")) {
        (mesh as THREE.Mesh).material = getGhilbiMaterial(
          [
            new THREE.Color("#268b07").convertLinearToSRGB(),
            new THREE.Color("#138510").convertLinearToSRGB(),
            new THREE.Color("#117c13").convertLinearToSRGB(),
            new THREE.Color("#136d15").convertLinearToSRGB(),
          ],
          [0.9, 0.7, 0.5, 0.3, 0.1, 0.01],
          new THREE.Vector3(-3, 9.5, -0.5),
          true
        );
      }
      if (mesh.type === "Mesh") {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        (mesh as THREE.Mesh).material.side = THREE.FrontSide;
      }
    });

    obj.scene.position.set(-3.5, 0, 0.5);

    treeGroup.add(obj.scene);
  });

  //
  // FLOWERS
  //

  const numberOfFlowers = 50;

  const flowerGroup = new THREE.Group();
  const flowerColors = ["#e15b64", "#ffdddd", "#add8e6"];

  const flowerGeometry = new THREE.TetrahedronGeometry(0.035);

  for (let i = 0; i < numberOfFlowers; i++) {
    const flowerMaterial = new THREE.MeshBasicMaterial();

    const positionX = (Math.random() - 0.5) * 8;
    const positionY = (Math.random() - 0.5) * 8;

    const flowerRotation = Math.random() * 90;
    const flowerColor = Math.floor(Math.random() * 3);

    const flower = new THREE.Mesh(flowerGeometry, flowerMaterial);

    flower.material.color = new THREE.Color(flowerColors[flowerColor]);

    flower.rotation.x = flowerRotation;
    flower.position.set(
      (Math.cos(positionX) + Math.sin(positionY)) * 2.25,
      0.48,
      (Math.sin(positionX) + Math.cos(positionY)) * 2.25
    );
    flowerGroup.add(flower);
  }

  //
  // ROCK
  //

  const rockGeometry = new THREE.TetrahedronGeometry(0.95, 1);
  const rockMaterial = new THREE.MeshToonMaterial({ color: "#474747" });

  const rock = new THREE.Mesh(rockGeometry, rockMaterial);
  rock.position.set(-1.5, 0.25, 3);
  sceneGroup.add(rock);

  scene.add(sceneGroup, grassGroup, flowerGroup, treeGroup, bushGroup);

  const clock = new THREE.Clock();

  const animate = () => {
    controls.update();

    grassGroup.rotation.y = Math.sin(clock.getElapsedTime()) * 0.025;
    treeGroup.rotation.x = Math.cos(clock.getElapsedTime()) * 0.015;
    bushGroup.rotation.x = Math.cos(clock.getElapsedTime()) * 0.025;

    directionLight.position.x = Math.cos(clock.getElapsedTime()) * 0.5;
    directionLight.position.z = Math.sin(clock.getElapsedTime()) * 0.5;

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
    initCart(canvas.value);
  }
});
</script>

<template>
  <!-- <h1 class="absolute text-3xl top-2 left-2">Cart</h1>
  <router-link
    to="/"
    class="absolute text-3xl hover:underline h-max top-2 right-2"
    >Back</router-link
  > -->
  <canvas ref="canvas" class="w-screen h-screen"></canvas>
</template>
