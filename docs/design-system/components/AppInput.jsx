import React from "react";

export function AppInput({ value, placeholder, size = "normal", invalid = false, disabled = false, fluid = false, onChange, style, ...rest }) {
  const [focus, setFocus] = React.useState(false);
  const [hover, setHover] = React.useState(false);
  const pad = size === "small" ? "0.375rem 0.625rem" : size === "large" ? "0.625rem 0.875rem" : "0.5rem 0.75rem";
  const fs = size === "small" ? "var(--ui-text-sm)" : size === "large" ? "var(--ui-text-lg)" : "var(--ui-text-base)";
  return (
    <input
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      onChange={onChange}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        fontFamily: "var(--ui-font)",
        appearance: "none",
        boxSizing: "border-box",
        outline: "none",
        borderRadius: "var(--ui-radius-sm)",
        padding: pad,
        fontSize: fs,
        width: fluid ? "100%" : undefined,
        background: disabled ? "var(--product-surface-200)" : "var(--product-surface-0)",
        color: disabled ? "var(--product-surface-500)" : "var(--product-surface-700)",
        border: `1px solid ${invalid ? "var(--product-pink-mid)" : focus ? "var(--product-primary-500)" : hover ? "var(--product-surface-400)" : "var(--product-surface-300)"}`,
        boxShadow: "var(--ui-shadow-input)",
        transition: "border-color var(--ui-duration)",
        ...style,
      }}
      {...rest}
    />
  );
}

export function AppField({ label, hint, error, children, style, ...rest }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6, fontFamily: "var(--ui-font)", ...style }} {...rest}>
      {label ? <span style={{ fontSize: "var(--ui-text-sm)", fontWeight: 500, color: "var(--ui-text)" }}>{label}</span> : null}
      {children}
      {error ? (
        <span style={{ fontSize: "var(--ui-text-xs)", color: "var(--product-pink)" }}>{error}</span>
      ) : hint ? (
        <span style={{ fontSize: "var(--ui-text-xs)", color: "var(--ui-text-muted)" }}>{hint}</span>
      ) : null}
    </label>
  );
}
