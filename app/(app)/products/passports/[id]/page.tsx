import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AppCard } from "@/components/ui/AppCard";
import { getPassport, getPassports } from "@/lib/dpp/passports";

/**
 * Zwischenstand bis Schritt 4 (Pass-Editor), damit der Klick im Portfolio nicht ins Leere führt.
 */
type Props = { params: Promise<{ id: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getPassports().map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const pass = getPassport((await params).id);
  return { title: pass ? `${pass.productName} – Code Gaia (Prototyp)` : "Code Gaia (Prototyp)" };
}

export default async function PassportEditorPlaceholder({ params }: Props) {
  const pass = getPassport((await params).id);
  if (!pass) notFound();

  return (
    <>
      <header className="sticky top-0 z-10 flex h-(--ui-header-height) shrink-0 items-center border-b border-ui-border-hairline bg-ui-surface px-4">
        <Link
          href="/products/passports"
          className="inline-flex items-center gap-2 rounded-ui-sm px-3 py-2 font-medium text-surface-600 hover:bg-primary-50"
        >
          <ArrowLeft size={20} aria-hidden="true" />
          Zurück
        </Link>
      </header>
      <main className="flex flex-1 flex-col gap-8 p-8">
        <h1 className="text-xl font-bold leading-tight text-ui-text-strong">{pass.productName}</h1>
        <AppCard className="flex-1 items-center justify-center p-8 text-center">
          <p className="text-lg font-bold text-ui-text-strong">Der Pass-Editor folgt in Schritt 4.</p>
        </AppCard>
      </main>
    </>
  );
}
