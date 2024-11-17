precision highp float;
precision highp int;

varying vec3 vNormal;
varying vec3 vPosition;

void main(){

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    vNormal = normal;
    vPosition = position;

    gl_Position = projectionMatrix * viewMatrix * modelPosition;
}