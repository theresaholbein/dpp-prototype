import assert from "node:assert/strict";
import { test } from "node:test";
import { getPassport, getPassportByDppId } from "./passports.ts";
import { buildPublicView, parseLanguage } from "./public-view.ts";

const tshirt = getPassport("tshirt")!;
const v3 = tshirt.publishedVersions.at(-1)!;

test("Öffentliche Seite: nur Felder „Öffentlich“, Dokument Pflegeanleitung", () => {
  const view = buildPublicView(tshirt, v3, "de");
  const ids = view.sections.flatMap((s) => s.rows.map((r) => r.elementId));
  const all = v3.elements;
  for (const id of ids) assert.equal(all.find((e) => e.elementId === id)?.accessLevel, "public", id);
  assert.ok(!ids.includes("cg-espr-horizontal/facility"), "Produktionsstätte ist „Berechtigt“");
  assert.deepEqual(
    view.documents.map((d) => [d.title.text, d.href, d.mimeType, d.languages]),
    [["Pflegeanleitung", "/demo/pflegeanleitung-ts-1042.pdf", "application/pdf", ["de", "en"]]],
  );
  assert.equal(view.footer.version, 3);
  assert.equal(view.footer.operator, "Muster Textil GmbH");
  assert.equal(view.subtitle, "Artikel TS-1042 · Ebene Charge");
});

test("EN: Labels und sprachabhängige Werte übersetzt, Kennungen einsprachig", () => {
  const view = buildPublicView(tshirt, v3, "en");
  assert.equal(view.productName.text, "Basic T-shirt organic cotton");
  const rows = view.sections.flatMap((s) => s.rows);
  const fibre = rows.find((r) => r.elementId.endsWith("/fibreComposition"));
  assert.equal(fibre?.label, "Fibre composition");
  assert.deepEqual(fibre?.value, { text: "100 % cotton (organic)", lang: "en" });
  const upi = rows.find((r) => r.elementId.endsWith("/upi"));
  assert.equal(upi?.value?.lang, undefined);
  assert.equal(view.documents[0].title.text, "Care guide");
  assert.equal(view.sections[0].title, "Identity");
});

test("EN ohne Übersetzung: deutscher Wert mit lang de", () => {
  const elements = v3.elements.map((e) =>
    e.key === "fibreComposition" ? { ...e, value: { kind: "MultiLanguage" as const, values: { de: "100 % Leinen" } } } : e,
  );
  const view = buildPublicView(tshirt, { ...v3, elements }, "en");
  const fibre = view.sections.flatMap((s) => s.rows).find((r) => r.elementId.endsWith("/fibreComposition"));
  assert.deepEqual(fibre?.value, { text: "100 % Leinen", lang: "de" });
});

test("Sprache und DPP-ID", () => {
  assert.equal(parseLanguage("en"), "en");
  assert.equal(parseLanguage(["en"]), "de");
  assert.equal(parseLanguage(undefined), "de");
  assert.equal(getPassportByDppId("ts1042-l2026-114")?.id, "tshirt");
  assert.equal(getPassportByDppId("se220")?.publishedVersions.length, 0, "Sessel ist öffentlich nicht erreichbar");
});

test("EN: PCF und Granularität übersetzt (Entscheidung 25.11.2026)", () => {
  const rows = buildPublicView(tshirt, v3, "en").sections.flatMap((s) => s.rows);
  assert.deepEqual(rows.find((r) => r.elementId.endsWith("/pcf"))?.value, { text: "4.4 kg CO2e per item", lang: "en" });
  assert.deepEqual(rows.find((r) => r.elementId.endsWith("/granularity"))?.value, { text: "Batch (L2026-114)", lang: "en" });
  assert.ok(tshirt.publishedVersions.every((v) => v.actor !== "T. Holbein"));
});
