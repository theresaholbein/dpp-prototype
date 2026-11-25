import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";

/**
 * Port von docs/design-system/components/AppInput.jsx (AppInput, AppField), ohne Schatten (Design Bible D).
 * Abweichungen: Fehlertext in red-110 statt pink (Kontrast für kleine Schrift);
 * Rand surface-500 statt surface-300 (1,5:1), Hover surface-600 (Design Bible D, ≥ 3:1).
 * AppSelect: natives Auswahlfeld im selben Stil (nicht im Design System).
 */
const base =
  "w-full rounded-ui-sm border bg-surface-0 px-3 py-2 text-base text-surface-700 outline-none transition-colors duration-(--ui-duration) hover:border-surface-600 focus:border-primary-500 disabled:bg-surface-200 disabled:text-surface-500";

function border(invalid?: boolean) {
  return invalid ? "border-red-110" : "border-surface-500";
}

export function AppInput({ invalid, className = "", ...rest }: InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) {
  return <input aria-invalid={invalid || undefined} className={`${base} ${border(invalid)} ${className}`} {...rest} />;
}

export function AppSelect({ invalid, className = "", ...rest }: SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean }) {
  return <select aria-invalid={invalid || undefined} className={`cursor-pointer ${base} ${border(invalid)} ${className}`} {...rest} />;
}

type FieldProps = { label: ReactNode; hint?: ReactNode; error?: ReactNode; htmlFor: string; hintId?: string; children: ReactNode };

/** Label über dem Feld, darunter Fehler (inline, Design Bible J) oder Hinweis. */
export function AppField({ label, hint, error, htmlFor, hintId, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={htmlFor} className="text-sm font-medium text-ui-text">
        {label}
      </label>
      {children}
      {error ? (
        <span id={hintId} className="text-xs text-red-110">
          {error}
        </span>
      ) : hint ? (
        <span id={hintId} className="text-xs text-ui-text-muted">
          {hint}
        </span>
      ) : null}
    </div>
  );
}
