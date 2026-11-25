import type { Passport, SourceRef } from "../../lib/dpp/types.ts";
import { H, VOL, el, file, ml, mv, sv } from "./helpers.ts";

/**
 * Demo-Pass Sessel (fiktiv). Möbel: nur „ESPR horizontal“ plus freiwillige Angaben,
 * noch keine veröffentlichte Version (SPEC §5).
 */

const PRODUCTS: SourceRef = { module: "products", dataset: "Stammdaten SE-220", version: "2026-11-10" };
const PCF: SourceRef = { module: "pcf", dataset: "PCF SE-220", version: "Berechnung 1" };
const SUPPLIER: SourceRef = { module: "supplier", dataset: "Lieferantenfragebogen Muster Möbelwerk GmbH", version: "09/2026" };
const MANUAL: SourceRef = { module: "manual" };

export const SESSEL: Passport = {
  id: "sessel",
  dppId: "se220",
  productName: "Sessel Lino",
  sku: "SE-220",
  productGroup: "furniture",
  granularity: "model",
  templateIds: [H, VOL],
  workingCopy: {
    updatedAt: "2026-11-12T16:20:00+01:00",
    elements: [
      el(H, "upi", sv("https://id.muster-moebel.example/01/04098765000021"), "present", "public", PRODUCTS),
      el(H, "granularity", sv("Modell"), "present", "public", MANUAL),
      el(H, "hsCode", null, "missing", "public", PRODUCTS),
      el(H, "manufacturer", sv("Muster Möbelwerk GmbH"), "present", "public", SUPPLIER),
      el(H, "operatorId", null, "missing", "public", SUPPLIER),
      el(H, "facility", null, "missing", "authorized", SUPPLIER),
      el(VOL, "mainMaterials", mv("Eiche massiv", "PU-Schaum", "Polyester-Bezug"), "present", "public", PRODUCTS),
      el(VOL, "recycledContent", null, "missing", "public", PRODUCTS),
      el(H, "substancesOfConcern", ml("Keine über 0,1 %", "None above 0.1 %"), "present", "public", SUPPLIER),
      el(H, "substanceList", null, "missing", "authority", SUPPLIER),
      el(VOL, "pcf", sv("86 kg CO2e je Stück (ISO 14067)"), "outdated", "public", PCF),
      el(H, "conformityDocs", null, "missing", "authority", MANUAL),
      el(VOL, "disassembly", file("SE-220_Demontage.pdf", "https://files.muster-moebel.example/SE-220_Demontage.pdf"), "present", "authorized", MANUAL),
    ],
  },
  publishedVersions: [],
};
