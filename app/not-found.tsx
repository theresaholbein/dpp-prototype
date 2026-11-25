import { FileQuestion } from "lucide-react";
import { AppButton } from "@/components/ui/AppButton";

/** Unbekannte Adresse in der App (Design Bible J): deutscher Leerzustand mit Weg zurück. */
export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col items-center justify-center gap-4 p-8 text-center">
      <FileQuestion size={32} aria-hidden="true" className="text-ui-text-muted" />
      <h1 className="text-xl font-bold text-ui-text-strong">Seite nicht gefunden</h1>
      <p className="text-ui-text">Zu dieser Adresse gibt es im Prototyp keine Seite.</p>
      <AppButton href="/products/passports" label="Zu den Produktpässen" />
    </main>
  );
}
