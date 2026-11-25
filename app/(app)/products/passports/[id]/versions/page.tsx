import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AppHeader } from "@/components/shell/AppHeader";
import { PassportTitle } from "@/components/dpp/PassportTitle";
import { VersionsView } from "@/components/dpp/VersionsView";
import { buildFieldMeta } from "@/lib/dpp/editor";
import { getPassport, getPassports } from "@/lib/dpp/passports";
import { passportTabs } from "@/lib/navigation";

type Props = { params: Promise<{ id: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getPassports().map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const pass = getPassport((await params).id);
  return { title: pass ? `${pass.productName} – Versionen – Code Gaia (Prototyp)` : "Code Gaia (Prototyp)" };
}

/** Versionen (SPEC §6.6). */
export default async function VersionsPage({ params }: Props) {
  const pass = getPassport((await params).id);
  if (!pass) notFound();

  return (
    <>
      <AppHeader backHref="/products/passports" tabs={passportTabs(pass.id)} tabsLabel="Bereiche Produktpass" />
      <main className="flex flex-1 flex-col gap-8 p-8">
        <PassportTitle pass={pass} />
        <Suspense fallback={<div role="status" aria-label="Versionen werden geladen" className="h-96 motion-safe:animate-pulse rounded-ui-xl border border-ui-border bg-surface-100" />}>
          <VersionsView pass={pass} meta={buildFieldMeta(pass)} />
        </Suspense>
      </main>
    </>
  );
}
