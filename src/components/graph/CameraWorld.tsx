"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

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
  onClickWorld?: () => void;
  children: ReactNode;
  className?: string;
};

/**
 * Pan and zoom surface. Dragging moves the world freely in any direction in
 * every view; the wheel and pinch zoom around the pointer.
 *
 * `will-change: transform` is applied only while the camera is actually
 * moving. Left on permanently it promotes the world to a composited layer
 * that is rasterised once and then GPU-scaled, which makes text and SVG go
 * soft as soon as you zoom in. Dropping it at rest lets the browser
 * re-rasterise at the current scale, so a zoomed-in branch stays sharp.
 */
export function CameraWorld({
  camera,
  onCameraChange,
  minScale = ZOOM_MIN,
  maxScale = ZOOM_MAX,
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
  }>({ active: false, moved: false, lastX: 0, lastY: 0 });
  /** Live pointers, tracked so two fingers can pinch. */
  const pointersRef = useRef(new Map<number, { x: number; y: number }>());
  const pinchRef = useRef<{ dist: number; scale: number } | null>(null);

  /** True only while panning or zooming — see the note on the component. */
  const [moving, setMoving] = useState(false);
  const settleRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const markMoving = useCallback(() => {
    setMoving(true);
    if (settleRef.current) clearTimeout(settleRef.current);
    settleRef.current = setTimeout(() => {
      setMoving(false);
      settleRef.current = null;
    }, 180);
  }, []);

  useEffect(() => {
    camRef.current = camera;
  }, [camera]);

  useEffect(
    () => () => {
      if (settleRef.current) clearTimeout(settleRef.current);
    },
    [],
  );

  const clampScale = useCallback(
    (s: number) => Math.min(maxScale, Math.max(minScale, s)),
    [minScale, maxScale],
  );

  /**
   * Scale to `nextScale` while holding the world point under (ax, ay) still.
   * Anchor coords are relative to the viewport rect.
   */
  const zoomTo = useCallback(
    (nextScale: number, ax: number, ay: number) => {
      const c = camRef.current;
      const next = clampScale(nextScale);
      if (next === c.scale) return;
      const wx = (ax - c.x) / c.scale;
      const wy = (ay - c.y) / c.scale;
      onCameraChange({ scale: next, x: ax - wx * next, y: ay - wy * next });
    },
    [clampScale, onCameraChange],
  );

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
        // Second finger down — hand over to pinch, drop the pan drag.
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
      };
    },
    [pinchDistance],
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
          markMoving();
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

      markMoving();
      const c = camRef.current;
      onCameraChange({ ...c, x: c.x + dx, y: c.y + dy });
    },
    [markMoving, onCameraChange, pinchDistance, pinchMidpoint, zoomTo],
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
      if (!moved) onClickWorld?.();
    },
    [onClickWorld],
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

      markMoving();
      zoomTo(
        camRef.current.scale * factor,
        e.clientX - rect.left,
        e.clientY - rect.top,
      );
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [markMoving, zoomTo]);

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
        className="absolute left-0 top-0"
        style={{
          transform: `translate(${camera.x}px, ${camera.y}px) scale(${camera.scale})`,
          transformOrigin: "0 0",
          willChange: moving ? "transform" : "auto",
        }}
      >
        {children}
      </div>
    </div>
  );
}
