import { FileQuestion } from "lucide-react";

/** Pass ohne veröffentlichte Version oder unbekannte DPP-ID (SPEC §5): öffentlich nicht erreichbar. */
export default function PassportNotFound() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col items-center justify-center gap-4 px-4 py-8 text-center">
      <FileQuestion size={32} aria-hidden="true" className="text-ui-text-muted" />
      <h1 className="text-xl font-bold text-ui-text-strong">Produktpass nicht gefunden</h1>
      <p className="text-ui-text">Zu dieser Adresse gibt es keinen veröffentlichten Produktpass.</p>
      <p lang="en" className="text-ui-text-muted">
        No published product passport exists at this address.
      </p>
    </main>
  );
}
