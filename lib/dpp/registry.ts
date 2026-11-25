import { buildHeader, passportApiUrl } from "./passports.ts";
import { changedElementIds } from "./status.ts";
import type { PassState } from "./pass-state.ts";
import type { DppStatus, Passport, PassSummary, ProductGroup, WorkflowStatus } from "./types.ts";

/**
 * Registry-Export (SPEC §8, §6.5): Upload-Datei für das EU-Register als JSON oder XML.
 *
 * ⚠ Format vereinfacht – gegen offizielle Registry-Vorlage prüfen. 🟡
 * Belegt sind nur: max. 100 DPPs je Datei (Registry User Guide v1.03 🟢), die Felder
 * `schemaVersion`, `productGroup`, `items[].uniqueProductIdentifier` (intern, Slack 19.11.2026)
 * und der Registrierungsdatensatz nach EN 18222 Tab. 11 🟢. Feldnamen der übrigen Item-Felder,
 * der Wert von `schemaVersion` und die Codes für `productGroup` sind Annahmen des Prototyps.
 *
 * In die Datei kommt die letzte öffentlich ausgelieferte Version (Demo-Daten), wie bei API und QR.
 * Offene Änderungen und nur im Browser veröffentlichte Versionen gehen nicht mit.
 */

export const REGISTRY_FORMAT_NOTICE = "Format vereinfacht – gegen offizielle Registry-Vorlage prüfen.";
export const MAX_ITEMS_PER_FILE = 100;
/** 🔴 Annahme: Die offizielle Vorlage nennt noch keinen Wert. */
export const REGISTRY_SCHEMA_VERSION = "demo-0.1";

export type RegistryFormat = "json" | "xml";

/** Zeile der Export-Tabelle: voller Pass oder reine Tabellenzeile. */
export type RegistryCandidate = {
  id: string;
  productName: string;
  sku: string;
  productGroup: ProductGroup;
  /** Workflow-Status inkl. Browser-Daten, nur zur Anzeige. */
  status: WorkflowStatus;
  /** Letzte öffentlich ausgelieferte Version; null ohne Version. */
  publicVersion: number | null;
  registrationId: string | null;
  /** Hinweise, was nicht in die Datei kommt (offene Änderungen, nur im Browser veröffentlicht). */
  notes: string[];
  /** Fehlt bei reinen Tabellenzeilen ohne Passdaten. */
  passport?: Passport;
};

/** Registrierungsdatensatz je Pass nach EN 18222 Tab. 11 (ohne Registrierungs-ID: die vergibt die Registry). */
export type RegistryItem = {
  uniqueProductIdentifier: string;
  dppId: string;
  economicOperatorId: string | null;
  /** Back-up beim DPP-Dienstleister ist nicht im MVP (SPEC §2). */
  backupOperatorId: string | null;
  apiEndpoint: string;
  status: DppStatus;
};

export type RegistryFile = { productGroup: ProductGroup; filename: string; mimeType: string; content: string; itemCount: number };

export type RegistryOutcome = "included" | "error" | "registered";
export type RegistryResult = { id: string; productName: string; outcome: RegistryOutcome; message: string; warnings: string[] };

export function candidateFromPassport(pass: Passport, state: PassState): RegistryCandidate {
  const pub = state.latestPublic;
  const notes: string[] = [];
  if (state.latest && pub && state.latest.version > pub.version) {
    notes.push(`v${pub.version + 1}–v${state.latest.version} nur in diesem Browser veröffentlicht, nicht im Export`);
  } else if (pub && changedElementIds(pub.elements, state.elements).length > 0) {
    notes.push(`Offene Änderungen seit v${pub.version} nicht enthalten`);
  } else if (!pub && state.latest) {
    notes.push(`v${state.latest.version} nur in diesem Browser veröffentlicht`);
  }
  return {
    id: pass.id,
    productName: pass.productName,
    sku: pass.sku,
    productGroup: pass.productGroup,
    status: state.status,
    publicVersion: pub?.version ?? null,
    registrationId: pass.registration?.registrationId ?? null,
    notes,
    passport: pass,
  };
}

export function candidateFromSummary(s: PassSummary, status: WorkflowStatus): RegistryCandidate {
  return {
    id: s.id,
    productName: s.productName,
    sku: s.sku,
    productGroup: s.productGroup,
    status,
    publicVersion: s.latestVersion?.version ?? null,
    registrationId: s.registration?.registrationId ?? null,
    notes: [],
  };
}

