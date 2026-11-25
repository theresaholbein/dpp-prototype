import type { HTMLAttributes, ReactNode } from "react";

/** Port von docs/design-system/components/AppCard.jsx (ohne Schatten, Design Bible D). */
export type AppCardProps = Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
  title?: ReactNode;
  subtitle?: ReactNode;
  footer?: ReactNode;
  active?: boolean;
};

export function AppCard({ title, subtitle, footer, active = false, children, className = "", ...rest }: AppCardProps) {
  return (
    <div
      className={`flex flex-col gap-2 rounded-ui-xl border p-5 text-ui-text ${active ? "border-primary-500 bg-primary-50" : "border-ui-border bg-ui-surface"} ${className}`}
      {...rest}
    >
      {title ? <div className="text-xl font-medium text-ui-text-strong">{title}</div> : null}
      {subtitle ? <div className="text-ui-text-muted">{subtitle}</div> : null}
      {children}
      {footer ? <div className="mt-2">{footer}</div> : null}
    </div>
  );
}
