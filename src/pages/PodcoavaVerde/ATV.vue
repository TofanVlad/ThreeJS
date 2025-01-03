<script setup lang="ts">
import * as THREE from "three";
import { onMounted, ref } from 'vue';
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { getGhilbiMaterial, getFlowers } from "./helper";
import TWEEN from "three/examples/jsm/libs/tween.module";



const canvas = ref<null | HTMLCanvasElement>(null)

function initATV(canvas: HTMLCanvasElement) {

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

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    const sunLight = new THREE.DirectionalLight(0xffffff, 2)
    sunLight.position.set(2, 18, 2);
    scene.add(ambientLight, sunLight)

    const loader = new GLTFLoader();
    let mixer: THREE.AnimationMixer | null = null;


    // GRASS MODEL

    loader.load("/PodcoavaVerde/GhilbiATVGrass.glb", function (obj) {
        obj.scene.traverse((mesh) => {
            if (mesh.name === 'GrassFoliage' || mesh.name === 'BumpFoliage') {
                (mesh as THREE.Mesh).material = getGhilbiMaterial(
                    [
                        new THREE.Color("#268b07").convertLinearToSRGB(),
                        new THREE.Color("#138510").convertLinearToSRGB(),
                        new THREE.Color("#117c13").convertLinearToSRGB(),
                        new THREE.Color("#136d15").convertLinearToSRGB(),
                    ],
                    [0.8, 0.55, 0.3],
                    sunLight.position
                );
            }
            if (mesh.name === 'BumpGrass') {
                (mesh as THREE.Mesh).material = getGhilbiMaterial(
                    [
                        new THREE.Color("#268b07").convertLinearToSRGB(),
                        new THREE.Color("#138510").convertLinearToSRGB(),
                        new THREE.Color("#117c13").convertLinearToSRGB(),
                        new THREE.Color("#136d15").convertLinearToSRGB(),
                    ],
                    [0.8, 0.55, 0.3],
                    sunLight.position
                );
            }
            if (mesh.name === "Grass") {
                (mesh as THREE.Mesh).material = new THREE.MeshBasicMaterial({
                    color: "#136d15",
                });
            }
        })
        scene.add(obj.scene)
    });

    // ATV MODEL

    loader.load("/PodcoavaVerde/ATV.glb", function (obj) {
        const mesh = obj.scene

        mesh.scale.setScalar(0.6)
        mesh.rotation.y = (Math.PI * 90) / 180
        mesh.rotation.x = (Math.PI * -7.5) / 180

        mesh.position.set(0, 1, -1.5)

        mixer = new THREE.AnimationMixer(mesh)
        const clips = obj.animations

        clips.forEach((animation) => {
            const clip = THREE.AnimationClip.findByName(clips, animation.name)
            const action = mixer?.clipAction(clip)

            action?.play()
        })

        const initialTween = new TWEEN.Tween(mesh.position).to({ x: 0, y: 1.25, z: 0.5 }, 8000).easing(TWEEN.Easing.Quadratic.InOut)
        const returnTween = new TWEEN.Tween(mesh.position).to({ x: 0, y: 1, z: -1.5 }, 8000).easing(TWEEN.Easing.Quadratic.InOut)
        const initRotationTween = new TWEEN.Tween(mesh.rotation).to({ x: (Math.PI * -0.5) / 180, y: (Math.PI * 90) / 180, z: 0 }, 8000).easing(TWEEN.Easing.Quadratic.InOut)
        const returnRotationTween = new TWEEN.Tween(mesh.rotation).to({ x: (Math.PI * -7.5) / 180, y: (Math.PI * 90) / 180, z: 0 }, 8000).easing(TWEEN.Easing.Quadratic.InOut)
        initialTween.chain(returnTween)
        returnTween.chain(initialTween)

        initRotationTween.chain(returnRotationTween)
        returnRotationTween.chain(initRotationTween)

        initialTween.start()
        initRotationTween.start()

        scene.add(mesh)
    })

    // BUSH

    loader.load("/PodcoavaVerde/Bush.glb", function (obj) {
        obj.scene.traverse((mesh) => {
            (mesh as THREE.Mesh).material = getGhilbiMaterial(
                [
                    new THREE.Color("#268b07").convertLinearToSRGB(),
                    new THREE.Color("#138510").convertLinearToSRGB(),
                    new THREE.Color("#117c13").convertLinearToSRGB(),
                    new THREE.Color("#136d15").convertLinearToSRGB(),
                ],
                [0.95, 0.55, 0.3],
                sunLight.position
            );
        });
        obj.scene.position.set(-2.5, 0.25, 2);
        obj.scene.scale.setScalar(0.4);
        scene.add(obj.scene);
    });

    // FLOWERS

    scene.add(getFlowers(50));

    // ROCK

    const rockGeometry = new THREE.TetrahedronGeometry(0.95, 1);
    const rockMaterial = new THREE.MeshToonMaterial({ color: "#474747" });

    const rock = new THREE.Mesh(rockGeometry, rockMaterial)
    rock.position.set(3, 0.25, 1.25)
    scene.add(rock)


    const clock = new THREE.Clock();
    const animate = () => {
        TWEEN.update();
        controls.update();

        if (mixer) {
            mixer.update(clock.getDelta() * 0.5);
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
        initATV(canvas.value);
    }
});
</script>

<template>
    <h1 class="absolute text-3xl top-2 left-2">ATV</h1>
    <router-link to="/" class="absolute text-3xl hover:underline h-max top-2 right-2">Back</router-link>
    <canvas ref="canvas" class="w-screen h-screen"></canvas>
</template>