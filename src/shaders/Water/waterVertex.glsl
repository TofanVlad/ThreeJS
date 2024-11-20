uniform float uTime;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main(){
    
    vec3 newPosition = position;
    vec3 worldPosition = ( modelMatrix * vec4( position, 1.0) ).xyz;

    if(newPosition.y > 0.5){
        newPosition.y += 0.4 * sin(newPosition.x + (uTime * 1.0));
    }
    else{
        newPosition.y -= 0.4;
    }

    vUv = uv;
    vNormal = normal;
    vPosition = newPosition;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}