import type { AccessLevel, DataElement } from "./types.ts";

/** Simulierte Rollen der Rollen-Vorschau (SPEC §6.3). Texte aus ROLES im Mockup. Echte Rollen nach EN 18239 kommen später (SPEC §12). */
export type RoleId = "consumer" | "repair" | "authority";

export type Role = { id: RoleId; label: string; title: string; text: string; levels: AccessLevel[] };

export const ROLES: Role[] = [
  {
    id: "consumer",
    label: "Verbraucher",
    title: "Öffentliche Ansicht",
    text: "Was jede Person sieht, die den QR-Code scannt.",
    levels: ["public"],
  },
  {
    id: "repair",
    label: "Reparatur/Recycling",
    title: "Berechtigtes Interesse",
    text: "Zusätzliche Angaben für Reparaturbetriebe, Recycler und weitere berechtigte Akteure nach Anmeldung.",
    levels: ["public", "authorized"],
  },
  {
    id: "authority",
    label: "Marktüberwachung",
    title: "Behördenansicht",
    text: "Vollständiger Pass inklusive Konformitätsunterlagen für Marktüberwachung und Zoll.",
    levels: ["public", "authorized", "authority"],
  },
];

export function getRole(id: string | null | undefined): Role {
  return ROLES.find((r) => r.id === id) ?? ROLES[0];
}

/** Sichtbare Datenelemente einer Rolle und Anzahl der ausgeblendeten. */
export function filterForRole(elements: DataElement[], role: Role): { visible: DataElement[]; hiddenCount: number } {
  const visible = elements.filter((e) => role.levels.includes(e.accessLevel));
  return { visible, hiddenCount: elements.length - visible.length };
}
