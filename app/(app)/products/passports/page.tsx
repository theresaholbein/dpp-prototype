import type { Metadata } from "next";
import { AppHeader } from "@/components/shell/AppHeader";
import { PortfolioView } from "@/components/dpp/PortfolioView";
import { AppCard } from "@/components/ui/AppCard";
import { getPortfolioKpis, getPortfolioRows } from "@/lib/dpp/portfolio";
import { PASSPORT_TABS } from "@/lib/navigation";

export const metadata: Metadata = { title: "Produktpässe – Code Gaia (Prototyp)" };

/** Portfolio aller Produktpässe (SPEC §6.1). */
export default function PassportPortfolioPage() {
  const rows = getPortfolioRows();
  const kpis = getPortfolioKpis(rows);
  const cards = [
    { label: "Produktpässe", value: String(kpis.total) },
    { label: "Veröffentlicht", value: String(kpis.published) },
    { label: "Im EU-Register", value: String(kpis.registered) },
    { label: "Ø Pflichtfelder", value: `${kpis.avgReadiness} %` },
  ];

  return (
    <>
      <AppHeader tabs={PASSPORT_TABS} tabsLabel="Bereiche Produktpässe" />
      <main className="flex flex-1 flex-col gap-8 p-8">
        <h1 className="text-xl font-bold leading-tight text-ui-text-strong">Produktpässe</h1>
        <section aria-label="Kennzahlen" className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {cards.map((c) => (
            <AppCard key={c.label}>
              <span className="text-sm text-ui-text-muted">{c.label}</span>
              <span className="text-2xl font-medium text-ui-text-strong tabular-nums">{c.value}</span>
            </AppCard>
          ))}
        </section>
        <PortfolioView rows={rows} />
      </main>
    </>
  );
}
