import { useMemo, useRef, type PointerEvent as ReactPointerEvent } from "react";

import { sfx } from "../lib/sfx.ts";

export interface WheelTile {
  id: number;
  char: string;
}

interface WordWheelProps {
  tiles: WheelTile[];
  selectedIds: number[];
  onExtend: (slot: number) => void;
  onSubmit: () => void;
  disabled?: boolean;
}

/** Fraction of the wheel radius at which tiles sit. */
const RADIUS = 36;
/** Ignore gestures that start too close to the hub, where the angle is unstable. */
const DEAD_ZONE = 0.12;

export function WordWheel({ tiles, selectedIds, onExtend, onSubmit, disabled }: WordWheelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const slots = tiles.length;

  const points = useMemo(
    () =>
      tiles.map((_, slot) => {
        const angle = ((-90 + (360 / slots) * slot) * Math.PI) / 180;
        return { x: 50 + RADIUS * Math.cos(angle), y: 50 + RADIUS * Math.sin(angle) };
      }),
    [slots, tiles],
  );

  const pointById = useMemo(() => {
    const map = new Map<number, { x: number; y: number }>();
    tiles.forEach((tile, slot) => map.set(tile.id, points[slot]));
    return map;
  }, [tiles, points]);

  const trail = selectedIds
    .map((id) => pointById.get(id))
    .filter((point): point is { x: number; y: number } => Boolean(point));

  function slotFromEvent(event: ReactPointerEvent<HTMLDivElement>): number | null {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return null;

    const x = event.clientX - (rect.left + rect.width / 2);
    const y = event.clientY - (rect.top + rect.height / 2);
    if (Math.hypot(x, y) < rect.width * DEAD_ZONE) return null;

    let angle = (Math.atan2(y, x) * 180) / Math.PI + 90;
    if (angle < 0) angle += 360;
    return Math.round(angle / (360 / slots)) % slots;
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (disabled) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    draggingRef.current = true;
    const slot = slotFromEvent(event);
    if (slot !== null) {
      onExtend(slot);
      sfx.pick();
    }
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!draggingRef.current || disabled) return;
    const slot = slotFromEvent(event);
    if (slot !== null) onExtend(slot);
  }

  function handlePointerEnd(event: ReactPointerEvent<HTMLDivElement>) {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    onSubmit();
  }

  return (
    <div className="wheel-wrap">
      <div
        ref={containerRef}
        className={`wheel ${disabled ? "is-disabled" : ""}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        role="application"
        aria-label="Letter wheel. Swipe across letters to build a word."
      >
        <svg className="wheel-trail" viewBox="0 0 100 100" aria-hidden="true">
          {trail.length > 1 ? (
            <polyline
              points={trail.map((point) => `${point.x},${point.y}`).join(" ")}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.35"
            />
          ) : null}
          {trail.map((point, i) => (
            <circle key={i} cx={point.x} cy={point.y} r="2.2" fill="currentColor" opacity="0.25" />
          ))}
        </svg>

        {tiles.map((tile, slot) => {
          const point = points[slot];
          const isSelected = selectedIds.includes(tile.id);
          return (
            <span
              key={tile.id}
              className={`wheel-tile ${isSelected ? "is-selected" : ""}`}
              style={{ left: `${point.x}%`, top: `${point.y}%` }}
            >
              {tile.char.toUpperCase()}
            </span>
          );
        })}
      </div>
    </div>
  );
}
