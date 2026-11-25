"use client";

import { useCallback, useEffect, useState } from "react";
import { AppMessage, type MessageSeverity } from "./AppMessage";

/**
 * Minimaler Toast für allgemeine Meldungen (Design Bible J, nicht im Design System portiert).
 * Die Live-Region ist immer im DOM, damit Screenreader neue Meldungen ansagen.
 */
type Toast = { text: string; severity: MessageSeverity; id: number };

const DURATION_MS = 4000;

export function useToast() {
  const [toast, setToast] = useState<Toast | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), DURATION_MS);
    return () => window.clearTimeout(t);
  }, [toast]);

  const showToast = useCallback((text: string, severity: MessageSeverity = "success") => {
    setToast({ text, severity, id: Date.now() });
  }, []);

  const toastRegion = (
    <div aria-live="polite" role="status" className="fixed bottom-8 right-8 z-50">
      {toast ? (
        <AppMessage key={toast.id} severity={toast.severity}>
          {toast.text}
        </AppMessage>
      ) : null}
    </div>
  );

  return { showToast, toastRegion };
}
