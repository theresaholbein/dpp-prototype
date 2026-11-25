import React from "react";
import { LucideIcon } from "./LucideIcon.jsx";

export function AppCard({ title, subtitle, children, footer, active = false, padding = "1.25rem", style, ...rest }) {
  return (
    <div
      style={{
        fontFamily: "var(--ui-font)",
        display: "flex",
        flexDirection: "column",
        borderRadius: "var(--ui-radius-xl)",
        color: "var(--ui-text)",
        border: `1px solid ${active ? "var(--product-primary-500)" : "var(--ui-border)"}`,
        background: active ? "var(--product-primary-50)" : "var(--ui-surface)",
        padding,
        gap: "0.5rem",
        ...style,
      }}
      {...rest}
    >
      {title ? <div style={{ fontWeight: 500, fontSize: "var(--ui-text-xl)", color: "var(--ui-text-strong)" }}>{title}</div> : null}
      {subtitle ? <div style={{ color: "var(--ui-text-muted)" }}>{subtitle}</div> : null}
      {children}
      {footer ? <div style={{ marginTop: "0.5rem" }}>{footer}</div> : null}
    </div>
  );
}

const messageTones = {
  info: { bg: "rgba(233,240,253,.95)", line: "var(--product-primary-500)", fg: "var(--product-primary-600)", icon: "info" },
  success: { bg: "var(--product-green-light)", line: "var(--product-green)", fg: "var(--product-green-dark)", icon: "circle-check-big" },
  warn: { bg: "var(--product-yellow-light)", line: "var(--product-yellow)", fg: "var(--product-yellow-110)", icon: "octagon-alert" },
  error: { bg: "var(--product-red-10)", line: "var(--product-red)", fg: "var(--product-red-110)", icon: "triangle-alert" },
  secondary: { bg: "var(--product-surface-100)", line: "var(--product-surface-500)", fg: "var(--product-surface-600)", icon: "info" },
};

export function AppMessage({ children, severity = "info", closable = false, onClose, style, ...rest }) {
  const t = messageTones[severity];
  return (
    <div
      style={{
        fontFamily: "var(--ui-font)",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.5rem 0.75rem",
        borderRadius: "var(--ui-radius-sm)",
        outline: `1px solid ${t.line}`,
        background: t.bg,
        color: t.fg,
        ...style,
      }}
      {...rest}
    >
      <LucideIcon name={t.icon} size={18} />
      <span style={{ fontSize: "var(--ui-text-base)" }}>{children}</span>
      {closable ? (
        <button
          type="button"
          onClick={onClose}
          style={{ marginInlineStart: "auto", width: 28, height: 28, borderRadius: 999, border: "none", background: "transparent", color: "inherit", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <LucideIcon name="x" size={16} />
        </button>
      ) : null}
    </div>
  );
}
