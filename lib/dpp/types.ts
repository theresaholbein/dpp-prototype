/**
 * Datenmodell des Digitalen Produktpasses (SPEC §5).
 *
 * Codes sind englisch (für API und Engineering), deutsche Labels stehen in labels.ts.
 * Normbezüge: EN 18223 (Datenmodell), EN 18219 (Granularität), EN 18222 (Registry).
 */

// ---------- Grundwerte ----------

/** EN 18219 §4.3/§4.4: Ebene bleibt nach Inverkehrbringen fix. */
export type Granularity = "model" | "batch" | "item";

/** EN 18223 Tab. 1. Gehört zur veröffentlichten Version, nicht zum Arbeitsstand. */
export type DppStatus = "active" | "inactive" | "archived" | "invalid";

/** EN 18223 §4.1.2 */
export type ElementType = "SingleValued" | "MultiValued" | "Collection" | "MultiLanguage" | "RelatedResource";

/** Öffentlich · Berechtigt · Behörde */
export type AccessLevel = "public" | "authorized" | "authority";

/** vorhanden · fehlt · veraltet */
export type ElementState = "present" | "missing" | "outdated";

/** Produkte · PCF · Lieferant · manuell */
export type SourceModule = "products" | "pcf" | "supplier" | "manual";

/** Template-Abschnitte (SPEC §5) */
export type SectionId = "identity" | "actors" | "material" | "substances" | "environment" | "conformity" | "instructions";

/** SPEC §5: Pflicht laut Template (nicht rechtsverbindlich), optional oder freiwillig (Code Gaia). */
export type Requirement = "required" | "optional" | "voluntary";

export type ProductGroup = "textile" | "furniture";

export type Language = "de" | "en";

// ---------- Template (JSON-Dateien unter data/templates/) ----------

export type TemplateKind = "horizontal" | "product-group" | "voluntary";

export type TemplateField = {
  /** Stabiler Schlüssel innerhalb des Templates, z. B. "upi". */
  key: string;
  label: string;
  /** Label für die englische öffentliche Seite. */
  labelEn: string;
  section: SectionId;
  elementType: ElementType;
  requirement: Requirement;
  /** Standard-Zugriffsebene; das Datenelement trägt die gültige Ebene. */
  accessLevel: AccessLevel;
  dictionaryReference?: string;
  sourceMapping: { module: SourceModule; attribute?: string };
  /** Hinweis im Editor, z. B. „In Prüfung“. */
  hint?: string;
};

export type TemplateOverride = { templateId: string; key: string; requirement: "required" };

export type DppTemplate = {
  /** Landet in contentSpecificationIds (außer kind "voluntary"). */
  id: string;
  version: string;
  name: string;
  kind: TemplateKind;
  productGroup: ProductGroup | "all";
  /** Im MVP alle "draft": nicht rechtsverbindlich. */
  status: "draft" | "binding";
  fields: TemplateField[];
  overrides?: TemplateOverride[];
};

// ---------- Datenelement ----------

export type ElementValue =
  | { kind: "SingleValued"; value: string }
  | { kind: "MultiValued"; values: string[] }
  | { kind: "MultiLanguage"; values: Partial<Record<Language, string>> }
  | {
      kind: "RelatedResource";
      /** Rückfall-Bezeichnung (Dateiname), wenn kein Titel in der gewählten Sprache vorliegt. */
      label: string;
      href: string;
      /** Titel je Sprache, z. B. „Pflegeanleitung“ / „Care guide“. */
      title?: Partial<Record<Language, string>>;
      /** z. B. "application/pdf" */
      mimeType?: string;
      /** Sprachen des Dokuments selbst. */
      languages?: Language[];
    }
  | { kind: "Collection"; elements: DataElement[] };

/** Herkunft des Werts: Modul, Datensatz, Version (SPEC §5). */
export type SourceRef = { module: SourceModule; dataset?: string; version?: string };

export type DataElement = {
  /** `${templateId}/${key}` */
  elementId: string;
  templateId: string;
  key: string;
  /** null = kein Wert (Zustand „fehlt“). */
  value: ElementValue | null;
  state: ElementState;
  accessLevel: AccessLevel;
  source: SourceRef;
  /** Vererbung Einzelstück ← Charge ← Modell (JRC §9.1 🟡). */
  inheritedFrom?: Granularity;
  dictionaryReference?: string;
};

// ---------- Pass ----------

/** EN 18223 Tab. 1. Wird nur für veröffentlichte Versionen gebildet. */
export type PassportHeader = {
  /** URL: `${NEXT_PUBLIC_BASE_URL}/p/${dppId}` */
  digitalProductPassportId: string;
  uniqueProductIdentifier: string;
  granularity: Granularity;
  dppSchemaVersion: string;
  dppStatus: DppStatus;
  /** ISO 8601 */
  lastUpdated: string;
  /** Pflicht nach EN 18223; null, solange die Kennung fehlt (SPEC „Offen aus dem Bau“). */
  economicOperatorId: string | null;
  facilityId?: string;
  contentSpecificationIds: string[];
};

/** Unveränderlicher Snapshot (EN 18223 §4.2, EN 18221 §4.2). */
export type PassVersion = {
  version: number;
  publishedAt: string;
  actor: string;
  /** elementIds */
  changedFields: string[];
  note: string;
  previousVersion: number | null;
  dppStatus: DppStatus;
  elements: DataElement[];
};

export type Registration = { registrationId: string; registeredAt: string };

export type Passport = {
  /** Routen-ID, z. B. "tshirt". */
  id: string;
  dppId: string;
  productName: string;
  /** Produktname auf der englischen öffentlichen Seite; fehlt er, gilt der deutsche. */
  productNameEn?: string;
  sku: string;
  productGroup: ProductGroup;
  granularity: Granularity;
  /** Aktive Templates inkl. „Freiwillige Angaben“. */
  templateIds: string[];
  /** Arbeitsstand: editierbar, nie öffentlich. */
  workingCopy: { elements: DataElement[]; updatedAt: string };
  /** Aufsteigend nach Version. */
  publishedVersions: PassVersion[];
  registration?: Registration;
};

// ---------- Abgeleitet, nie gespeichert ----------

export type WorkflowStatus = "draft" | "published" | "registered";

export type Readiness = {
  required: number;
  fulfilled: number;
  missing: number;
  outdated: number;
  percent: number;
};

// ---------- Reine Tabellenzeilen (Hoodie, Esstisch, Jeans) ----------

export type PassSummary = {
  id: string;
  productName: string;
  sku: string;
  productGroup: ProductGroup;
  granularity: Granularity;
  readinessPercent: number;
  latestVersion?: { version: number; publishedAt: string };
  registration?: { registrationId: string };
};
