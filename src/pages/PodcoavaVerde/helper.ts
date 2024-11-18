import * as THREE from 'three'
import vertex from '../../shaders/Foliage/vertex.glsl'
import fragment from '../../shaders/Foliage/fragment.glsl'

export function getGhilbiMaterial(
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
                    lightPosition,
            },
            uRepeatPattern: {
                value: repeatPattern,
            },
        },
    });
}