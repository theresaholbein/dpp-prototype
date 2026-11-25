import { PRODUCT_GROUPS } from "../../data/product-groups.ts";
import { formatDate, localizeValue } from "./format.ts";
import { GRANULARITY_LABEL, GRANULARITY_LABEL_EN, SECTION_LABEL, SECTION_LABEL_EN, SECTION_ORDER } from "./labels.ts";
import { buildHeader } from "./passports.ts";
import { filterForRole, getRole } from "./roles.ts";
import { getField } from "./templates.ts";
import type { DataElement, Language, Passport, PassVersion, SectionId } from "./types.ts";

/**
 * Inhalt der öffentlichen Passseite (SPEC §6.7) für eine veröffentlichte Version.
 * Nur Felder der Ebene „Öffentlich“. Reine Funktion, damit die Auswahl testbar ist.
 */

export const LANGUAGES: Language[] = ["de", "en"];

export function parseLanguage(value: string | string[] | undefined): Language {
  return value === "en" ? "en" : "de";
}

/** Texte der Seite. Wortlaut nach Public.dc.html im Mockup. */
export const PUBLIC_TEXT = {
  de: {
    passLabel: "Digitaler Produktpass",
    language: "Sprache",
    item: "Artikel",
    level: "Ebene",
    keyFacts: "Kernangaben",
    details: "Angaben",
    documents: "Dokumente",
    noDocuments: "Keine öffentlichen Dokumente",
    notProvided: "Keine Angabe",
    pro: "Zugang für Fachleute",
    proText:
      "Reparaturbetriebe, Recycler und Behörden melden sich an, um zusätzliche Angaben zu sehen. Im Prototyp gibt es keine Anmeldung; die Rollen-Vorschau in der App zeigt diese Ansichten.",
    dppId: "DPP-ID",
    version: "Version",
    updated: "Stand",
    operator: "Verantwortlich",
    hosted: "bereitgestellt über Code Gaia",
    demo: "Demo-Daten, fiktiv.",
    languages: { de: "DE", en: "EN" } as Record<Language, string>,
  },
  en: {
    passLabel: "Digital Product Passport",
    language: "Language",
    item: "Item",
    level: "Level",
    keyFacts: "Key facts",
    details: "Details",
    documents: "Documents",
    noDocuments: "No public documents",
    notProvided: "Not provided",
    pro: "Access for professionals",
    proText:
      "Repairers, recyclers and authorities sign in to see additional information. The prototype has no sign-in; the role preview in the app shows these views.",
    dppId: "DPP ID",
    version: "Version",
    updated: "Updated",
    operator: "Responsible",
    hosted: "provided via Code Gaia",
    demo: "Demo data, fictitious.",
    languages: { de: "DE", en: "EN" } as Record<Language, string>,
  },
};

/** Text mit Sprache; `lang` nur, wenn er von der Seitensprache abweichen kann. */
export type LocalText = { text: string; lang?: Language };

export type PublicRow = { elementId: string; label: string; value: LocalText | null };
export type PublicSection = { id: SectionId; title: string; rows: PublicRow[] };
export type PublicDocument = { elementId: string; title: LocalText; href: string; mimeType?: string; languages?: Language[] };

export type PublicView = {
  lang: Language;
  productName: LocalText;
  manufacturer: string | null;
  subtitle: string;
  facts: { label: string; value: LocalText }[];
  sections: PublicSection[];
  documents: PublicDocument[];
  footer: { dppId: string; digitalProductPassportId: string; version: number; updated: string; operator: string | null };
};

function labelOf(e: DataElement, lang: Language): string {
  const field = getField(e.templateId, e.key);
  if (!field) return e.key;
  return lang === "en" ? field.labelEn : field.label;
}

function isDocument(e: DataElement): boolean {
  return getField(e.templateId, e.key)?.elementType === "RelatedResource";
}

export function buildPublicView(pass: Passport, version: PassVersion, lang: Language): PublicView {
  const header = buildHeader(pass, version);
  const { visible } = filterForRole(version.elements, getRole("consumer"));
  const byId = new Map(visible.map((e) => [e.elementId, e]));
  const manufacturer = localizeValue(byId.get("cg-espr-horizontal/manufacturer")?.value ?? null, lang)?.text ?? null;

  const facts = PRODUCT_GROUPS[pass.productGroup].keyFacts.flatMap((f) => {
    const value = localizeValue(byId.get(f.elementId)?.value ?? null, lang);
    return value ? [{ label: f.label[lang], value }] : [];
  });

  const sections = SECTION_ORDER.map((id) => {
    const rows = visible
      .filter((e) => getField(e.templateId, e.key)?.section === id && !isDocument(e))
      .map((e) => ({ elementId: e.elementId, label: labelOf(e, lang), value: localizeValue(e.value, lang) }));
    return { id, title: (lang === "en" ? SECTION_LABEL_EN : SECTION_LABEL)[id], rows };
  }).filter((s) => s.rows.length > 0);

  const documents = visible.flatMap((e): PublicDocument[] => {
    if (e.value?.kind !== "RelatedResource") return [];
    const title = localizeValue(e.value, lang) ?? { text: e.value.href };
    return [{ elementId: e.elementId, title, href: e.value.href, mimeType: e.value.mimeType, languages: e.value.languages }];
  });

  const name: LocalText =
    lang === "en" ? (pass.productNameEn ? { text: pass.productNameEn } : { text: pass.productName, lang: "de" }) : { text: pass.productName };
  const t = PUBLIC_TEXT[lang];
  const level = (lang === "en" ? GRANULARITY_LABEL_EN : GRANULARITY_LABEL)[header.granularity];

  return {
    lang,
    productName: name,
    manufacturer,
    subtitle: `${t.item} ${pass.sku} · ${t.level} ${level}`,
    facts,
    sections,
    documents,
    footer: {
      dppId: pass.dppId,
      digitalProductPassportId: header.digitalProductPassportId,
      version: version.version,
      updated: formatDate(version.publishedAt, lang),
      operator: manufacturer,
    },
  };
}

/** „PDF“ aus „application/pdf“. */
export function fileTypeLabel(mimeType: string | undefined): string | null {
  if (!mimeType) return null;
  const sub = mimeType.split("/")[1];
  return sub ? sub.toUpperCase() : null;
}
