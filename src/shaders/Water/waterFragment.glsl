uniform vec3 uColorGradient[5];
uniform float uBrightnessThresholds[3];
uniform vec3 uLightPosition;
uniform float uTime;

uniform mat4 modelMatrix;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;

void main(){

    vec3 worldPosition = ( modelMatrix * vec4( vPosition, 1.0) ).xyz;

    vec4 final;

    if(((sin(worldPosition.y) + cos(worldPosition.x + uTime)) / cos(vPosition.y) > 1.0)){
        final = vec4(uColorGradient[0], 0.85);
    }
    else if((sin(worldPosition.y) + cos(worldPosition.x + uTime)) / cos(vPosition.y) > 0.5){
        final = vec4(uColorGradient[1], 0.85);
    }
    else if((sin(worldPosition.y) + cos(worldPosition.x + uTime)) / cos(vPosition.y) > 0.0){
        final = vec4(uColorGradient[2], 0.85);
    }
    else if((sin(worldPosition.y) + cos(worldPosition.x + uTime)) / cos(vPosition.y) > -0.5){
        final = vec4(uColorGradient[3], 0.85);
    }

    else{
        final = vec4(uColorGradient[4], 0.85);
    }
    

    gl_FragColor = vec4(final);
}