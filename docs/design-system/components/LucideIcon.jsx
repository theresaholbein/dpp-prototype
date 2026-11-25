import React from "react";

/** Lucide glyph rendered via CSS mask so it inherits currentColor — the same
 *  technique the app uses for its rich-text metric chips. */
export function LucideIcon({ name, size = 24, strokeWidth, style, ...rest }) {
  const url = `https://unpkg.com/lucide-static@0.544.0/icons/${name}.svg`;
  return (
    <span
      aria-hidden="true"
      style={{
        display: "inline-block",
        width: size,
        height: size,
        flex: "0 0 auto",
        backgroundColor: "currentColor",
        WebkitMaskImage: `url("${url}")`,
        maskImage: `url("${url}")`,
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        ...style,
      }}
      {...rest}
    />
  );
}
