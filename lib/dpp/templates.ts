import horizontal from "../../data/templates/espr-horizontal.json" with { type: "json" };
import textile from "../../data/templates/textile-apparel-jrc-2026-05.json" with { type: "json" };
import voluntary from "../../data/templates/cg-voluntary.json" with { type: "json" };
import type { DppTemplate, Requirement, TemplateField } from "./types.ts";

/** Versionierte Feldkataloge (SPEC §5). Im MVP alle Status "draft": nicht rechtsverbindlich. */
export const TEMPLATES: DppTemplate[] = [horizontal, textile, voluntary] as DppTemplate[];

export function getTemplate(id: string): DppTemplate | undefined {
  return TEMPLATES.find((t) => t.id === id);
}

export function getTemplates(ids: string[]): DppTemplate[] {
  return ids.map((id) => {
    const t = getTemplate(id);
    if (!t) throw new Error(`Unbekanntes Template: ${id}`);
    return t;
  });
}

/** Feld-Definition zu einem Datenelement. */
export function getField(templateId: string, key: string): TemplateField | undefined {
  return getTemplate(templateId)?.fields.find((f) => f.key === key);
}

/** Gültige Einstufung eines Felds: ein aktives Produktgruppen-Template darf es auf "required" hochstufen. */
export function resolveRequirement(templateId: string, field: TemplateField, active: DppTemplate[]): Requirement {
  const raised = active.some((t) => t.overrides?.some((o) => o.templateId === templateId && o.key === field.key));
  return raised ? "required" : field.requirement;
}

/** IDs für das Kopf-Feld contentSpecificationIds: ohne „Freiwillige Angaben“. */
export function contentSpecificationIds(templateIds: string[]): string[] {
  return getTemplates(templateIds)
    .filter((t) => t.kind !== "voluntary")
    .map((t) => `${t.id}@${t.version}`);
}
