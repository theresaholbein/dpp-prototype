import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

/** Kartenkopf: Icon und größere, fettere Schrift als der Karteninhalt (Design Bible F). */
export function CardHeading({ icon: Icon, id, level = 2, children }: { icon: LucideIcon; id?: string; level?: 2 | 3; children: ReactNode }) {
  const Tag = level === 2 ? "h2" : "h3";
  return (
    <Tag id={id} className="flex items-center gap-2 text-lg font-medium text-ui-text-strong">
      <Icon size={20} aria-hidden="true" className="shrink-0 text-primary-500" />
      <span className="min-w-0 break-words">{children}</span>
    </Tag>
  );
}
