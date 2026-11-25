import type { HTMLAttributes, ReactNode } from "react";
import { CircleCheckBig, Info, OctagonAlert, TriangleAlert, type LucideIcon } from "lucide-react";

/**
 * Port von AppMessage aus docs/design-system/components/AppCard.jsx.
 * Abweichungen: Rand statt Outline; Info-Hintergrund primary-50 statt halbtransparentem Wert (nur Tokens);
 * bei „warn“ dunkler Text und nur das Icon in yellow-110, weil yellow-110 auf yellow-light zu wenig Kontrast für Text hat.
 */
export type MessageSeverity = "info" | "success" | "warn" | "error" | "secondary";

const tones: Record<MessageSeverity, { skin: string; iconColor?: string; icon: LucideIcon }> = {
  info: { skin: "bg-primary-50 border-primary-500 text-primary-600", icon: Info },
  success: { skin: "bg-green-light border-green text-green-dark", icon: CircleCheckBig },
  warn: { skin: "bg-yellow-light border-yellow text-surface-700", iconColor: "text-yellow-110", icon: OctagonAlert },
  error: { skin: "bg-red-10 border-red text-red-110", icon: TriangleAlert },
  secondary: { skin: "bg-surface-100 border-surface-500 text-surface-600", icon: Info },
};

export type AppMessageProps = HTMLAttributes<HTMLDivElement> & { severity?: MessageSeverity; children: ReactNode };

export function AppMessage({ severity = "info", children, className = "", ...rest }: AppMessageProps) {
  const { skin, iconColor = "", icon: Icon } = tones[severity];
  return (
    <div className={`flex items-start gap-2 rounded-ui-sm border px-3 py-2 ${skin} ${className}`} {...rest}>
      <Icon size={18} aria-hidden="true" className={`mt-0.5 shrink-0 ${iconColor}`} />
      <span className="text-base">{children}</span>
    </div>
  );
}
