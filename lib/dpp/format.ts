import type { ElementValue } from "./types.ts";

const DATE = new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Europe/Berlin" });

/** „18.11.2026“ – feste Zeitzone, damit Server und Browser gleich rendern. */
export function formatDate(iso: string): string {
  return DATE.format(new Date(iso));
}

/** Anzeigetext eines Werts für Editor und Vorschau; null ohne Wert. */
export function formatValue(value: ElementValue | null): string | null {
  if (!value) return null;
  switch (value.kind) {
    case "SingleValued":
      return value.value;
    case "MultiValued":
      return value.values.join(", ");
    case "MultiLanguage":
      return value.values.de ?? value.values.en ?? null;
    case "RelatedResource":
      return value.label || value.href;
    case "Collection":
      return `${value.elements.length} Einträge`;
  }
}
