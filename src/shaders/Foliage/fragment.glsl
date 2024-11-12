uniform vec3 uColorGradient[4];
uniform float uBrightnessThresholds[3];
uniform vec3 uLightPosition;

uniform mat4 modelMatrix;

varying vec3 vNormal;
varying vec3 vPosition;

void main(){

    vec3 worldPosition = ( modelMatrix * vec4( vPosition, 1.0) ).xyz;
    vec3 worldNormal = normalize( vec3(modelMatrix * vec4(vNormal, 0.0)));
    vec3 lightVector = normalize( uLightPosition - worldPosition);
    float brightness = dot(worldNormal, lightVector);

    vec4 final;

    if(brightness > uBrightnessThresholds[0]){
        final = vec4(uColorGradient[0], 1.0);
    }
    else if(brightness > uBrightnessThresholds[1]){
        final = vec4(uColorGradient[1], 1.0);
    }
    else if(brightness > uBrightnessThresholds[2]){
        final = vec4(uColorGradient[2], 1.0);
    }
    else final = vec4(uColorGradient[3], 1.0);

    gl_FragColor = vec4(final);
}