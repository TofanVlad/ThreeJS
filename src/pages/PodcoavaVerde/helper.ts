import * as THREE from "three";
import foliageVertex from "../../shaders/Foliage/foliageVertex.glsl";
import folaigeFragment from "../../shaders/Foliage/folaigeFragment.glsl";

import waterFragment from "../../shaders/Water/waterFragment.glsl";
import waterVertex from "../../shaders/Water/waterVertex.glsl";

export function getGhilbiMaterial(
    colorGradient: THREE.Color[],
    brightnessThreshold: number[],
    lightPosition?: THREE.Vector3,
    repeatPattern: boolean = false
) {
    return new THREE.ShaderMaterial({
        vertexShader: foliageVertex,
        fragmentShader: folaigeFragment,
        side: THREE.DoubleSide,
        uniforms: {
            uColorGradient: {
                value: colorGradient,
            },
            uBrightnessThresholds: {
                value: brightnessThreshold,
            },
            uLightPosition: {
                value: lightPosition,
            },
            uRepeatPattern: {
                value: repeatPattern,
            },
        },
    });
}

export function getGradientMaterial(
    colorGradient: THREE.Color[],
    brightnessThreshold: number[],
    lightPosition?: THREE.Vector3
) {
    return new THREE.ShaderMaterial({
        vertexShader: waterVertex,
        fragmentShader: waterFragment,
        uniforms: {
            uColorGradient: {
                value: colorGradient,
            },
            uBrightnessThresholds: {
                value: brightnessThreshold,
            },
            uLightPosition: {
                value: lightPosition,
            },
            uTime: {
                value: 1.0
            }
        },
    });
}

export function getFlowers(numberOfFlowers: number) {
    const flowerGroup = new THREE.Group();
    const flowerColors = ["#e15b64", "#ffdddd", "#add8e6"];
    const flowerGeometry = new THREE.TetrahedronGeometry(0.035);

    for (let i = 0; i < numberOfFlowers; i++) {

        const positionX = (Math.random() - 0.5) * 8;
        const positionY = (Math.random() - 0.5) * 8;

        const flowerRotation = Math.random() * 90;
        const flowerColor = Math.floor(Math.random() * 3);

        const flowerMaterial = new THREE.MeshBasicMaterial({ color: flowerColors[flowerColor] });

        const flower = new THREE.Mesh(flowerGeometry, flowerMaterial);

        flower.rotation.x = flowerRotation;
        flower.position.set(
            (Math.cos(positionX) + Math.sin(positionY)) * 2.25,
            0.48,
            (Math.sin(positionX) + Math.cos(positionY)) * 2.25
        );
        flowerGroup.add(flower);
    }

    return flowerGroup;
}
