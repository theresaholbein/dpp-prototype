import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AppHeader } from "@/components/shell/AppHeader";
import { PassportTitle } from "@/components/dpp/PassportTitle";
import { RolePreview } from "@/components/dpp/RolePreview";
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
  return { title: pass ? `${pass.productName} – Rollen-Vorschau – Code Gaia (Prototyp)` : "Code Gaia (Prototyp)" };
}

/** Rollen-Vorschau (SPEC §6.3). */
export default async function RolePreviewPage({ params }: Props) {
  const pass = getPassport((await params).id);
  if (!pass) notFound();

  return (
    <>
      <AppHeader backHref="/products/passports" tabs={passportTabs(pass.id)} tabsLabel="Bereiche Produktpass" />
      <main className="flex flex-1 flex-col gap-8 p-8">
        <PassportTitle pass={pass} />
        <Suspense fallback={<div role="status" aria-label="Vorschau wird geladen" className="h-96 animate-pulse rounded-ui-xl border border-ui-border bg-surface-100" />}>
          <RolePreview pass={pass} meta={buildFieldMeta(pass)} />
        </Suspense>
      </main>
    </>
  );
}
