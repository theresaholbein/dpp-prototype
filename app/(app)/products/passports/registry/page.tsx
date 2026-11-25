import type { Metadata } from "next";
import { AppHeader } from "@/components/shell/AppHeader";
import { RegistryExportView } from "@/components/dpp/RegistryExportView";
import { PASS_SUMMARIES } from "@/data/passports/summaries";
import { getPassports } from "@/lib/dpp/passports";
import { PASSPORT_TABS } from "@/lib/navigation";

export const metadata: Metadata = { title: "Registry & Export – Code Gaia (Prototyp)" };

/** Registry-Export (SPEC §6.5, §8). */
export default function RegistryExportPage() {
  return (
    <>
      <AppHeader tabs={PASSPORT_TABS} tabsLabel="Bereiche Produktpässe" />
      <main className="flex flex-1 flex-col gap-8 p-8">
        <h1 className="text-xl font-bold leading-tight text-ui-text-strong">Registry &amp; Export</h1>
        <RegistryExportView passports={getPassports()} summaries={PASS_SUMMARIES} />
      </main>
    </>
  );
}
