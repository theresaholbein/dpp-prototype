"use client";

import { RotateCcw } from "lucide-react";
import { ResetDemoButton } from "@/components/dpp/ResetDemoButton";
import { AppButton } from "@/components/ui/AppButton";
import { AppCard } from "@/components/ui/AppCard";
import { AppMessage } from "@/components/ui/AppMessage";

/**
 * Fehlerzustand der App-Seiten (Design Bible J, SPEC §9): Sidebar bleibt, Inhalt zeigt Meldung und Neuversuch.
 * `retry` lädt die Seite neu (auch Server-Komponenten), `reset` würde nur den Client-Baum neu rendern.
 * Lösen kaputte Browser-Daten den Fehler aus, hilft nur „Demo zurücksetzen“; danach wird neu geladen.
 */
export default function AppError({ retry }: { error: Error & { digest?: string }; reset: () => void; retry: () => void }) {
  return (
    <main className="flex flex-1 flex-col gap-8 p-8">
      <h1 className="text-xl font-bold leading-tight text-ui-text-strong">Seite konnte nicht geladen werden</h1>
      <AppCard padding="large" className="items-start">
        <AppMessage severity="error" role="alert">
          Beim Anzeigen dieser Seite ist ein Fehler aufgetreten. Tritt er erneut auf, kann das Zurücksetzen der Demo helfen; dabei gehen die Änderungen in diesem Browser verloren.
        </AppMessage>
        <div className="flex flex-wrap items-center gap-2">
          <AppButton icon={RotateCcw} label="Erneut versuchen" onClick={retry} />
          <ResetDemoButton onReset={retry} />
        </div>
      </AppCard>
    </main>
  );
}
