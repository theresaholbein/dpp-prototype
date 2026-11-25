"use client";

import { RotateCcw } from "lucide-react";
import { useRef } from "react";
import { AppButton } from "@/components/ui/AppButton";
import { useToast } from "@/components/ui/Toast";
import { resetDemo } from "@/lib/dpp/use-working-copy";

/**
 * „Demo zurücksetzen“ (Entscheidung 25.11.2026): verwirft alle Browser-Daten der Demo.
 * Folgenreich, daher Bestätigung mit konkretem Text (Design Bible I). Nativer <dialog>: Fokus und Escape vom Browser.
 */
export function ResetDemoButton({ onReset }: { onReset?: () => void } = {}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const { showToast, toastRegion } = useToast();

  const confirm = () => {
    dialog.current?.close();
    if (resetDemo()) {
      showToast("Demo zurückgesetzt");
      onReset?.();
    }
    else showToast("Zurücksetzen nicht möglich: Der Browser erlaubt keinen Zugriff auf den lokalen Speicher.", "error");
  };

  return (
    <>
      <AppButton variant="secondary" mode="text" size="small" icon={RotateCcw} label="Demo zurücksetzen" onClick={() => dialog.current?.showModal()} />
      <dialog
        ref={dialog}
        aria-labelledby="reset-title"
        aria-describedby="reset-text"
        className="m-auto w-full max-w-md rounded-ui-xl border border-ui-border bg-ui-surface p-6 text-ui-text"
      >
        <div className="flex flex-col gap-4">
          <h2 id="reset-title" className="text-lg font-medium text-ui-text-strong">
            Demo zurücksetzen?
          </h2>
          <p id="reset-text">
            Alle Änderungen dieser Demo in diesem Browser werden verworfen. T-Shirt und Sessel stehen danach wieder auf dem Ausgangsstand.
          </p>
          <div className="flex justify-end gap-2">
            <AppButton variant="secondary" label="Abbrechen" onClick={() => dialog.current?.close()} autoFocus />
            <AppButton variant="danger" label="Zurücksetzen" onClick={confirm} />
          </div>
        </div>
      </dialog>
      {toastRegion}
    </>
  );
}
