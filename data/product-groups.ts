import type { ProductGroup } from "../lib/dpp/types.ts";

/** Produktgruppen: Template-Label für Tabellen und Banner (Wortlaut SPEC §5, nicht rechtsverbindlich). */
export const PRODUCT_GROUPS: Record<ProductGroup, { label: string; templateLabel: string; banner: string }> = {
  textile: {
    label: "Textil",
    templateLabel: "Textil Bekleidung (JRC-Entwurf 05/2026)",
    banner:
      "Textil: Datenpunkte nach JRC-Vorschlag vom 13.05.2026. Der delegierte Rechtsakt steht noch aus – Felder sind nicht rechtsverbindlich.",
  },
  furniture: {
    label: "Möbel",
    templateLabel: "ESPR horizontal",
    banner:
      "Möbel: Delegierter Rechtsakt erst für 2028 geplant. Template nutzt nur horizontale Angaben – nicht rechtsverbindlich.",
  },
};
