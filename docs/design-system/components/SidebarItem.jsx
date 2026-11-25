import React from "react";
import { LucideIcon } from "./LucideIcon.jsx";

export function SidebarItem({ icon, label, count, active = false, locked = false, collapsed = false, onClick, style, ...rest }) {
  const [hover, setHover] = React.useState(false);
  const hot = hover && !locked && !active;
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        fontFamily: "var(--ui-font)",
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 0,
        padding: "0.5rem 2px 0.5rem 0",
        border: "none",
        borderRadius: "var(--ui-radius-lg)",
        fontWeight: 500,
        fontSize: "var(--ui-text-base)",
        textAlign: "left",
        cursor: locked ? "pointer" : "pointer",
        opacity: locked ? 0.6 : 1,
        background: active ? "var(--ui-surface-selected)" : hot ? "var(--product-blue)" : "transparent",
        color: active ? "var(--product-primary-500)" : hot ? "#fff" : locked ? "var(--product-gray-light)" : "var(--product-black-text)",
        transition: "background-color var(--ui-duration), color var(--ui-duration)",
        ...style,
      }}
      {...rest}
    >
      <span style={{ flex: "0 0 auto", margin: "0 0.75rem", display: "flex" }}>
        <LucideIcon name={icon} size={24} />
      </span>
      {!collapsed ? <span style={{ width: "100%", lineHeight: 1, minWidth: 0 }}>{label}</span> : null}
      {count && !collapsed ? (
        <span
          style={{
            minWidth: 32,
            height: 24,
            marginRight: "1rem",
            padding: 4,
            textAlign: "center",
            borderRadius: 999,
            fontSize: "var(--ui-text-sm)",
            background: active ? "#fff" : "var(--product-blue-100)",
            color: "var(--product-blue)",
          }}
        >
          {count}
        </span>
      ) : null}
      {locked && !collapsed ? <LucideIcon name="lock" size={16} style={{ marginRight: "0.75rem" }} /> : null}
    </button>
  );
}

export function SidebarSection({ title, children, collapsed = false }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, width: "100%" }}>
      {!collapsed && title ? (
        <span style={{ fontFamily: "var(--ui-font)", fontSize: "var(--ui-text-xs)", marginTop: 8, paddingLeft: "0.75rem", fontWeight: 500, color: "var(--product-gray-light)" }}>
          {title}
        </span>
      ) : null}
      {children}
    </div>
  );
}
