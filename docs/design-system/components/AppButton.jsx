import React from "react";
import { LucideIcon } from "./LucideIcon.jsx";

const sizes = {
  small: { fontSize: "var(--ui-text-sm)", padding: "0.375rem 0.625rem" },
  normal: { fontSize: "var(--ui-text-base)", padding: "0.5rem 0.75rem" },
  large: { fontSize: "1.125rem", padding: "0.625rem 0.875rem" },
};

const fills = {
  primary: { bg: "var(--product-primary-500)", fg: "var(--ui-action-contrast)", bd: "var(--product-primary-500)", hb: "var(--product-primary-600)", ab: "var(--product-primary-700)" },
  secondary: { bg: "var(--product-surface-100)", fg: "var(--product-surface-600)", bd: "var(--product-surface-100)", hb: "var(--product-surface-200)", ab: "var(--product-surface-300)" },
  tertiary: { bg: "var(--product-gray-btn)", fg: "var(--product-gray-dark)", bd: "var(--product-gray-btn)", hb: "var(--product-gray-btn)", ab: "var(--product-gray-btn)", hf: "var(--product-blue)" },
  danger: { bg: "var(--product-red)", fg: "var(--ui-action-contrast)", bd: "var(--product-red)", hb: "var(--product-red-110)", ab: "var(--product-red-110)" },
};

export function AppButton({
  label,
  children,
  variant = "primary",
  mode = "filled",
  size = "normal",
  icon,
  iconRight = false,
  rounded = false,
  disabled = false,
  fluid = false,
  onClick,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  const f = fills[variant];
  const accent = variant === "danger" ? "var(--product-red)" : variant === "primary" ? "var(--product-primary-500)" : "var(--product-surface-600)";
  const tint = variant === "danger" ? "var(--product-red-10)" : "var(--product-primary-50)";
  let skin;
  if (mode === "outlined") {
    skin = {
      background: press ? "var(--product-primary-100)" : hover ? tint : "transparent",
      color: accent,
      borderColor: variant === "primary" ? "var(--product-primary-200)" : "var(--product-surface-200)",
    };
  } else if (mode === "text") {
    skin = { background: press ? "var(--product-primary-100)" : hover ? tint : "transparent", color: accent, borderColor: "transparent" };
  } else {
    skin = {
      background: press ? f.ab : hover ? f.hb : f.bg,
      color: hover && f.hf ? f.hf : f.fg,
      borderColor: press ? f.ab : hover ? f.hb : f.bd,
    };
  }
  const iconOnly = !label && !children && icon;
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setPress(false); }}
      onMouseDown={() => setPress(true)}
      onMouseUp={() => setPress(false)}
      style={{
        fontFamily: "var(--ui-font)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: iconOnly ? 0 : "0.5rem",
        position: "relative",
        overflow: "hidden",
        cursor: disabled ? "not-allowed" : "pointer",
        userSelect: "none",
        borderRadius: rounded ? "2rem" : "var(--ui-radius-sm)",
        borderWidth: 1,
        borderStyle: "solid",
        fontWeight: 500,
        transition: "background-color var(--ui-duration), border-color var(--ui-duration), color var(--ui-duration)",
        opacity: disabled ? 0.6 : 1,
        width: fluid ? "100%" : iconOnly ? "2.5rem" : undefined,
        ...sizes[size],
        ...(iconOnly ? { padding: 0, height: "2.5rem", borderRadius: rounded ? "999px" : "var(--ui-radius-sm)" } : null),
        ...skin,
        ...style,
      }}
      {...rest}
    >
      {icon && !iconRight ? <LucideIcon name={icon} size={size === "small" ? 16 : 20} /> : null}
      {label || children}
      {icon && iconRight ? <LucideIcon name={icon} size={size === "small" ? 16 : 20} /> : null}
    </button>
  );
}
