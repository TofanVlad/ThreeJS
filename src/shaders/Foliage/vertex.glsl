precision highp float;
precision highp int;

uniform float uTime;

varying vec3 vNormal;
varying vec3 vPosition;

void main(){

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    modelPosition.z += sin(modelPosition.x * 10.0) * 0.1;
    modelPosition.z += sin(modelPosition.y * 10.0) * 0.1;

    modelPosition.z += uTime;

    vNormal = normal;
    vPosition = position;

    gl_Position = projectionMatrix * viewMatrix * modelPosition;
}