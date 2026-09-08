/** Shared GLSL for the Ask cognitive-nebula portal (Broadridge navy / cyan / teal). */

export const nebulaVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const nebulaFragment = /* glsl */ `
precision highp float;

uniform float uTime;
uniform float uHover;
uniform float uOpen;
uniform float uAnswering;
uniform vec2 uPointer;
uniform vec3 uNavy;
uniform vec3 uCyan;
uniform vec3 uTeal;
uniform vec3 uGold;

varying vec2 vUv;

// Compact simplex-style hash noise
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v) {
  const vec4 C = vec4(
    0.211324865405187,
    0.366025403784439,
    -0.577350269189626,
    0.024390243902439
  );
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++) {
    v += a * snoise(p);
    p = m * p;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = vUv * 2.0 - 1.0;
  float r = length(uv);
  if (r > 1.0) discard;

  // Pointer bias pulls the bright field toward the cursor on hover
  vec2 bias = (uPointer - 0.5) * uHover * 0.35;
  vec2 p1 = uv * 1.4 + bias + vec2(uTime * 0.03, uTime * -0.02);
  vec2 p2 = uv * 2.2 - bias * 0.6 + vec2(uTime * -0.05, uTime * 0.04);
  vec2 p3 = uv * 3.4 + vec2(uTime * 0.02, uTime * 0.06);

  float n1 = fbm(p1);
  float n2 = fbm(p2);
  float n3 = fbm(p3);

  float depth = smoothstep(1.0, 0.15, r);
  float voidDark = smoothstep(0.55, 0.05, r + n1 * 0.08) * (0.55 + uHover * 0.2);

  vec3 col = uNavy * (0.35 + voidDark);
  col = mix(col, uCyan * 0.55, clamp(n2 * 0.45 + 0.2, 0.0, 1.0) * depth);
  col = mix(col, uTeal * 0.7, clamp(n3 * 0.35, 0.0, 0.85) * depth * (0.55 + uHover * 0.35));

  // Soft lightning veins
  float veins = abs(n1 - n2);
  veins = smoothstep(0.12, 0.02, veins) * depth;
  col += uCyan * veins * (0.25 + uHover * 0.35);
  col += uGold * veins * uAnswering * 0.4;

  // Core turbulence
  float core = exp(-r * r * (4.5 - uHover * 1.2 - uOpen * 0.8));
  col += mix(uTeal, uCyan, 0.5) * core * (0.55 + uHover * 0.35 + uAnswering * 0.25);

  // Event-horizon rim
  float rim = smoothstep(0.92, 0.78, r) * smoothstep(0.72, 0.88, r);
  float breathe = 0.85 + 0.15 * sin(uTime * 1.4 + n2 * 4.0);
  col += mix(uCyan, uTeal, 0.4) * rim * breathe * (0.7 + uHover * 0.5);

  float alpha = smoothstep(1.0, 0.82, r) * (0.92 + uHover * 0.06);
  gl_FragColor = vec4(col, alpha);
}
`;
