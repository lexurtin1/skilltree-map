"use client";

import {
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";

export const ZOOM_MIN = 0.18;
export const ZOOM_MAX = 2.4;

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
  minScale = ZOOM_MIN,
  maxScale = ZOOM_MAX,
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
  /** Live pointers, tracked so two fingers can pinch. */
  const pointersRef = useRef(new Map<number, { x: number; y: number }>());
  const pinchRef = useRef<{ dist: number; scale: number } | null>(null);

  useEffect(() => {
    camRef.current = camera;
  }, [camera]);

  const clampScale = useCallback(
    (s: number) => Math.min(maxScale, Math.max(minScale, s)),
    [minScale, maxScale],
  );

  /**
   * Scale to `nextScale` while holding the world point under (ax, ay) still.
   * Anchor coords are relative to the viewport rect. In rotate mode the hub
   * lives at world 0,0 — pin it there so spinning stays true to the cursor.
   */
  const zoomTo = useCallback(
    (nextScale: number, ax: number, ay: number) => {
      const c = camRef.current;
      const next = clampScale(nextScale);
      if (next === c.scale) return;
      if (rotateMode) {
        onCameraChange({ ...c, scale: next });
        return;
      }
      const wx = (ax - c.x) / c.scale;
      const wy = (ay - c.y) / c.scale;
      onCameraChange({ scale: next, x: ax - wx * next, y: ay - wy * next });
    },
    [clampScale, onCameraChange, rotateMode],
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

  const pinchDistance = useCallback(() => {
    const pts = [...pointersRef.current.values()];
    if (pts.length < 2) return 0;
    return Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
  }, []);

  const pinchMidpoint = useCallback(() => {
    const pts = [...pointersRef.current.values()];
    if (pts.length < 2) return { x: 0, y: 0 };
    return { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 };
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("[data-node], [data-ui], button, a, input")) return;

      pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

      if (pointersRef.current.size === 2) {
        // Second finger down — hand over to pinch, drop the pan/rotate drag.
        dragRef.current.active = false;
        dragRef.current.moved = true;
        pinchRef.current = {
          dist: pinchDistance(),
          scale: camRef.current.scale,
        };
        return;
      }

      if (e.button !== 0 || pointersRef.current.size > 1) return;
      dragRef.current = {
        active: true,
        moved: false,
        lastX: e.clientX,
        lastY: e.clientY,
        lastAngle: rotateMode ? angleFromHub(e.clientX, e.clientY) : null,
      };
    },
    [angleFromHub, pinchDistance, rotateMode],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (pointersRef.current.has(e.pointerId)) {
        pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      }

      const pinch = pinchRef.current;
      if (pinch && pointersRef.current.size >= 2) {
        const dist = pinchDistance();
        if (pinch.dist > 0 && dist > 0) {
          const rect = rootRef.current?.getBoundingClientRect();
          const mid = pinchMidpoint();
          zoomTo(
            pinch.scale * (dist / pinch.dist),
            mid.x - (rect?.left ?? 0),
            mid.y - (rect?.top ?? 0),
          );
        }
        return;
      }

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
    [
      angleFromHub,
      onCameraChange,
      onRotate,
      pinchDistance,
      pinchMidpoint,
      rotateMode,
      zoomTo,
    ],
  );

  const endDrag = useCallback(
    (e: React.PointerEvent) => {
      pointersRef.current.delete(e.pointerId);
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
      if (pointersRef.current.size < 2) pinchRef.current = null;

      const d = dragRef.current;
      if (!d.active) return;
      const moved = d.moved;
      d.active = false;
      d.lastAngle = null;
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

      const rect = el.getBoundingClientRect();
      // deltaMode 1 = lines, 2 = pages. Normalise both to rough pixels.
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? rect.height : 1;
      // ctrlKey means a trackpad pinch (or ctrl+wheel) — it wants a steeper ramp.
      const intensity = e.ctrlKey ? 0.01 : 0.0025;
      const factor = Math.min(
        2,
        Math.max(0.5, Math.exp(-e.deltaY * unit * intensity)),
      );

      zoomTo(
        camRef.current.scale * factor,
        e.clientX - rect.left,
        e.clientY - rect.top,
      );
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [zoomTo]);

  return (
    <div
      ref={rootRef}
      className={`absolute inset-0 cursor-grab touch-none overflow-hidden active:cursor-grabbing ${className}`}
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
