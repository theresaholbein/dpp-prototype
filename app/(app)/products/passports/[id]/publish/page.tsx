import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppHeader } from "@/components/shell/AppHeader";
import { PassportTitle } from "@/components/dpp/PassportTitle";
import { PublishView } from "@/components/dpp/publish/PublishView";
import { buildFieldMeta } from "@/lib/dpp/editor";
import { getPassport, getPassports, passportUrl } from "@/lib/dpp/passports";
import { passportTabs } from "@/lib/navigation";

type Props = { params: Promise<{ id: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getPassports().map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const pass = getPassport((await params).id);
  return { title: pass ? `${pass.productName} – Veröffentlichen – Code Gaia (Prototyp)` : "Code Gaia (Prototyp)" };
}

/** Veröffentlichen und QR-Code (SPEC §6.4). */
export default async function PublishPage({ params }: Props) {
  const pass = getPassport((await params).id);
  if (!pass) notFound();

  return (
    <>
      <AppHeader backHref="/products/passports" tabs={passportTabs(pass.id)} tabsLabel="Bereiche Produktpass" />
      <main className="flex flex-1 flex-col gap-8 p-8">
        <PassportTitle pass={pass} />
        <PublishView pass={pass} meta={buildFieldMeta(pass)} publicUrl={passportUrl(pass.dppId)} />
      </main>
    </>
  );
}
