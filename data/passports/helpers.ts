import type { AccessLevel, DataElement, ElementState, ElementValue, Granularity, SourceRef } from "../../lib/dpp/types.ts";

/** Kurzschreibweisen für Demo-Daten. Keine Fachlogik. */

export const H = "cg-espr-horizontal";
export const TEX = "cg-textile-apparel-jrc-2026-05";
export const VOL = "cg-voluntary";

export const sv = (value: string): ElementValue => ({ kind: "SingleValued", value });
export const mv = (...values: string[]): ElementValue => ({ kind: "MultiValued", values });
export const ml = (de: string, en?: string): ElementValue => ({ kind: "MultiLanguage", values: en ? { de, en } : { de } });
export const file = (label: string, href: string): ElementValue => ({ kind: "RelatedResource", label, href });

export function el(
  templateId: string,
  key: string,
  value: ElementValue | null,
  state: ElementState,
  accessLevel: AccessLevel,
  source: SourceRef,
  inheritedFrom?: Granularity,
): DataElement {
  return { elementId: `${templateId}/${key}`, templateId, key, value, state, accessLevel, source, ...(inheritedFrom ? { inheritedFrom } : {}) };
}

/** Kopie eines Stands mit geänderten Elementen (für ältere Versionen). */
export function patch(elements: DataElement[], changes: Record<string, Pick<DataElement, "value" | "state">>): DataElement[] {
  return elements.map((e) => (changes[e.elementId] ? { ...e, ...changes[e.elementId] } : e));
}
