import type { ProductGroup } from "../lib/dpp/types.ts";

/** Kernangabe der öffentlichen Passseite: Datenelement und kurzes Label je Sprache. Gezeigt nur, wenn öffentlich und vorhanden. */
export type KeyFact = { elementId: string; label: { de: string; en: string } };

/**
 * Produktgruppen: Template-Label für Tabellen und Banner (Wortlaut SPEC §5, nicht rechtsverbindlich)
 * und Kernangaben der öffentlichen Passseite (Auswahl nach Mockup, keine Rechtsvorgabe).
 */
export const PRODUCT_GROUPS: Record<ProductGroup, { label: string; templateLabel: string; banner: string; keyFacts: KeyFact[] }> = {
  textile: {
    keyFacts: [
      { elementId: "cg-textile-apparel-jrc-2026-05/fibreComposition", label: { de: "Material", en: "Material" } },
      { elementId: "cg-textile-apparel-jrc-2026-05/pcf", label: { de: "CO2e-Fußabdruck", en: "Carbon footprint" } },
      { elementId: "cg-textile-apparel-jrc-2026-05/careInstructions", label: { de: "Pflege", en: "Care" } },
      { elementId: "cg-espr-horizontal/manufacturer", label: { de: "Hergestellt von", en: "Made by" } },
    ],
    label: "Textil",
    templateLabel: "Textil Bekleidung (JRC-Entwurf 05/2026)",
    banner:
      "Textil: Datenpunkte nach JRC-Vorschlag vom 13.05.2026. Der delegierte Rechtsakt steht noch aus – Felder sind nicht rechtsverbindlich.",
  },
  furniture: {
    keyFacts: [
      { elementId: "cg-voluntary/mainMaterials", label: { de: "Material", en: "Material" } },
      { elementId: "cg-voluntary/pcf", label: { de: "CO2e-Fußabdruck", en: "Carbon footprint" } },
      { elementId: "cg-espr-horizontal/manufacturer", label: { de: "Hergestellt von", en: "Made by" } },
    ],
    label: "Möbel",
    templateLabel: "ESPR horizontal",
    banner:
      "Möbel: Delegierter Rechtsakt erst für 2028 geplant. Template nutzt nur horizontale Angaben – nicht rechtsverbindlich.",
  },
};
