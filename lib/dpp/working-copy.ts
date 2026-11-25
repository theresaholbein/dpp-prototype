import { GRANULARITY_LABEL } from "./labels.ts";
import type { DataElement, ElementValue, Granularity } from "./types.ts";

/**
 * Arbeitsstand im Browser (SPEC §3): gespeichert werden nur Änderungen an manuellen Feldern,
 * nicht der ganze Pass. Reine Funktionen, ohne Zugriff auf localStorage (siehe use-working-copy.ts).
 */

/** Gemeinsames Präfix aller Browser-Schlüssel der Demo. „Demo zurücksetzen“ löscht alles damit. */
export const STORAGE_PREFIX = "dpp-prototype:";

export function editsKey(passId: string): string {
  return `${STORAGE_PREFIX}edits:${passId}`;
}

/** Im Browser veröffentlichte Versionen eines Passes (nur angehängt, nie verändert). */
export function versionsKey(passId: string): string {
  return `${STORAGE_PREFIX}published:${passId}`;
}

/** elementId → neuer Wert (null = Wert entfernt). */
export type Edits = Record<string, { value: ElementValue | null }>;

export function isEmptyValue(value: ElementValue | null): boolean {
  if (!value) return true;
  switch (value.kind) {
    case "SingleValued":
      return value.value.trim() === "";
    case "MultiValued":
      return value.values.every((v) => v.trim() === "");
    case "MultiLanguage":
      return Object.values(value.values).every((v) => !v || v.trim() === "");
    case "RelatedResource":
      return value.href.trim() === "" && value.label.trim() === "";
    case "Collection":
      return value.elements.length === 0;
  }
}

/** Arbeitsstand = Demo-Daten + Änderungen. Bearbeitet heißt: Wert da → „vorhanden“, leer → „fehlt“. */
export function applyEdits(elements: DataElement[], edits: Edits): DataElement[] {
  return elements.map((e) => {
    const edit = edits[e.elementId];
    if (!edit) return e;
    const empty = isEmptyValue(edit.value);
    return { ...e, value: empty ? null : edit.value, state: empty ? "missing" : "present" };
  });
}

export const GRANULARITY_KEY = "granularity";

/**
 * Bearbeitbar sind nur manuell gepflegte Felder; Fachdaten aus anderen Modulen schreibt der DPP nicht zurück (SPEC §5).
 * Die Granularität ist nach der ersten Veröffentlichung fest (EN 18219, SPEC §5; Entscheidung 25.11.2026).
 */
export type Editability = "editable" | "granularity-locked" | "external";

export function editability(element: DataElement, hasPublishedVersion: boolean): Editability {
  if (element.source.module !== "manual") return "external";
  if (element.key === GRANULARITY_KEY && hasPublishedVersion) return "granularity-locked";
  return "editable";
}

/** Ebene aus dem Wert des Felds „Granularität“, z. B. „Charge (Batch L2026-114)“ → batch. */
export function granularityFromValue(value: ElementValue | null): Granularity | null {
  if (!value || value.kind !== "SingleValued") return null;
  const match = (Object.entries(GRANULARITY_LABEL) as [Granularity, string][]).find(([, label]) => value.value.startsWith(label));
  return match ? match[0] : null;
}
