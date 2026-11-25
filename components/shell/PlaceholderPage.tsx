import type { NavItem } from "@/lib/navigation";
import { AppCard } from "@/components/ui/AppCard";
import { AppHeader } from "./AppHeader";

/** Platzhalter für alle Module außer DPP: Kopfzeile wie im Original, darunter ein leerer Zustand (SPEC §4). */
export function PlaceholderPage({ item }: { item: NavItem }) {
  const tabs = item.tabs ?? [{ label: item.label, href: item.href }];

  return (
    <>
      <AppHeader tabs={tabs} tabsLabel={`Bereiche ${item.label}`} />
      <main className="flex flex-1 flex-col gap-8 p-8">
        <h1 className="text-xl font-bold leading-tight text-ui-text-strong">{item.label}</h1>
        <AppCard className="flex-1 items-center justify-center p-8 text-center">
          <p className="text-lg font-bold text-ui-text-strong">Dieses Modul ist im Prototyp nicht ausgebaut.</p>
        </AppCard>
      </main>
    </>
  );
}
