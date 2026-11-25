import type { Passport, SourceRef } from "../../lib/dpp/types.ts";
import { H, TEX, VOL, doc, el, file, ml, patch, sv } from "./helpers.ts";

/**
 * Demo-Pass T-Shirt (fiktiv). EN-Texte sind fiktive Demo-Übersetzungen. Werte, Quellen, Zustände und Zugriffsebenen aus FIELDS im Mockup,
 * Versionen aus VERS, Unterschied Arbeitsstand ↔ v3 aus DIFF (SPEC §5).
 */

const PRODUCTS: SourceRef = { module: "products", dataset: "Stammdaten TS-1042", version: "2026-11-05" };
const PCF: SourceRef = { module: "pcf", dataset: "PCF TS-1042 Charge L2026-114", version: "Berechnung 3" };
const PCF_OLD: SourceRef = { module: "pcf", dataset: "PCF TS-1042 Charge L2026-114", version: "Berechnung 2" };
const SUPPLIER: SourceRef = { module: "supplier", dataset: "Lieferantenfragebogen Muster Textil GmbH", version: "03/2026" };
const MANUAL: SourceRef = { module: "manual" };
/** Pflegeanleitung: Produktdateien im Modul Produkte (Entscheidung 25.11.2026). */
const PRODUCT_FILES: SourceRef = { module: "products", dataset: "Produktdateien TS-1042", version: "2026-10-20" };

/** Vererbung Modell → Charge: Demo-Vorschlag, nicht belegt (SPEC „Offen aus dem Bau“). */
const MODEL = "model" as const;

const WORKING = [
  el(H, "upi", sv("https://id.muster-textil.example/01/04012345000017/10/L2026-114"), "present", "public", PRODUCTS),
  el(H, "granularity", ml("Charge (Batch L2026-114)", "Batch (L2026-114)"), "present", "public", MANUAL),
  el(H, "gtin", sv("04012345000017 · TS-1042"), "present", "public", PRODUCTS, MODEL),
  el(H, "hsCode", null, "missing", "public", PRODUCTS, MODEL),
  el(H, "manufacturer", sv("Muster Textil GmbH"), "present", "public", SUPPLIER, MODEL),
  el(H, "operatorId", null, "missing", "public", SUPPLIER),
  el(H, "facility", sv("Werk 2, Musterstadt"), "present", "authorized", SUPPLIER),
  el(TEX, "fibreComposition", ml("100 % Baumwolle (Bio)", "100 % cotton (organic)"), "present", "public", PRODUCTS, MODEL),
  el(TEX, "fibreOrigin", null, "missing", "public", SUPPLIER),
  el(TEX, "recycledContent", sv("0 %"), "outdated", "public", PRODUCTS),
  el(H, "substancesOfConcern", ml("Keine über 0,1 % (Erklärung 03/2026)", "None above 0.1 % (declaration 03/2026)"), "outdated", "public", SUPPLIER),
  el(H, "substanceList", file("TS-1042_Stoffe.pdf", "https://files.muster-textil.example/TS-1042_Stoffe.pdf"), "present", "authority", SUPPLIER),
  el(TEX, "pcf", ml("4,1 kg CO2e je Stück (ISO 14067)", "4.1 kg CO2e per item (ISO 14067)"), "present", "public", PCF),
  el(VOL, "waterUse", null, "missing", "authorized", MANUAL),
  el(H, "conformityDocs", null, "missing", "authority", MANUAL),
  el(H, "technicalDocs", file("TS-1042_TD.pdf", "https://files.muster-textil.example/TS-1042_TD.pdf"), "present", "authority", MANUAL),
  el(TEX, "careInstructions", ml("30 °C Feinwäsche, nicht trocknergeeignet", "30 °C delicate wash, do not tumble dry"), "present", "public", MANUAL, MODEL),
  el(TEX, "repairInstructions", null, "missing", "authorized", MANUAL),
  // Freiwillig, öffentlich; in allen Versionen enthalten (Entscheidung 25.11.2026). Platzhalter-PDF, fiktiv.
  el(
    VOL,
    "careGuide",
    doc("pflegeanleitung-ts-1042.pdf", "/demo/pflegeanleitung-ts-1042.pdf", { de: "Pflegeanleitung", en: "Care guide" }, "application/pdf", ["de", "en"]),
    "present",
    "public",
    PRODUCT_FILES,
  ),
];

const missing = { value: null, state: "missing" as const };

// v3 = Arbeitsstand ohne die drei DIFF-Änderungen.
const V3 = patch(WORKING, {
  [`${TEX}/pcf`]: { value: ml("4,4 kg CO2e je Stück", "4.4 kg CO2e per item"), state: "present" },
  [`${TEX}/careInstructions`]: missing,
  [`${H}/technicalDocs`]: missing,
}).map((e) => (e.elementId === `${TEX}/pcf` ? { ...e, source: PCF_OLD } : e));

// v2: älterer PCF-Wert. 🔴 Demo-Wert erfunden (SPEC „Offen aus dem Bau“).
const V2 = patch(V3, { [`${TEX}/pcf`]: { value: ml("4,8 kg CO2e je Stück", "4.8 kg CO2e per item"), state: "present" } });

// v1: Faserzusammensetzung kam erst mit v2 aus der Stückliste.
const V1 = patch(V2, { [`${TEX}/fibreComposition`]: missing });

export const TSHIRT: Passport = {
  id: "tshirt",
  dppId: "ts1042-l2026-114",
  productName: "Basic T-Shirt Bio-Baumwolle",
  productNameEn: "Basic T-shirt organic cotton",
  sku: "TS-1042",
  productGroup: "textile",
  granularity: "batch",
  templateIds: [H, TEX, VOL],
  workingCopy: { elements: WORKING, updatedAt: "2026-11-24T10:15:00+01:00" },
  publishedVersions: [
    {
      version: 1,
      publishedAt: "2026-10-28T11:00:00+01:00",
      actor: "Erika Muster",
      changedFields: [],
      note: "Pass angelegt (Template Textil)",
      previousVersion: null,
      dppStatus: "active",
      elements: V1,
    },
    {
      version: 2,
      publishedAt: "2026-11-05T09:30:00+01:00",
      actor: "Import Products",
      changedFields: [`${TEX}/fibreComposition`],
      note: "Faserzusammensetzung aus Stückliste übernommen",
      previousVersion: 1,
      dppStatus: "active",
      elements: V2,
    },
    {
      version: 3,
      publishedAt: "2026-11-18T14:45:00+01:00",
      actor: "Erika Muster",
      changedFields: [`${TEX}/pcf`],
      note: "PCF nach ISO 14067 neu berechnet",
      previousVersion: 2,
      dppStatus: "active",
      elements: V3,
    },
  ],
};
