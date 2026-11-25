"use client";

import { RotateCcw } from "lucide-react";
import { AppButton } from "@/components/ui/AppButton";
import { AppCard } from "@/components/ui/AppCard";
import { AppMessage } from "@/components/ui/AppMessage";

/** Fehlerzustand der App-Seiten (Design Bible J, SPEC §9): Sidebar bleibt, Inhalt zeigt Meldung und Neuversuch. */
export default function AppError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="flex flex-1 flex-col gap-8 p-8">
      <h1 className="text-xl font-bold leading-tight text-ui-text-strong">Seite konnte nicht geladen werden</h1>
      <AppCard padding="large" className="items-start">
        <AppMessage severity="error" role="alert">
          Beim Anzeigen dieser Seite ist ein Fehler aufgetreten. Deine Änderungen in diesem Browser bleiben erhalten.
        </AppMessage>
        <AppButton icon={RotateCcw} label="Erneut versuchen" onClick={reset} />
      </AppCard>
    </main>
  );
}
