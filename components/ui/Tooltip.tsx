"use client";

import { cloneElement, isValidElement, useId, useRef, useState, type ReactElement, type ReactNode } from "react";

/**
 * Minimaler Tooltip (nicht im Design System portiert).
 * Erscheint bei Hover und Tastaturfokus, schließt mit Escape.
 * Fixe Positionierung, damit er nicht von scrollenden Containern (Sidebar) abgeschnitten wird.
 *
 * describe=false: Das Element hat bereits einen zugänglichen Namen (z. B. aria-label),
 * der Tooltip ist rein visuell. describe=true: Der Tooltip ergänzt Information und
 * wird per aria-describedby verknüpft.
 */
type Placement = "bottom" | "bottom-end" | "right";

type Props = {
  label: ReactNode;
  placement?: Placement;
  describe?: boolean;
  /** Längere Texte umbrechen statt einzeilig (Design Bible K). */
  wrap?: boolean;
  className?: string;
  children: ReactNode;
};

const OFFSET = 8;

export function Tooltip({ label, placement = "bottom", describe = false, wrap = false, className = "", children }: Props) {
  const id = useId();
  const ref = useRef<HTMLSpanElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  const show = () => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    if (placement === "right") setPos({ top: r.top + r.height / 2, left: r.right + OFFSET });
    else if (placement === "bottom-end") setPos({ top: r.bottom + OFFSET, left: r.right });
    else setPos({ top: r.bottom + OFFSET, left: r.left + r.width / 2 });
  };
  const hide = () => setPos(null);

  const shift =
    placement === "right" ? "-translate-y-1/2" : placement === "bottom-end" ? "-translate-x-full" : "-translate-x-1/2";

  const child =
    describe && isValidElement(children)
      ? cloneElement(children as ReactElement<{ "aria-describedby"?: string }>, { "aria-describedby": id })
      : children;

  return (
    <span
      ref={ref}
      className={`inline-flex ${className}`}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      onKeyDown={(e) => {
        if (e.key === "Escape") hide();
      }}
    >
      {child}
      <span
        id={id}
        role="tooltip"
        aria-hidden={describe ? undefined : true}
        hidden={!pos}
        style={pos ? { top: pos.top, left: pos.left } : undefined}
        className={`pointer-events-none fixed z-50 ${wrap ? "w-max max-w-80 whitespace-normal" : "whitespace-nowrap"} rounded-ui-sm bg-surface-950 px-2 py-1 text-xs text-surface-0 ${shift}`}
      >
        {label}
      </span>
    </span>
  );
}
