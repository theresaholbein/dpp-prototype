"use client";

/**
 * Umschalter mit wenigen Optionen (nicht im Design System portiert).
 * Gleiches Muster wie die Tab-Gruppe der Kopfzeile (HeaderTabs): umrandete Gruppe,
 * aktive Option hellblau mit blauem Rand. Buttons mit aria-pressed.
 */
type Option<T extends string> = { value: T; label: string };

type Props<T extends string> = {
  label: string;
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
};

export function SegmentedControl<T extends string>({ label, options, value, onChange }: Props<T>) {
  return (
    <div role="group" aria-label={label} className="flex w-fit gap-1 rounded-ui-lg border border-ui-border bg-ui-surface p-1">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(o.value)}
            className={`cursor-pointer rounded-ui-sm border px-3 py-1.5 text-base font-medium leading-tight transition-colors duration-(--ui-duration) ${
              active ? "border-primary-500 bg-ui-surface-selected text-primary-500" : "border-transparent text-gray-dark hover:bg-surface-100"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
