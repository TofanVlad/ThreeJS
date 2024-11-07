export const vertex = `
void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1);
}
`
export const fragment = `

uniform vec2 u_resolution;
uniform float u_tick;

#define PI2 6.28318530718

vec4 radialRainbow(vec2 st, float tick) {
  vec2 toCenter = vec2(0.5) - st;
  float angle = mod((atan(toCenter.y, toCenter.x) / PI2) + 0.5 + sin(tick), 1.0);

  // colors
  vec4 b = vec4(0, 0, 0, 1.0);
  vec4 w = vec4(1,1,1,1.0);

  float step = 1.0 / 9.0;

  vec4 color = w;

  color = mix(color, b, smoothstep(step * 1.0, step * 2.0, angle));
  color = mix(color, w, smoothstep(step * 2.0, step * 3.0, angle));
  color = mix(color, b, smoothstep(step * 3.0, step * 4.0, angle));
  color = mix(color, w, smoothstep(step * 4.0, step * 5.0, angle));
  color = mix(color, b, smoothstep(step * 5.0, step * 6.0, angle));
  color = mix(color, b, smoothstep(step * 6.0, step * 7.0, angle));
  color = mix(color, b, smoothstep(step * 7.0, step * 8.0, angle));
  color = mix(color, w, smoothstep(step * 8.0, step * 9.0, angle));


  return color;
}

void main(){
    vec2 st = gl_FragCoord.xy / u_resolution;
    gl_FragColor = radialRainbow(st, u_tick);
}
`