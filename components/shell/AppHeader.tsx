import { FileText, GraduationCap, SquareCheckBig, StickyNote } from "lucide-react";
import type { HeaderTab } from "@/lib/navigation";
import { AppButton } from "@/components/ui/AppButton";
import { Tooltip } from "@/components/ui/Tooltip";
import { HeaderTabs } from "./HeaderTabs";

/** Kopfzeile: links Tab-Gruppe, rechts vier Icon-Buttons ohne Funktion (SPEC §4). */
const TOOLS = [
  { label: "Aufgaben", icon: SquareCheckBig },
  { label: "Notizen", icon: StickyNote },
  { label: "Dateibibliothek", icon: FileText },
  { label: "Lernen", icon: GraduationCap },
];

export function AppHeader({ tabs, tabsLabel }: { tabs: HeaderTab[]; tabsLabel: string }) {
  return (
    <header className="sticky top-0 z-10 flex h-(--ui-header-height) shrink-0 items-center justify-between gap-4 border-b border-ui-border-hairline bg-ui-surface px-4">
      <HeaderTabs tabs={tabs} label={tabsLabel} />
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
