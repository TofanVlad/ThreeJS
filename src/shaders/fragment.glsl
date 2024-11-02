varying vec2 vUv;

struct ColorStop{
    vec3 color;
    float position;
}

#define COLOR_RAMP(colors, factor, finalColor) { 
    int index = 0; 
    for(int i = 0; i < colors.length() - 1; i++){ 
       ColorStop currentColor = colors[i]; 
       bool isInBetween = currentColor.position <= factor; 
       index = int(mix(float(index), float(i), float(isInBetween))); 
    } 
    ColorStop currentColor = colors[index]; 
    ColorStop nextColor = colors[index + 1]; 
    float range = nextColor.position - currentColor.position; 
    float lerpFactor = (factor - currentColor.position) / range; 
    finalColor = mix(currentColor.color, nextColor.color, lerpFactor); 
} 

void main() {
    ColorStop[3] colors = ColorStop[](
        ColorStop(vec3(0), 0.0),
        ColorStop(vec3(0,1,0), 0.5),
        ColorStop(vec3(1), 1.0),
    );

    vec3 finalColor = ColorRamp(colors, vUv.x);
    gl_FragColor = vec4(finalColor, 1);
}