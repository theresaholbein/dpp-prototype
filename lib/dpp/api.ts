import { buildHeader, getPassportByDppId, getPassports } from "./passports.ts";
import { versionAt } from "./publish.ts";
import { filterForRole, getRole } from "./roles.ts";
import { getField } from "./templates.ts";
import type { AccessLevel, DataElement, ElementType, ElementValue, Granularity, Passport, PassportHeader, PassVersion } from "./types.ts";

/**
 * Lese-API nach EN 18222 (SPEC §7). Reine Funktionen; die Route Handler unter app/api/v1/dpps/ sind nur Hüllen.
 * Ohne Anmeldung nur Datenelemente der Ebene „Öffentlich“. Ausgeliefert werden nur die Demo-Versionen,
 * wie auf der öffentlichen Seite (Entscheidung 25.11.2026); der Arbeitsstand ist nie öffentlich.
 * 🟡 Pfade und Parameter sind ein Vorschlag, noch gegen EN 18222 §4/§8 zu prüfen.
 */

/** Öffentliches Datenelement: ohne interne Angaben wie Quelle (Modul, Datensatz) und Zustand. */
export type ApiElement = {
  elementId: string;
  elementType: ElementType;
  value: ElementValue | null;
  accessLevel: AccessLevel;
  dictionaryReference?: string;
  inheritedFrom?: Granularity;
};

export type ApiPassport = {
  header: PassportHeader;
  version: { version: number; publishedAt: string; previousVersion: number | null };
  elements: ApiElement[];
};

export type ApiErrorCode = "bad_request" | "not_found" | "forbidden";
export type ApiError = { status: 400 | 403 | 404; error: { code: ApiErrorCode; message: string } };
export type ApiResult<T> = { ok: true; data: T } | ({ ok: false } & ApiError);

const fail = (status: ApiError["status"], code: ApiErrorCode, message: string): { ok: false } & ApiError => ({
  ok: false,
  status,
  error: { code, message },
});

const PUBLIC = getRole("consumer");

function toApiElement(e: DataElement): ApiElement {
  const field = getField(e.templateId, e.key);
  const dictionaryReference = e.dictionaryReference ?? field?.dictionaryReference;
  return {
    elementId: e.elementId,
    elementType: field?.elementType ?? e.value?.kind ?? "SingleValued",
    value: e.value,
    accessLevel: e.accessLevel,
    ...(dictionaryReference ? { dictionaryReference } : {}),
    ...(e.inheritedFrom ? { inheritedFrom: e.inheritedFrom } : {}),
  };
}

export function toApiPassport(pass: Passport, version: PassVersion): ApiPassport {
  return {
    header: buildHeader(pass, version),
    version: { version: version.version, publishedAt: version.publishedAt, previousVersion: version.previousVersion },
    elements: filterForRole(version.elements, PUBLIC).visible.map(toApiElement),
  };
}

/** Letzte öffentlich ausgelieferte Version (Demo-Daten). */
function latestPublic(pass: Passport): PassVersion | undefined {
  return pass.publishedVersions.at(-1);
}

const NOT_PUBLISHED = "Kein veröffentlichter Produktpass mit dieser ID.";

/** ReadDPPById und ReadDPPVersionByIdAndDate (`date` = YYYY-MM-DD, Europe/Berlin). */
export function readDppById(dppId: string, date?: string | null): ApiResult<ApiPassport> {
  const pass = getPassportByDppId(dppId);
  if (!pass || !latestPublic(pass)) return fail(404, "not_found", NOT_PUBLISHED);
  if (date === undefined || date === null) return { ok: true, data: toApiPassport(pass, latestPublic(pass)!) };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date))) {
    return fail(400, "bad_request", "Parameter date muss das Format YYYY-MM-DD haben.");
  }
  const version = versionAt(pass.publishedVersions, date);
  if (!version) return fail(404, "not_found", `Am ${date} war noch keine Version veröffentlicht.`);
  return { ok: true, data: toApiPassport(pass, version) };
}

/** Pass, dessen letzte öffentliche Version diese eindeutige Produktkennung trägt. */
function findByProductId(productId: string): { pass: Passport; version: PassVersion } | undefined {
  for (const pass of getPassports()) {
    const version = latestPublic(pass);
    if (version && buildHeader(pass, version).uniqueProductIdentifier === productId) return { pass, version };
  }
  return undefined;
}

/** ReadDPPByProductId */
export function readDppByProductId(productId: string | null): ApiResult<ApiPassport> {
  if (!productId) return fail(400, "bad_request", "Parameter productId fehlt.");
  const hit = findByProductId(productId);
  if (!hit) return fail(404, "not_found", "Kein veröffentlichter Produktpass zu dieser Produktkennung.");
  return { ok: true, data: toApiPassport(hit.pass, hit.version) };
}

/** ReadDPPIdsByProductIds. Body `{ "productIds": string[] }`; unbekannte Kennungen ergeben `dppId: null`. */
export function readDppIdsByProductIds(body: unknown): ApiResult<{ items: { productId: string; dppId: string | null }[] }> {
  const ids = (body as { productIds?: unknown } | null)?.productIds;
  if (!Array.isArray(ids) || !ids.every((id) => typeof id === "string")) {
    return fail(400, "bad_request", 'Body muss { "productIds": ["…"] } sein.');
  }
  return {
    ok: true,
    data: {
      items: ids.map((productId: string) => {
        const hit = findByProductId(productId);
        return { productId, dppId: hit ? buildHeader(hit.pass, hit.version).digitalProductPassportId : null };
      }),
    },
  };
}

/** ReadDataElement. `path` = elementId (`templateId/key`). Nicht öffentliche Elemente: 403. */
export function readDataElement(dppId: string, path: string, date?: string | null): ApiResult<ApiElement> {
  const pass = readDppById(dppId, date);
  if (!pass.ok) return pass;
  const passport = getPassportByDppId(dppId)!;
  const version = date ? versionAt(passport.publishedVersions, date)! : latestPublic(passport)!;
  const element = version.elements.find((e) => e.elementId === path);
  if (!element) return fail(404, "not_found", `Datenelement ${path} gibt es in diesem Pass nicht.`);
  if (!PUBLIC.levels.includes(element.accessLevel)) {
    return fail(403, "forbidden", "Dieses Datenelement erfordert eine Anmeldung. Im Prototyp gibt es keine Anmeldung.");
  }
  return { ok: true, data: toApiElement(element) };
}
