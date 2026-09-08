"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { nebulaFragment, nebulaVertex } from "./askPortalShaders";

export type PortalVisualState = "idle" | "hover" | "opening" | "open" | "answering";

type AskPortalCanvasProps = {
  visualState: PortalVisualState;
  pointer: { x: number; y: number };
  compact?: boolean;
  reducedMotion?: boolean;
  className?: string;
};

const NAVY = new THREE.Color("#001f5a");
const CYAN = new THREE.Color("#81b7f0");
const TEAL = new THREE.Color("#2f9b8e");
const GOLD = new THREE.Color("#c9a227");

function makeArcPoints(radius: number, start: number, sweep: number, segments = 64) {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = start + (sweep * i) / segments;
    pts.push(new THREE.Vector3(Math.cos(t) * radius, Math.sin(t) * radius, 0));
  }
  return pts;
}

function NebulaCore({
  visualState,
  pointer,
  reducedMotion,
}: {
  visualState: PortalVisualState;
  pointer: { x: number; y: number };
  reducedMotion?: boolean;
}) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const hoverTarget = useRef(0);
  const openTarget = useRef(0);
  const answerTarget = useRef(0);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uHover: { value: 0 },
      uOpen: { value: 0 },
      uAnswering: { value: 0 },
      uPointer: { value: new THREE.Vector2(0.5, 0.5) },
      uNavy: { value: NAVY },
      uCyan: { value: CYAN },
      uTeal: { value: TEAL },
      uGold: { value: GOLD },
    }),
    [],
  );

  useFrame((_, delta) => {
    if (!mat.current) return;
    const u = mat.current.uniforms;
    if (!reducedMotion) u.uTime.value += delta;

    hoverTarget.current = visualState === "hover" || visualState === "opening" ? 1 : 0;
    openTarget.current =
      visualState === "opening" || visualState === "open" || visualState === "answering"
        ? 1
        : 0;
    answerTarget.current = visualState === "answering" ? 1 : 0;

    const lerp = reducedMotion ? 1 : 1 - Math.exp(-delta * 6);
    u.uHover.value += (hoverTarget.current - u.uHover.value) * lerp;
    u.uOpen.value += (openTarget.current - u.uOpen.value) * lerp;
    u.uAnswering.value += (answerTarget.current - u.uAnswering.value) * lerp;
    u.uPointer.value.x += (pointer.x - u.uPointer.value.x) * lerp;
    u.uPointer.value.y += (pointer.y - u.uPointer.value.y) * lerp;
  });

  return (
    <mesh>
      <circleGeometry args={[1, 96]} />
      <shaderMaterial
        ref={mat}
        transparent
        depthWrite={false}
        vertexShader={nebulaVertex}
        fragmentShader={nebulaFragment}
        uniforms={uniforms}
      />
    </mesh>
  );
}

function AstrolabeRing({
  radius,
  start,
  sweep,
  color,
  speed,
  tilt,
  align,
  dashed,
  reducedMotion,
}: {
  radius: number;
  start: number;
  sweep: number;
  color: string;
  speed: number;
  tilt: [number, number, number];
  align: number;
  dashed?: boolean;
  reducedMotion?: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const phase = useRef(Math.random() * Math.PI * 2);

  const geometry = useMemo(() => {
    const pts = makeArcPoints(radius, start, sweep, dashed ? 48 : 72);
    const curve = new THREE.CatmullRomCurve3(pts);
    return new THREE.TubeGeometry(curve, dashed ? 48 : 72, dashed ? 0.012 : 0.008, 5, false);
  }, [radius, start, sweep, dashed]);

  useFrame((_, delta) => {
    if (!group.current || reducedMotion) return;
    const spin = THREE.MathUtils.lerp(speed, speed * 0.15, align);
    phase.current += delta * spin;
    group.current.rotation.z = phase.current;
    group.current.rotation.x = THREE.MathUtils.lerp(tilt[0], 0.12, align);
    group.current.rotation.y = THREE.MathUtils.lerp(tilt[1], -0.08, align);
  });

  return (
    <group ref={group} rotation={tilt}>
      <mesh geometry={geometry}>
        <meshBasicMaterial color={color} transparent opacity={0.72} depthWrite={false} />
      </mesh>
    </group>
  );
}

function ScanMarker({
  radius,
  align,
  reducedMotion,
}: {
  radius: number;
  align: number;
  reducedMotion?: boolean;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const t = useRef(0);

  useFrame((_, delta) => {
    if (!mesh.current) return;
    if (!reducedMotion) t.current += delta * THREE.MathUtils.lerp(1.4, 2.4, align);
    const a = t.current;
    mesh.current.position.set(Math.cos(a) * radius, Math.sin(a) * radius, 0.04);
  });

  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[0.035, 12, 12]} />
      <meshBasicMaterial color="#78cec4" />
    </mesh>
  );
}

