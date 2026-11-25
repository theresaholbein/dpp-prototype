import { SESSEL } from "../../data/passports/sessel.ts";
import { TSHIRT } from "../../data/passports/tshirt.ts";
import { contentSpecificationIds } from "./templates.ts";
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

export function passportUrl(dppId: string): string {
  const base = (process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  return `${base}/p/${dppId}`;
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

function valueOf(elements: DataElement[], key: string): string | null {
  return text(elements.find((e) => e.templateId === "cg-espr-horizontal" && e.key === key)?.value ?? null);
}

/** Kopf nach EN 18223 Tab. 1 für eine veröffentlichte Version (SPEC §5). */
export function buildHeader(pass: Passport, version: PassVersion): PassportHeader {
  return {
    digitalProductPassportId: passportUrl(pass.dppId),
    uniqueProductIdentifier: valueOf(version.elements, "upi") ?? "",
    granularity: pass.granularity,
    dppSchemaVersion: DPP_SCHEMA_VERSION,
    dppStatus: version.dppStatus,
    lastUpdated: version.publishedAt,
    economicOperatorId: valueOf(version.elements, "operatorId"),
    contentSpecificationIds: contentSpecificationIds(pass.templateIds),
  };
}
