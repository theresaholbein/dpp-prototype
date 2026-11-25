import { ArrowLeft, FileText, GraduationCap, SquareCheckBig, StickyNote } from "lucide-react";
import type { HeaderTab } from "@/lib/navigation";
import { AppButton } from "@/components/ui/AppButton";
import { Tooltip } from "@/components/ui/Tooltip";
import { HeaderTabs } from "./HeaderTabs";

/** Kopfzeile: links „Zurück“ (Detailseiten) und Tab-Gruppe, rechts vier Icon-Buttons ohne Funktion (SPEC §4, §6.2). */
const TOOLS = [
  { label: "Aufgaben", icon: SquareCheckBig },
  { label: "Notizen", icon: StickyNote },
  { label: "Dateibibliothek", icon: FileText },
  { label: "Lernen", icon: GraduationCap },
];

type Props = { tabs: HeaderTab[]; tabsLabel: string; backHref?: string };

export function AppHeader({ tabs, tabsLabel, backHref }: Props) {
  return (
    <header className="sticky top-0 z-10 flex h-(--ui-header-height) shrink-0 items-center justify-between gap-4 border-b border-ui-border-hairline bg-ui-surface px-4">
      <div className="flex min-w-0 items-center gap-4">
        {backHref ? (
          <AppButton href={backHref} variant="tertiary" icon={ArrowLeft} label="Zurück" />
        ) : null}
        <HeaderTabs tabs={tabs} label={tabsLabel} />
      </div>
      <div className="flex items-center gap-2">
        {TOOLS.map(({ label, icon }) => (
          <Tooltip key={label} label={label} placement="bottom-end">
            <AppButton variant="tertiary" icon={icon} aria-label={label} />
          </Tooltip>
        ))}
      </div>
    </header>
  );
}
