import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

/**
 * Port von docs/design-system/components/AppButton.jsx.
 * Gleiche Varianten, Modi und Größen; Hover/Active per CSS statt State,
 * damit Tastatur und Maus gleich behandelt werden.
 * Mit `href` rendert er einen Link im selben Aussehen (Navigation statt Aktion).
 */
type Variant = "primary" | "secondary" | "tertiary" | "danger";
type Mode = "filled" | "outlined" | "text";
type Size = "small" | "normal" | "large";

const sizes: Record<Size, string> = {
  small: "text-sm px-2.5 py-1.5",
  normal: "text-base px-3 py-2",
  large: "text-lg px-3.5 py-2.5",
};

const filled: Record<Variant, string> = {
  primary:
    "bg-primary-500 text-ui-action-contrast border-primary-500 hover:bg-primary-600 hover:border-primary-600 active:bg-primary-700 active:border-primary-700",
  secondary:
    "bg-surface-100 text-surface-600 border-surface-100 hover:bg-surface-200 hover:border-surface-200 active:bg-surface-300 active:border-surface-300",
  tertiary: "bg-gray-btn text-gray-dark border-gray-btn hover:text-blue",
  danger:
    "bg-red text-ui-action-contrast border-red hover:bg-red-110 hover:border-red-110 active:bg-red-110 active:border-red-110",
};

function accent(variant: Variant) {
  if (variant === "danger") return "text-red hover:bg-red-10 active:bg-primary-100";
  if (variant === "primary") return "text-primary-500 hover:bg-primary-50 active:bg-primary-100";
  return "text-surface-600 hover:bg-primary-50 active:bg-primary-100";
}

export type AppButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  label?: ReactNode;
  children?: ReactNode;
  variant?: Variant;
  mode?: Mode;
  size?: Size;
  icon?: LucideIcon;
  iconRight?: boolean;
  rounded?: boolean;
  fluid?: boolean;
  /** Ziel für Navigation; dann <a> statt <button>. */
  href?: string;
};

export function AppButton({
  label,
  children,
  variant = "primary",
  mode = "filled",
  size = "normal",
  icon: Icon,
  iconRight = false,
  rounded = false,
  fluid = false,
  className = "",
  type = "button",
  href,
  ...rest
}: AppButtonProps) {
  const content = label ?? children;
  const iconOnly = !content && Icon;
  const iconSize = size === "small" ? 16 : 20;

  let skin: string;
  if (mode === "outlined") {
    skin = `bg-transparent ${accent(variant)} ${variant === "primary" ? "border-primary-200" : "border-surface-200"}`;
  } else if (mode === "text") {
    skin = `bg-transparent border-transparent ${accent(variant)}`;
  } else {
    skin = filled[variant];
  }

  const shape = iconOnly ? "size-10 p-0" : `${sizes[size]} gap-2`;
  const radius = rounded ? "rounded-full" : "rounded-ui-sm";

  const cls = `relative inline-flex shrink-0 cursor-pointer select-none items-center justify-center overflow-hidden border font-medium transition-colors duration-(--ui-duration) disabled:cursor-not-allowed disabled:opacity-60 ${shape} ${radius} ${skin} ${fluid ? "w-full" : ""} ${className}`;
  const inner = (
    <>
      {Icon && !iconRight ? <Icon size={iconSize} aria-hidden="true" /> : null}
      {content}
      {Icon && iconRight ? <Icon size={iconSize} aria-hidden="true" /> : null}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cls} aria-label={rest["aria-label"]}>
        {inner}
      </Link>
    );
  }

  return (
    <button type={type} className={cls} {...rest}>
      {inner}
    </button>
  );
}
