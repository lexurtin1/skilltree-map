"use client";

/**
 * Ghost Fibers — React Bits, ported to TypeScript.
 *
 * Source: https://github.com/DavidHDev/react-bits (src/content/Backgrounds/GhostFibers).
 * License: ./REACT-BITS-LICENSE.md. What is added is what a production shell needs and a
 * showcase component does not:
 *
 *   · a capability gate, so a machine without WebGL2 gets a painted fallback
 *     rather than an empty box
 *   · a reduced-motion gate, checked once at mount in a lazy initialiser so the
 *     canvas is never created rather than created and then hidden
 *   · types, `ogl` imported on demand, and the project's own CSS class
 *
 * It replaces the Grainient field on the gallery. A gradient — however warped —
 * is a wash, and a wash behind nine sheets of glass reads as fog. Fibers are
 * *drawn*: long filaments of Broadridge navy on a near-white ground. Glass needs
 * something with edges behind it or it has nothing to refract.
 *
 * The gallery sets both fiber and glow colours to Broadridge navy.
 */
import { useEffect, useRef, useState } from "react";

export interface GhostFibersProps {
  /** The filaments themselves. Broadridge navy, on this product. */
  lineColor?: string;
  /** The air between them. Tinted to the module at the front of the ring. */
  glowColor?: string;
  speed?: number;
  scale?: number;
  rotation?: number;
  rotationSpeed?: number;
  layers?: number;
  waveAmplitude?: number;
  waveFrequency?: number;
  waveSpeed?: number;
  layerSpeed?: number;
  twist?: number;
  twistFrequency?: number;
  twistSpeed?: number;
  lineFrequency?: number;
  lineSpacing?: number;
  lineSharpness?: number;
  glowFalloff?: number;
  glowIntensity?: number;
  brightness?: number;
  blueBoost?: number;
  vignette?: number;
  grain?: number;
  /** Inverts the field onto a white ground. The reason this works on a light page. */
  lightMode?: boolean;
  className?: string;
  /** Composited over the page, so the room's own ground still reads through. */
  opacity?: number;
}

