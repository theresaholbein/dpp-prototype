import type { TagSeverity } from "../../components/ui/AppTag.tsx";
import type {
  AccessLevel,
  ElementState,
  Granularity,
  ProductGroup,
  Requirement,
  SectionId,
  SourceModule,
  WorkflowStatus,
} from "./types.ts";

/** Deutsche UI-Labels und Tag-Farben zu den Codes aus types.ts (Tag-Farben wie im Mockup). */

export const SECTION_LABEL: Record<SectionId, string> = {
  identity: "Identität",
  actors: "Akteure",
  material: "Material",
  substances: "Stoffe",
  environment: "Umwelt",
  conformity: "Konformität",
  instructions: "Anleitungen",
};

export const SECTION_ORDER: SectionId[] = ["identity", "actors", "material", "substances", "environment", "conformity", "instructions"];

export const ACCESS_LABEL: Record<AccessLevel, string> = {
  public: "Öffentlich",
  authorized: "Berechtigt",
  authority: "Behörde",
};

export const ACCESS_AUDIENCE: Record<AccessLevel, string> = {
  public: "alle (Verbraucher, Fachleute, Behörden)",
  authorized: "Fachleute mit berechtigtem Interesse und Behörden",
  authority: "nur Marktüberwachung und Zoll",
};

export const ACCESS_SEVERITY: Record<AccessLevel, TagSeverity> = {
  public: "primary",
  authorized: "info",
  authority: "contrast",
};

export const STATE_LABEL: Record<ElementState, string> = {
  present: "vorhanden",
  missing: "fehlt",
  outdated: "veraltet",
};

export const STATE_SEVERITY: Record<ElementState, TagSeverity> = {
  present: "success",
  missing: "danger",
  outdated: "warn",
};

export const SOURCE_LABEL: Record<SourceModule, string> = {
  products: "Produkte",
  pcf: "PCF",
  supplier: "Lieferant",
  manual: "manuell",
};

export const SOURCE_DESCRIPTION: Record<SourceModule, string> = {
  products: "Modul Produkte · Attribut aus Stammdaten bzw. Stückliste",
  pcf: "Modul Produkt-CO2e-Bilanz · letzte freigegebene Berechnung",
  supplier: "Modul Lieferkette · Antwort aus Lieferantenfragebogen",
  manual: "Manuell im Pass gepflegt",
};

export const REQUIREMENT_LABEL: Record<Requirement, string> = {
  required: "Pflicht",
  optional: "Optional",
  voluntary: "Freiwillig",
};

export const GRANULARITY_LABEL: Record<Granularity, string> = {
  model: "Modell",
  batch: "Charge",
  item: "Einzelstück",
};

export const STATUS_LABEL: Record<WorkflowStatus, string> = {
  draft: "Entwurf",
  published: "Veröffentlicht",
  registered: "Registriert",
};

export const STATUS_SEVERITY: Record<WorkflowStatus, TagSeverity> = {
  draft: "secondary",
  published: "info",
  registered: "success",
};

export const PRODUCT_GROUP_LABEL: Record<ProductGroup, string> = {
  textile: "Textil",
  furniture: "Möbel",
};

/** SPEC §5: Hinweistext zur Vollständigkeit. */
export const READINESS_HINT =
  "Pflicht laut Template, nicht rechtsverbindlich. Verbindliche Pflichtfelder legt erst der delegierte Rechtsakt fest.";
