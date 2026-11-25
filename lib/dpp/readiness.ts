import { getTemplates, resolveRequirement } from "./templates.ts";
import type { DataElement, Readiness } from "./types.ts";

/**
 * Vollständigkeit nach SPEC §5: erfüllte Pflichtfelder / alle Pflichtfelder der aktiven Templates.
 * Erfüllt = Wert vorhanden; „veraltet“ zählt als erfüllt und zusätzlich als Warnung.
 * Optionale und freiwillige Felder zählen nicht. Einzige Stelle für diese Rechnung.
 */
export function computeReadiness(elements: DataElement[], templateIds: string[]): Readiness {
  const active = getTemplates(templateIds);
  const byId = new Map(elements.map((e) => [e.elementId, e]));

  let required = 0;
  let fulfilled = 0;
  let missing = 0;
  let outdated = 0;

  for (const template of active) {
    for (const field of template.fields) {
      if (resolveRequirement(template.id, field, active) !== "required") continue;
      required += 1;
      const el = byId.get(`${template.id}/${field.key}`);
      if (!el || el.value === null || el.state === "missing") {
        missing += 1;
        continue;
      }
      fulfilled += 1;
      if (el.state === "outdated") outdated += 1;
    }
  }

  const percent = required === 0 ? 100 : Math.round((fulfilled / required) * 100);
  return { required, fulfilled, missing, outdated, percent };
}
