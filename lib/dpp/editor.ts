import { SECTION_ORDER } from "./labels.ts";
import { getField, getTemplate, getTemplates, resolveRequirement } from "./templates.ts";
import type { DataElement, ElementType, Passport, Requirement, SectionId } from "./types.ts";

/** Angaben aus dem Template je Datenelement, serialisierbar für den Editor (SPEC §6.2). */
export type FieldMeta = {
  elementId: string;
  label: string;
  section: SectionId;
  elementType: ElementType;
  /** Gültige Einstufung inkl. Override eines Produktgruppen-Templates. */
  requirement: Requirement;
  templateName: string;
  hint?: string;
};

export function buildFieldMeta(pass: Passport): Record<string, FieldMeta> {
  const active = getTemplates(pass.templateIds);
  const meta: Record<string, FieldMeta> = {};
  for (const e of pass.workingCopy.elements) {
    const field = getField(e.templateId, e.key);
    if (!field) throw new Error(`Feld ${e.elementId} fehlt im Template`);
    meta[e.elementId] = {
      elementId: e.elementId,
      label: field.label,
      section: field.section,
      elementType: field.elementType,
      requirement: resolveRequirement(e.templateId, field, active),
      templateName: getTemplate(e.templateId)?.name ?? e.templateId,
      ...(field.hint ? { hint: field.hint } : {}),
    };
  }
  return meta;
}

/** Datenelemente in der Reihenfolge der Template-Abschnitte; innerhalb eines Abschnitts wie in den Daten. */
export function sortBySection(elements: DataElement[], meta: Record<string, FieldMeta>): DataElement[] {
  const rank = (e: DataElement) => SECTION_ORDER.indexOf(meta[e.elementId]?.section ?? "instructions");
  return elements
    .map((e, i) => ({ e, i }))
    .sort((a, b) => rank(a.e) - rank(b.e) || a.i - b.i)
    .map(({ e }) => e);
}
