import type { ElementValue, Language } from "./types.ts";

const OPTIONS: Intl.DateTimeFormatOptions = { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Europe/Berlin" };
const DATE = new Intl.DateTimeFormat("de-DE", OPTIONS);
const DATE_EN = new Intl.DateTimeFormat("en-GB", OPTIONS);

/** „18.11.2026“ (bzw. „18/11/2026“ auf Englisch) – feste Zeitzone, damit Server und Browser gleich rendern. */
export function formatDate(iso: string, lang: Language = "de"): string {
  return (lang === "en" ? DATE_EN : DATE).format(new Date(iso));
}

/**
 * Text eines Werts in der gewählten Sprache. `lang` ist gesetzt, wenn der Text sprachabhängig ist
 * (MultiLanguage, Dokumenttitel); fehlt die Übersetzung, kommt der deutsche Text mit lang "de".
 */
export function localizeValue(value: ElementValue | null, lang: Language): { text: string; lang?: Language } | null {
  if (!value) return null;
  if (value.kind === "MultiLanguage") {
    const own = value.values[lang];
    if (own) return { text: own, lang };
    const fallback = value.values.de ?? value.values.en;
    return fallback ? { text: fallback, lang: value.values.de ? "de" : "en" } : null;
  }
  if (value.kind === "RelatedResource" && value.title) {
    const own = value.title[lang];
    if (own) return { text: own, lang };
    if (value.title.de) return { text: value.title.de, lang: "de" };
  }
  const text = formatValue(value);
  return text === null ? null : { text };
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
      return value.title?.de || value.label || value.href;
    case "Collection":
      return `${value.elements.length} Einträge`;
  }
}