type Evaluated = { result: RegistryResult; item?: RegistryItem };

function evaluate(c: RegistryCandidate): Evaluated {
  const base = { id: c.id, productName: c.productName, warnings: [] as string[] };
  if (c.registrationId) return { result: { ...base, outcome: "registered", message: `Bereits registriert · ${c.registrationId}` } };
  if (c.publicVersion === null) return { result: { ...base, outcome: "error", message: "Nicht veröffentlicht" } };
  const version = c.passport?.publishedVersions.at(-1);
  if (!c.passport || !version) return { result: { ...base, outcome: "error", message: "Keine Passdaten im Prototyp" } };

  const header = buildHeader(c.passport, version);
  if (!header.uniqueProductIdentifier) return { result: { ...base, outcome: "error", message: "Eindeutige Produktkennung fehlt" } };
  // Entscheidung Schritt 7: aufnehmen, aber warnen (SPEC „Offen aus dem Bau“, Schritt 2).
  // Hinweise zu offenen Änderungen stehen beim Kandidaten (`notes`), nicht doppelt hier.
  const warnings = header.economicOperatorId ? [] : ["Kennung Wirtschaftsakteur fehlt"];

  return {
    result: { ...base, outcome: "included", message: `Aufgenommen (v${version.version})`, warnings },
    item: {
      uniqueProductIdentifier: header.uniqueProductIdentifier,
      dppId: header.digitalProductPassportId,
      economicOperatorId: header.economicOperatorId,
      backupOperatorId: null,
      apiEndpoint: passportApiUrl(c.passport.dppId),
      status: header.dppStatus,
    },
  };
}

type UploadDocument = { schemaVersion: string; productGroup: ProductGroup; items: RegistryItem[] };

export function toJson(doc: UploadDocument): string {
  return `${JSON.stringify(doc, null, 2)}\n`;
}

const escapeXml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

export function toXml(doc: UploadDocument): string {
  const field = (name: string, value: string | null) =>
    value === null ? `      <${name}/>` : `      <${name}>${escapeXml(value)}</${name}>`;
  const items = doc.items.map((i) =>
    [
      "    <item>",
      field("uniqueProductIdentifier", i.uniqueProductIdentifier),
      field("dppId", i.dppId),
      field("economicOperatorId", i.economicOperatorId),
      field("backupOperatorId", i.backupOperatorId),
      field("apiEndpoint", i.apiEndpoint),
      field("status", i.status),
      "    </item>",
    ].join("\n"),
  );
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<registryUpload schemaVersion="${escapeXml(doc.schemaVersion)}" productGroup="${escapeXml(doc.productGroup)}">`,
    "  <items>",
    ...items,
    "  </items>",
    "</registryUpload>",
    "",
  ].join("\n");
}

const DAY = new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "2-digit", day: "2-digit", timeZone: "Europe/Berlin" });
const GROUP_SLUG: Record<ProductGroup, string> = { textile: "textil", furniture: "moebel" };

/**
 * Prüft die Auswahl und erzeugt je Produktgruppe eine Datei (Entscheidung Schritt 7), jede mit höchstens 100 Pässen.
 * Mehr als 100 ausgewählte Pässe: RangeError (die UI lässt das nicht zu).
 */
export function buildRegistryExport(
  selected: RegistryCandidate[],
  format: RegistryFormat,
  now: Date,
): { files: RegistryFile[]; results: RegistryResult[] } {
  if (selected.length > MAX_ITEMS_PER_FILE) {
    throw new RangeError(`Höchstens ${MAX_ITEMS_PER_FILE} Pässe je Datei.`);
  }
  const evaluated = selected.map(evaluate);
  const groups = new Map<ProductGroup, RegistryItem[]>();
  selected.forEach((c, i) => {
    const item = evaluated[i].item;
    if (item) groups.set(c.productGroup, [...(groups.get(c.productGroup) ?? []), item]);
  });

  const day = DAY.format(now);
  const files = [...groups].map(([productGroup, items]): RegistryFile => {
    const doc = { schemaVersion: REGISTRY_SCHEMA_VERSION, productGroup, items };
    return {
      productGroup,
      filename: `registry-upload-${GROUP_SLUG[productGroup]}-${day}.${format}`,
      mimeType: format === "json" ? "application/json" : "application/xml",
      content: format === "json" ? toJson(doc) : toXml(doc),
      itemCount: items.length,
    };
  });
  return { files, results: evaluated.map((e) => e.result) };
}