const hexToRgb = (hex: string): [number, number, number] => {
  const value = hex.trim().replace(/^#/, "");
  const normalised = value.length === 3 ? value.replace(/./g, (c) => c + c) : value;
  const m = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(normalised);
  if (!m) return [1, 1, 1];
  return [parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255];
};

const vertex = `#version 300 es
in vec2 position;

void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = `#version 300 es
precision highp float;

uniform vec2 uResolution;
uniform float uTime;
uniform float uSpeed;
uniform float uScale;
uniform float uRotation;
uniform float uLayers;
uniform float uWaveAmplitude;
uniform float uWaveFrequency;
uniform float uWaveSpeed;
uniform float uLayerSpeed;
uniform float uTwist;
uniform float uTwistFrequency;
uniform float uTwistSpeed;
uniform float uLineFrequency;
uniform float uLineSpacing;
uniform float uLineSharpness;
uniform float uGlowFalloff;
uniform float uGlowIntensity;
uniform float uBrightness;
uniform float uBlueBoost;
uniform float uVignette;
uniform float uGrain;
uniform float uRotationSpeed;
uniform float uLightMode;
uniform vec3 uLineColor;
uniform vec3 uGlowColor;

out vec4 fragColor;

#define MAX_LAYERS 10

mat2 rotate2d(float angle) {
  float sine = sin(angle);
  float cosine = cos(angle);
  return mat2(cosine, -sine, sine, cosine);
}

float grainHash(vec2 point) {
  point = floor(point);
  float hash = 52.9829189 * fract(dot(point, vec2(0.065, 0.005)));
  return fract(hash);
}

float layeredGrain(vec2 fragmentPixel) {
  vec2 point = mod(fragmentPixel + vec2(uTime * 30.0, -uTime * 21.0), 1024.0);
  vec2 rotated = mat2(0.8, -0.5, 0.5, 0.8) * point;
  float grain = 0.0;
  grain += 0.40 * grainHash(rotated);
  grain += 0.25 * grainHash(rotated * 2.0 + 17.0);
  grain += 0.20 * grainHash(rotated * 4.0 + 47.0);
  grain += 0.10 * grainHash(rotated * 8.0 + 113.0);
  grain += 0.05 * grainHash(rotated * 16.0 + 191.0);
  return grain;
}

void main() {
  vec2 resolution = max(uResolution, vec2(1.0));
  vec2 uv = (2.0 * gl_FragCoord.xy - resolution) / resolution.y;
  float time = uTime * uSpeed;
  vec3 backdrop = mix(vec3(0.070588, 0.058824, 0.090196), vec3(1.0), step(0.5, uLightMode));
  vec3 centerTone = max(uLineColor * 0.85567 - uGlowColor * 0.06186, vec3(0.0));
  vec3 cloudTone = uLineColor * 0.19588 + uGlowColor * 0.2268;
  vec2 p = uv;
  p /= max(uScale, 0.05);
  p = rotate2d(radians(uRotation) + time * uRotationSpeed) * p;
  vec3 color = vec3(0.0);
  float fiberField = 0.0;

  for (int index = 0; index < MAX_LAYERS; index++) {
    float fi = float(index) + 1.0;
    if (fi > uLayers) break;

    p += uWaveAmplitude * sin(p.yx * fi * uWaveFrequency + time * (uWaveSpeed + fi * uLayerSpeed));

    float radius = length(p);
    float polarAngle = atan(p.y, p.x);
    polarAngle += sin(radius * uTwistFrequency - time * uTwistSpeed + fi) * uTwist;
    p = vec2(cos(polarAngle), sin(polarAngle)) * radius;

    float lines = abs(sin(p.x * (uLineFrequency + fi * uLineSpacing) + sin(p.y * 3.0 + time)));
    lines = pow(max(0.0, 1.0 - lines), uLineSharpness);
    fiberField += lines / fi;
    color += uLineColor * lines / fi;

    float glow = exp(-uGlowFalloff * abs(sin(p.x * 3.0 + time + fi)));
    color += uGlowColor * glow * uGlowIntensity / (fi * 2.0);
  }

  float center = exp(-2.2 * dot(uv, uv));
  color += centerTone * center;

  float cloud = exp(-1.5 * length(uv + vec2(sin(time * 0.3) * 0.25, cos(time * 0.25) * 0.18)));
  color += cloudTone * cloud;

  float vignette = 1.0 - smoothstep(0.35, 1.45, length(uv));
  color *= mix(1.0 - uVignette, 1.0, vignette);
  color = 1.0 - exp(-color * uBrightness);
  color.b *= uBlueBoost;

  vec3 outputColor;
  if (uLightMode > 0.5) {
    float edgeFade = mix(1.0 - uVignette, 1.0, vignette);
    float fibers = pow(smoothstep(0.12, 1.05, fiberField) * edgeFade, 1.5);
    float atmosphere = (center * 0.025 + cloud * 0.015) * edgeFade;
    vec3 fiberInk = mix(backdrop, uLineColor, 0.52);
    vec3 airColor = mix(backdrop, uGlowColor, 0.16);

    outputColor = mix(backdrop, airColor, atmosphere);
    outputColor = mix(outputColor, fiberInk, fibers * 0.3);
  } else {
    outputColor = backdrop + color;
  }

  float noise = (layeredGrain(gl_FragCoord.xy) - 0.5) * uGrain;
  outputColor = clamp(outputColor + noise, 0.0, 1.0);
  fragColor = vec4(outputColor, 1.0);
}
`;

type Ctx = {
  renderer: { setSize: (w: number, h: number) => void; render: (o: object) => void; gl: WebGL2RenderingContext };
  program: { uniforms: Record<string, { value: unknown }> };
  mesh: object;
};

/**
 * Can this machine run the shader, and does the person want it to?
 *
 * Read once, in a lazy initialiser, so the answer is fixed for the life of the
 * component: creating the context and then discarding it costs a GPU allocation
 * for nothing, and re-checking on every render would thrash.
 */
function useCanRender(): boolean {
  const [can] = useState(() => {
    if (typeof window === "undefined") return false;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return false;
    try {
      const probe = document.createElement("canvas");
      return Boolean(probe.getContext("webgl2"));
    } catch {
      return false;
    }
  });
  return can;
}

export default function GhostFibers({
  lineColor = "#001F5A",
  glowColor = "#00568F",
  speed = 0.2,
  scale = 2,
  rotation = 0,
  rotationSpeed = 0.25,
  layers = 4,
  waveAmplitude = 0.015,
  waveFrequency = 3,
  waveSpeed = 0.15,
  layerSpeed = 0.08,
  twist = 0.1,
  twistFrequency = 5,
  twistSpeed = 1.2,
  lineFrequency = 5,
  lineSpacing = 2,
  lineSharpness = 16,
  glowFalloff = 10,
  glowIntensity = 1.6,
  brightness = 2,
  blueBoost = 1.25,
  vignette = 0.8,
  grain = 0.05,
  lightMode = false,
  className = "",
  opacity = 1,
}: GhostFibersProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<Ctx | null>(null);
  const supported = useCanRender();
  const [failed, setFailed] = useState(false);
  const canRender = supported && !failed;

  /* Effect 1: build the context once. */
  useEffect(() => {
    if (!canRender) return;
    const container = containerRef.current;
    if (!container) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    /* Dynamic, so `ogl` is only fetched on the one route that draws this. */
    void import("ogl").then(({ Renderer, Program, Mesh, Triangle }) => {
      if (disposed || !containerRef.current) return;

      const renderer = new Renderer({
        webgl: 2,
        alpha: false,
        antialias: false,
        dpr: Math.min(window.devicePixelRatio || 1, 2),
      });
      const gl = renderer.gl;
      const canvas = gl.canvas as HTMLCanvasElement;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.style.display = "block";
      canvas.setAttribute("aria-hidden", "true");
      container.appendChild(canvas);

      const geometry = new Triangle(gl);
      const program = new Program(gl, {
        vertex,
        fragment,
        uniforms: {
          uResolution: { value: new Float32Array([1, 1]) },
          uTime: { value: 0 },
          uSpeed: { value: speed },
          uScale: { value: scale },
          uRotation: { value: rotation },
          uRotationSpeed: { value: rotationSpeed },
          uLayers: { value: layers },
          uWaveAmplitude: { value: waveAmplitude },
          uWaveFrequency: { value: waveFrequency },
          uWaveSpeed: { value: waveSpeed },
          uLayerSpeed: { value: layerSpeed },
          uTwist: { value: twist },
          uTwistFrequency: { value: twistFrequency },
          uTwistSpeed: { value: twistSpeed },
          uLineFrequency: { value: lineFrequency },
          uLineSpacing: { value: lineSpacing },
          uLineSharpness: { value: lineSharpness },
          uGlowFalloff: { value: glowFalloff },
          uGlowIntensity: { value: glowIntensity },
          uBrightness: { value: brightness },
          uBlueBoost: { value: blueBoost },
          uVignette: { value: vignette },
          uGrain: { value: grain },
          uLightMode: { value: lightMode ? 1 : 0 },
          uLineColor: { value: new Float32Array(hexToRgb(lineColor)) },
          uGlowColor: { value: new Float32Array(hexToRgb(glowColor)) },
        },
      });

      const mesh = new Mesh(gl, { geometry, program });
      ctxRef.current = { renderer, program, mesh } as unknown as Ctx;

      const setSize = () => {
        const rect = container.getBoundingClientRect();
        renderer.setSize(Math.max(1, Math.floor(rect.width)), Math.max(1, Math.floor(rect.height)));
        const res = program.uniforms.uResolution.value as Float32Array;
        res[0] = gl.drawingBufferWidth;
        res[1] = gl.drawingBufferHeight;
        renderer.render({ scene: mesh });
      };

      const ro = new ResizeObserver(setSize);
      ro.observe(container);
      setSize();

      /* Paused off-screen and on a hidden tab. A field nobody is looking at
         should not be costing a frame every 16ms. */
      let raf = 0;
      let onScreen = true;
      let pageVisible = !document.hidden;
      const t0 = performance.now();

      const loop = (t: number) => {
        program.uniforms.uTime.value = (t - t0) * 0.001;
        renderer.render({ scene: mesh });
        raf = requestAnimationFrame(loop);
      };
      const start = () => {
        if (onScreen && pageVisible && raf === 0) raf = requestAnimationFrame(loop);
      };
      const stop = () => {
        if (raf !== 0) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      };

      const io = new IntersectionObserver(
        ([entry]) => {
          onScreen = entry.isIntersecting;
          if (onScreen) start();
          else stop();
        },
        { threshold: 0 },
      );
      io.observe(container);

      const onVisibility = () => {
        pageVisible = !document.hidden;
        if (pageVisible) start();
        else stop();
      };
      document.addEventListener("visibilitychange", onVisibility);
      start();

      cleanup = () => {
        stop();
        ro.disconnect();
        io.disconnect();
        document.removeEventListener("visibilitychange", onVisibility);
        ctxRef.current = null;
        try {
          container.removeChild(canvas);
        } catch {
          /* already gone */
        }
        gl.getExtension("WEBGL_lose_context")?.loseContext();
      };
    }).catch(() => {
      if (!disposed) {
        cleanup?.();
        container.querySelector("canvas")?.remove();
        setFailed(true);
      }
    });

    return () => {
      disposed = true;
      cleanup?.();
    };
    /* Built once. Props are pushed onto the live uniforms below, never by
       rebuilding the context. */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canRender]);

  /* Effect 2: push props onto the running uniforms. No teardown, no GPU cost. */
  useEffect(() => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    const u = ctx.program.uniforms;
    const set = (k: string, v: unknown) => {
      if (u[k]) u[k].value = v;
    };
    set("uSpeed", speed);
    set("uScale", scale);
    set("uRotation", rotation);
    set("uRotationSpeed", rotationSpeed);
    set("uLayers", Math.min(Math.max(Math.round(layers), 1), 10));
    set("uWaveAmplitude", waveAmplitude);
    set("uWaveFrequency", waveFrequency);
    set("uWaveSpeed", waveSpeed);
    set("uLayerSpeed", layerSpeed);
    set("uTwist", twist);
    set("uTwistFrequency", twistFrequency);
    set("uTwistSpeed", twistSpeed);
    set("uLineFrequency", lineFrequency);
    set("uLineSpacing", lineSpacing);
    set("uLineSharpness", lineSharpness);
    set("uGlowFalloff", glowFalloff);
    set("uGlowIntensity", glowIntensity);
    set("uBrightness", brightness);
    set("uBlueBoost", blueBoost);
    set("uVignette", vignette);
    set("uGrain", grain);
    set("uLightMode", lightMode ? 1 : 0);
    set("uLineColor", new Float32Array(hexToRgb(lineColor)));
    set("uGlowColor", new Float32Array(hexToRgb(glowColor)));
  }, [
    lineColor, glowColor, speed, scale, rotation, rotationSpeed, layers,
    waveAmplitude, waveFrequency, waveSpeed, layerSpeed, twist, twistFrequency,
    twistSpeed, lineFrequency, lineSpacing, lineSharpness, glowFalloff,
    glowIntensity, brightness, blueBoost, vignette, grain, lightMode,
  ]);

  /**
   * The fallback is not an empty div.
   *
   * Without WebGL2, or with reduced motion asked for, the room still needs a
   * floor with something in it for the glass to sit against. Repeating rules at
   * two angles are not fibers, but they are filaments of the same navy running
   * the same way, which is the part the composition depends on.
   */
  const painted = !canRender
    ? {
        backgroundImage: `repeating-linear-gradient(74deg, ${lineColor}0f 0px, ${lineColor}0f 1px, transparent 1px, transparent 13px),
                          repeating-linear-gradient(-62deg, ${lineColor}0a 0px, ${lineColor}0a 1px, transparent 1px, transparent 21px),
                          radial-gradient(ellipse 78% 62% at 50% 46%, ${glowColor}14, transparent 68%)`,
      }
    : undefined;

  return (
    <div
      ref={containerRef}
      aria-hidden
      className={`gw-container ${className}`.trim()}
      style={{ opacity, ...painted }}
    />
  );
}
