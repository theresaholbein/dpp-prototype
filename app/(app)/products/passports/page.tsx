import type { Metadata } from "next";
import { AppHeader } from "@/components/shell/AppHeader";
import { PortfolioView } from "@/components/dpp/PortfolioView";
import { getPassports } from "@/lib/dpp/passports";
import { getPortfolioRows } from "@/lib/dpp/portfolio";
import { PASSPORT_TABS } from "@/lib/navigation";

export const metadata: Metadata = { title: "Produktpässe – Code Gaia (Prototyp)" };

/** Portfolio aller Produktpässe (SPEC §6.1). */
export default function PassportPortfolioPage() {
  const rows = getPortfolioRows();

  return (
    <>
      <AppHeader tabs={PASSPORT_TABS} tabsLabel="Bereiche Produktpässe" />
      <main className="flex flex-1 flex-col gap-8 p-8">
        <h1 className="text-xl font-bold leading-tight text-ui-text-strong">Produktpässe</h1>
        <PortfolioView rows={rows} passports={getPassports()} />
      </main>
    </>
  );
}
