import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AppHeader } from "@/components/shell/AppHeader";
import { PassportTitle } from "@/components/dpp/PassportTitle";
import { PassEditor } from "@/components/dpp/editor/PassEditor";
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
  return { title: pass ? `${pass.productName} – Pass-Editor – Code Gaia (Prototyp)` : "Code Gaia (Prototyp)" };
}

/** Pass-Editor (SPEC §6.2). */
export default async function PassportEditorPage({ params }: Props) {
  const pass = getPassport((await params).id);
  if (!pass) notFound();

  return (
    <>
      <AppHeader backHref="/products/passports" tabs={passportTabs(pass.id)} tabsLabel="Bereiche Produktpass" />
      <main className="flex flex-1 flex-col gap-8 p-8">
        <PassportTitle pass={pass} />
        <Suspense fallback={<LoadingSkeleton />}>
          <PassEditor pass={pass} meta={buildFieldMeta(pass)} />
        </Suspense>
      </main>
    </>
  );
}

function LoadingSkeleton() {
  return (
    <div role="status" aria-label="Editor wird geladen" className="grid gap-4 xl:grid-cols-[16rem_minmax(0,1fr)_20rem]">
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-96 animate-pulse rounded-ui-xl border border-ui-border bg-surface-100" />
      ))}
    </div>
  );
}
