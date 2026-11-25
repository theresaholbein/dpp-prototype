import type { HTMLAttributes, ReactNode } from "react";

/**
 * Port von docs/design-system/components/AppCard.jsx (ohne Schatten, Design Bible D).
 * Abweichung: Padding p-4 bzw. p-8 statt 1.25rem (Skala 2/4/8/6, Design Bible E), wie im Template als Prop.
 */
export type AppCardProps = Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
  title?: ReactNode;
  subtitle?: ReactNode;
  footer?: ReactNode;
  active?: boolean;
  padding?: "normal" | "large";
};

export function AppCard({ title, subtitle, footer, active = false, padding = "normal", children, className = "", ...rest }: AppCardProps) {
  return (
    <div
      className={`flex flex-col gap-2 rounded-ui-xl border text-ui-text ${padding === "large" ? "p-8" : "p-4"} ${active ? "border-primary-500 bg-primary-50" : "border-ui-border bg-ui-surface"} ${className}`}
      {...rest}
    >
      {title ? <div className="text-xl font-medium text-ui-text-strong">{title}</div> : null}
      {subtitle ? <div className="text-ui-text-muted">{subtitle}</div> : null}
      {children}
      {footer ?? null}
    </div>
  );
}
