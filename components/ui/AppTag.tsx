import type { HTMLAttributes, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

/**
 * Port von docs/design-system/components/AppTag.jsx.
 * Abweichung (Design Bible D, Kontrast ≥ 4,5:1 für Text): warn mit surface-700 statt yellow (2,2:1),
 * success mit green-dark statt green (3,2:1).
 */
export type TagSeverity = "primary" | "success" | "info" | "warn" | "danger" | "secondary" | "contrast";

const severities: Record<TagSeverity, string> = {
  primary: "bg-blue-soft-btn text-primary-500",
  success: "bg-green-light text-green-dark",
  info: "bg-blue-100 text-blue-700",
  warn: "bg-yellow-light text-surface-700",
  danger: "bg-pink-light text-red-110",
  secondary: "bg-surface-100 text-surface-600",
  contrast: "bg-surface-950 text-surface-0",
};

export type AppTagProps = HTMLAttributes<HTMLSpanElement> & {
  value?: ReactNode;
  severity?: TagSeverity;
  icon?: LucideIcon;
  rounded?: boolean;
};

export function AppTag({ value, children, severity = "primary", icon: Icon, rounded = false, className = "", ...rest }: AppTagProps) {
  return (
    <span
      className={`inline-flex w-fit items-center justify-center gap-1 px-2 py-1 text-sm ${rounded ? "rounded-full" : "rounded-ui-sm"} ${severities[severity]} ${className}`}
      {...rest}
    >
      {Icon ? <Icon size={14} aria-hidden="true" /> : null}
      {value ?? children}
    </span>
  );
}
