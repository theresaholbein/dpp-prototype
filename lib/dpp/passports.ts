import { SESSEL } from "../../data/passports/sessel.ts";
import { TSHIRT } from "../../data/passports/tshirt.ts";
import { contentSpecificationIds } from "./templates.ts";
import { granularityFromValue } from "./working-copy.ts";
import type { DataElement, ElementValue, Passport, PassportHeader, PassVersion } from "./types.ts";

/** Volle Demo-Pässe. Später ersetzt durch Persistenz (SPEC §12). */
const PASSPORTS: Passport[] = [TSHIRT, SESSEL];

export const DPP_SCHEMA_VERSION = "cg-dpp-0.1.0";

export function getPassports(): Passport[] {
  return PASSPORTS;
}

export function getPassport(id: string): Passport | undefined {
  return PASSPORTS.find((p) => p.id === id);
}

export function getPassportByDppId(dppId: string): Passport | undefined {
  return PASSPORTS.find((p) => p.dppId === dppId);
}

function baseUrl(): string {
  return (process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");
}

export function passportUrl(dppId: string): string {
  return `${baseUrl()}/p/${dppId}`;
}

/** Endpunkt der Lese-API (SPEC §7) für einen Pass. */
export function passportApiUrl(dppId: string): string {
  return `${baseUrl()}/api/v1/dpps/${dppId}`;
}

function text(value: ElementValue | null): string | null {
  if (!value) return null;
  switch (value.kind) {
    case "SingleValued":
      return value.value;
    case "MultiValued":
      return value.values.join(", ");
    case "MultiLanguage":
      return value.values.de ?? value.values.en ?? null;
    case "RelatedResource":
      return value.href;
    case "Collection":
      return null;
  }
}

function elementOf(elements: DataElement[], key: string): DataElement | undefined {
  return elements.find((e) => e.templateId === "cg-espr-horizontal" && e.key === key);
}

function valueOf(elements: DataElement[], key: string): string | null {
  return text(elementOf(elements, key)?.value ?? null);
}

/** Kopf nach EN 18223 Tab. 1 für eine veröffentlichte Version (SPEC §5). */
export function buildHeader(pass: Passport, version: PassVersion): PassportHeader {
  return {
    digitalProductPassportId: passportUrl(pass.dppId),
    uniqueProductIdentifier: valueOf(version.elements, "upi") ?? "",
    // SPEC §5: aus dem Datenelement der Version abgeleitet; Rückfall auf die Ebene des Passes.
    granularity: granularityFromValue(elementOf(version.elements, "granularity")?.value ?? null) ?? pass.granularity,
    dppSchemaVersion: DPP_SCHEMA_VERSION,
    dppStatus: version.dppStatus,
    lastUpdated: version.publishedAt,
    economicOperatorId: valueOf(version.elements, "operatorId"),
    contentSpecificationIds: contentSpecificationIds(pass.templateIds),
  };
}