function GraphSparks({
  hover,
  reducedMotion,
}: {
  hover: number;
  reducedMotion?: boolean;
}) {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, line } = useMemo(() => {
    const pos = new Float32Array(18 * 3);
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < 18; i++) {
      const a = (i / 18) * Math.PI * 2;
      const r = 0.25 + (i % 5) * 0.08;
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r;
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = 0.02;
      pts.push(new THREE.Vector3(x, y, 0.02));
    }
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const ln = new THREE.Line(
      geo,
      new THREE.LineBasicMaterial({
        color: "#78cec4",
        transparent: true,
        opacity: 0,
        depthWrite: false,
      }),
    );
    return { positions: pos, line: ln };
  }, []);

  useFrame(({ clock }) => {
    const pulse = reducedMotion
      ? hover * 0.35
      : hover * (0.25 + 0.35 * (0.5 + 0.5 * Math.sin(clock.elapsedTime * 2.2)));
    const ptsMat = pointsRef.current?.material;
    if (ptsMat && !Array.isArray(ptsMat)) {
      (ptsMat as THREE.PointsMaterial).opacity = pulse;
    }
    const lineMat = line.material as THREE.LineBasicMaterial;
    lineMat.opacity = pulse * 0.55;
  });

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#81b7f0"
          size={0.035}
          transparent
          opacity={0}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
      <primitive object={line} />
    </group>
  );
}

function Horizon({
  hover,
  reducedMotion,
}: {
  hover: number;
  reducedMotion?: boolean;
}) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const breathe = reducedMotion ? 1 : 1 + Math.sin(clock.elapsedTime * 1.6) * 0.012;
    const scale = (1.02 + hover * 0.03) * breathe;
    mesh.current.scale.setScalar(scale);
  });

  return (
    <mesh ref={mesh} rotation={[0, 0, 0]}>
      <ringGeometry args={[0.97, 1.02, 96]} />
      <meshBasicMaterial color="#81b7f0" transparent opacity={0.55 + hover * 0.25} depthWrite={false} />
    </mesh>
  );
}

function PortalScene({
  visualState,
  pointer,
  reducedMotion,
}: {
  visualState: PortalVisualState;
  pointer: { x: number; y: number };
  reducedMotion?: boolean;
}) {
  const align =
    visualState === "opening" || visualState === "open" || visualState === "answering" ? 1 : visualState === "hover" ? 0.55 : 0;
  const hover = visualState === "hover" || visualState === "opening" ? 1 : visualState === "open" || visualState === "answering" ? 0.35 : 0;

  return (
    <>
      <ambientLight intensity={0.4} />
      <NebulaCore visualState={visualState} pointer={pointer} reducedMotion={reducedMotion} />
      <Horizon hover={hover} reducedMotion={reducedMotion} />
      <AstrolabeRing
        radius={1.18}
        start={0.35}
        sweep={Math.PI * 1.35}
        color="#81b7f0"
        speed={0.35}
        tilt={[0.55, 0.15, 0]}
        align={align}
        dashed
        reducedMotion={reducedMotion}
      />
      <AstrolabeRing
        radius={1.32}
        start={1.1}
        sweep={Math.PI * 1.15}
        color="#2f9b8e"
        speed={-0.22}
        tilt={[-0.4, 0.45, 0.2]}
        align={align}
        reducedMotion={reducedMotion}
      />
      <AstrolabeRing
        radius={1.48}
        start={-0.4}
        sweep={Math.PI * 1.5}
        color="#c9a227"
        speed={0.18}
        tilt={[0.25, -0.55, 0.1]}
        align={align}
        reducedMotion={reducedMotion}
      />
      <ScanMarker radius={1.32} align={align} reducedMotion={reducedMotion} />
      <GraphSparks hover={hover} reducedMotion={reducedMotion} />
    </>
  );
}

function StaticFallback({ compact }: { compact?: boolean }) {
  return (
    <div
      className={`today-ask-portal-fallback${compact ? " is-compact" : ""}`}
      aria-hidden
    />
  );
}

export function AskPortalCanvas({
  visualState,
  pointer,
  compact,
  reducedMotion,
  className,
}: AskPortalCanvasProps) {
  if (reducedMotion) {
    return <StaticFallback compact={compact} />;
  }

  return (
    <div className={`today-ask-portal-canvas${compact ? " is-compact" : ""}${className ? ` ${className}` : ""}`}>
      <Canvas
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 3.2], fov: compact ? 42 : 38 }}
        style={{ width: "100%", height: "100%" }}
      >
        <PortalScene visualState={visualState} pointer={pointer} reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}
