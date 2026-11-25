import React from "react";
import { LucideIcon } from "./LucideIcon.jsx";

const severities = {
  primary: { bg: "var(--product-blue-soft-btn)", fg: "var(--product-primary-500)" },
  success: { bg: "var(--product-green-light)", fg: "var(--product-green)" },
  info: { bg: "var(--product-blue-100)", fg: "var(--product-blue-700)" },
  warn: { bg: "var(--product-yellow-light)", fg: "var(--product-yellow)" },
  danger: { bg: "var(--product-pink-light)", fg: "var(--product-red-110)" },
  secondary: { bg: "var(--product-surface-100)", fg: "var(--product-surface-600)" },
  contrast: { bg: "var(--product-surface-950)", fg: "var(--product-surface-0)" },
};

export function AppTag({ value, children, severity = "primary", icon, rounded = false, style, ...rest }) {
  const s = severities[severity];
  return (
    <span
      style={{
        fontFamily: "var(--ui-font)",
        width: "fit-content",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        fontSize: "var(--ui-text-sm)",
        padding: "0.25rem 0.5rem",
        borderRadius: rounded ? "1rem" : "var(--ui-radius-sm)",
        background: s.bg,
        color: s.fg,
        ...style,
      }}
      {...rest}
    >
      {icon ? <LucideIcon name={icon} size={14} /> : null}
      {value || children}
    </span>
  );
}
