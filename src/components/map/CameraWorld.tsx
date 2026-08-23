"use client";

import {
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";

export type CameraState = {
  x: number;
  y: number;
  scale: number;
};

type CameraWorldProps = {
  camera: CameraState;
  onCameraChange: (next: CameraState) => void;
  minScale?: number;
  maxScale?: number;
  /** Sky mode: drag spins the wheel around the hub. */
  rotateMode?: boolean;
  onRotate?: (deltaDeg: number) => void;
  /** Fired when a rotate/pan drag ends (for snap-to-dept). */
  onDragEnd?: () => void;
  onClickWorld?: () => void;
  children: ReactNode;
  className?: string;
};

export function CameraWorld({
  camera,
  onCameraChange,
  minScale = 0.18,
  maxScale = 2.4,
  rotateMode = false,
  onRotate,
  onDragEnd,
  onClickWorld,
  children,
  className = "",
}: CameraWorldProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const camRef = useRef(camera);
  const dragRef = useRef<{
    active: boolean;
    moved: boolean;
    lastX: number;
    lastY: number;
    /** Angle from hub (top = 0, clockwise), radians. */
    lastAngle: number | null;
  }>({ active: false, moved: false, lastX: 0, lastY: 0, lastAngle: null });

  useEffect(() => {
    camRef.current = camera;
  }, [camera]);

  const clampScale = useCallback(
    (s: number) => Math.min(maxScale, Math.max(minScale, s)),
    [minScale, maxScale],
  );

  /** Screen angle from wheel hub — matches sky polar (0 at top, clockwise). */
  const angleFromHub = useCallback((clientX: number, clientY: number) => {
    const el = rootRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    const c = camRef.current;
    const dx = clientX - (rect.left + c.x);
    const dy = clientY - (rect.top + c.y);
    return Math.atan2(dx, -dy);
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (e.button !== 0) return;
      const t = e.target as HTMLElement;
      if (t.closest("[data-node], [data-ui], button, a, input")) return;
      dragRef.current = {
        active: true,
        moved: false,
        lastX: e.clientX,
        lastY: e.clientY,
        lastAngle: rotateMode ? angleFromHub(e.clientX, e.clientY) : null,
      };
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    },
    [angleFromHub, rotateMode],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      const d = dragRef.current;
      if (!d.active) return;
      const dx = e.clientX - d.lastX;
      const dy = e.clientY - d.lastY;
      if (Math.abs(dx) + Math.abs(dy) > 3) d.moved = true;
      d.lastX = e.clientX;
      d.lastY = e.clientY;

      if (rotateMode && onRotate) {
        const ang = angleFromHub(e.clientX, e.clientY);
        if (d.lastAngle != null) {
          let delta = ang - d.lastAngle;
          while (delta > Math.PI) delta -= Math.PI * 2;
          while (delta < -Math.PI) delta += Math.PI * 2;
          onRotate((delta * 180) / Math.PI);
        }
        d.lastAngle = ang;
        return;
      }

      const c = camRef.current;
      onCameraChange({ ...c, x: c.x + dx, y: c.y + dy });
    },
    [angleFromHub, onCameraChange, onRotate, rotateMode],
  );

  const endDrag = useCallback(
    (e: React.PointerEvent) => {
      const d = dragRef.current;
      if (!d.active) return;
      const moved = d.moved;
      d.active = false;
      d.lastAngle = null;
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
      if (moved) onDragEnd?.();
      else onClickWorld?.();
    },
    [onClickWorld, onDragEnd],
  );

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (rotateMode) return;

      const c = camRef.current;
      const rect = el.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const factor = e.deltaY > 0 ? 0.92 : 1.08;
      const nextScale = clampScale(c.scale * factor);
      const wx = (mx - c.x) / c.scale;
      const wy = (my - c.y) / c.scale;
      onCameraChange({
        scale: nextScale,
        x: mx - wx * nextScale,
        y: my - wy * nextScale,
      });
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [clampScale, onCameraChange, rotateMode]);

  return (
    <div
      ref={rootRef}
      className={`absolute inset-0 overflow-hidden ${
        rotateMode
          ? "cursor-grab active:cursor-grabbing"
          : "cursor-grab active:cursor-grabbing"
      } ${className}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <div
        className="absolute left-0 top-0 will-change-transform"
        style={{
          transform: `translate(${camera.x}px, ${camera.y}px) scale(${camera.scale})`,
          transformOrigin: "0 0",
        }}
      >
        {children}
      </div>
    </div>
  );
}
