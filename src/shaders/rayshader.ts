export const vertex = `
    varying vec2 vUv;

void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1);

    vUv = uv;
}
`

export const fragment = `
    varying vec2 vUv;

struct ColorStop{
    vec3 color;
    float position;
};

#define ColorRamp(colors, factor, finalColor) { \
    int index = 0; \
    for(int i = 0; i < colors.length() - 1; i++){ \
       ColorStop currentColor = colors[i]; \
       bool isInBetween = currentColor.position <= factor; \
       index = int(mix(float(index), float(i), float(isInBetween))); \
    } \
    ColorStop currentColor = colors[index]; \
    ColorStop nextColor = colors[index + 1]; \
    float range = nextColor.position - currentColor.position; \
    float lerpFactor = (factor - currentColor.position) / range; \
    finalColor = mix(currentColor.color, nextColor.color, lerpFactor); \
}; \

void main() {
    ColorStop[7] colors = ColorStop[](
        ColorStop(vec3(1,0.34,0.2), 0.0),
        ColorStop(vec3(0.29,0,0.51), 0.166),
        ColorStop(vec3(0,0,1), 0.333),
        ColorStop(vec3(0,1,0), 0.5),
        ColorStop(vec3(1,1,0), 0.666),
        ColorStop(vec3(1,0.64,0), 0.833),
        ColorStop(vec3(1,0,0), 1.0)
    );

    vec3 finalColor;
    ColorRamp(colors, vUv.x, finalColor);
    gl_FragColor = vec4(finalColor, 1);
}
`