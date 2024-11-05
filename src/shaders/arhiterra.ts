export const vertex = `
varying vec2 v_uv;
varying float v_depth;

void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1);
    v_uv = uv;
    v_depth = 100.0;
}
`

export const fragment = /*glsl*/`
precision mediump float;

uniform vec2 u_resolution;
uniform float u_tick;

varying vec2 v_uv;
varying float v_depth;

float borders(vec2 uv, float strokeWidth) {
  vec2 borderBottomLeft = smoothstep(vec2(0.0), vec2(strokeWidth), uv);

  vec2 borderTopRight = smoothstep(vec2(0.0), vec2(strokeWidth), 1.0 - uv);

  return 1.0 - borderBottomLeft.x * borderBottomLeft.y * borderTopRight.x * borderTopRight.y;
}



//  vec4 a = vec4(0.15, 0.58, 0.96, 1.0);
//   vec4 b = vec4(0.29, 1.00, 0.55, 1.0);
//   vec4 c = vec4(1.00, 0.0, 0.85, 1.0);
//   vec4 d = vec4(0.92, 0.20, 0.14, 1.0);
//   vec4 e = vec4(1.00, 0.96, 0.32, 1.0);

#define PI2 6.28318530718

vec4 radialRainbow(vec2 st, float tick) {
  vec2 toCenter = vec2(0.5) - st;
  float angle = mod((atan(toCenter.y, toCenter.x) / PI2) + 0.5 + sin(tick), 1.0);

  // colors
  vec4 a = vec4(0.455,0.455,0.455, 1.0);
  vec4 b = vec4(0.294,0.294,0.294 , 1.0);
  vec4 c = vec4(0.243,0.243,0.2432, 1.0);
  vec4 d = vec4(0.192,0.192,0.192, 1.0);
  vec4 e = vec4(0.141,0.141,0.141, 1.0);
  float step = 1.0 / 10.0;

  vec4 color = a;

  color = mix(color, d, smoothstep(step * 1.0, step * 2.0, angle));
  color = mix(color, a, smoothstep(step * 2.0, step * 3.0, angle));
  color = mix(color, b, smoothstep(step * 3.0, step * 4.0, angle));
  color = mix(color, c, smoothstep(step * 4.0, step * 5.0, angle));
  color = mix(color, d, smoothstep(step * 5.0, step * 6.0, angle));
  color = mix(color, e, smoothstep(step * 6.0, step * 7.0, angle));
  color = mix(color, d, smoothstep(step * 7.0, step * 8.0, angle));
  color = mix(color, e, smoothstep(step * 8.0, step * 9.0, angle));
  color = mix(color, a, smoothstep(step * 9.0, step * 10.0, angle));

  return color;
}

void main() {
  // screen coordinates
  vec2 st = gl_FragCoord.xy / u_resolution;

  vec4 bordersColor = radialRainbow(st, u_tick);

  // opacity factor based on the z value
  float depth = clamp(smoothstep(-1.0, 1.0, v_depth), 0.6, 0.9);

  bordersColor *= vec4(borders(v_uv, 0.011)) * depth;

  gl_FragColor = bordersColor;
}
`