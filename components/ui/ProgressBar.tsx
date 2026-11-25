/**
 * Fortschrittsbalken (nicht im Design System portiert), rein visuell neben einer Zahl.
 * Der Wert steht immer als Text daneben, daher aria-hidden.
 */
export function ProgressBar({ percent, className = "" }: { percent: number; className?: string }) {
  return (
    <span className={`block h-2 overflow-hidden rounded-full bg-surface-200 ${className}`} aria-hidden="true">
      <span className="block h-full rounded-full bg-primary-500" style={{ width: `${Math.max(0, Math.min(100, percent))}%` }} />
    </span>
  );
}
