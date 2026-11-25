import assert from "node:assert/strict";
import { test } from "node:test";
import { PASS_SUMMARIES } from "../../data/passports/summaries.ts";
import { getPassport } from "./passports.ts";
import { passState } from "./pass-state.ts";
import { MAX_ITEMS_PER_FILE, buildRegistryExport, candidateFromPassport, candidateFromSummary, toXml, type RegistryCandidate } from "./registry.ts";
import type { PassSummary } from "./types.ts";

const NOW = new Date("2026-11-27T10:00:00+01:00");

function full(id: string): RegistryCandidate {
  const p = getPassport(id);
  assert.ok(p);
  return candidateFromPassport(p, passState(p, {}, []));
}

function summary(id: string): RegistryCandidate {
  const s = PASS_SUMMARIES.find((x) => x.id === id) as PassSummary;
  return candidateFromSummary(s, s.registration ? "registered" : s.latestVersion ? "published" : "draft");
}

test("Ergebnis je Zeile: T-Shirt aufgenommen mit v3, Sessel nicht veröffentlicht, Jeans registriert, Hoodie ohne Passdaten", () => {
  const { files, results } = buildRegistryExport([full("tshirt"), full("sessel"), summary("jeans"), summary("hoodie")], "json", NOW);
  const byId = Object.fromEntries(results.map((r) => [r.id, r]));
  assert.equal(byId.tshirt.outcome, "included");
  assert.equal(byId.tshirt.message, "Aufgenommen (v3)");
  assert.deepEqual(byId.tshirt.warnings, ["Kennung Wirtschaftsakteur fehlt"]);
  assert.deepEqual(full("tshirt").notes, ["Offene Änderungen seit v3 nicht enthalten"]);
  assert.equal(byId.sessel.outcome, "error");
  assert.equal(byId.sessel.message, "Nicht veröffentlicht");
  assert.equal(byId.jeans.outcome, "registered");
  assert.equal(byId.jeans.message, "Bereits registriert · REG-DEMO-0007");
  assert.equal(byId.hoodie.outcome, "error");

  assert.equal(files.length, 1);
  assert.equal(files[0].filename, "registry-upload-textil-2026-11-27.json");
  const doc = JSON.parse(files[0].content);
  assert.equal(doc.productGroup, "textile");
  assert.ok(doc.schemaVersion);
  assert.equal(doc.items.length, 1);
  assert.equal(doc.items[0].uniqueProductIdentifier, "https://id.muster-textil.example/01/04012345000017/10/L2026-114");
  assert.match(doc.items[0].apiEndpoint, /\/api\/v1\/dpps\/ts1042-l2026-114$/);
  assert.equal(doc.items[0].economicOperatorId, null);
});

test(`Höchstens ${MAX_ITEMS_PER_FILE} Pässe je Datei (Abnahme 5)`, () => {
  const t = full("tshirt");
  const many = Array.from({ length: MAX_ITEMS_PER_FILE }, (_, i) => ({ ...t, id: `t${i}` }));
  const ok = buildRegistryExport(many, "json", NOW);
  assert.equal(ok.files[0].itemCount, MAX_ITEMS_PER_FILE);
  assert.throws(() => buildRegistryExport([...many, t], "json", NOW), RangeError);
});

test("Gemischte Produktgruppen ergeben eine Datei je Gruppe", () => {
  const t = full("tshirt");
  const furniture = { ...t, id: "m", productGroup: "furniture" as const };
  const { files } = buildRegistryExport([t, furniture], "xml", NOW);
  assert.deepEqual(files.map((f) => f.productGroup).sort(), ["furniture", "textile"]);
  assert.ok(files.every((f) => f.filename.endsWith(".xml") && f.mimeType === "application/xml"));
});

test("XML: Sonderzeichen werden escaped, fehlender Wert als leeres Element", () => {
  const xml = toXml({
    schemaVersion: "demo",
    productGroup: "textile",
    items: [{ uniqueProductIdentifier: "a&b<c", dppId: "x", economicOperatorId: null, backupOperatorId: null, apiEndpoint: "y", status: "active" }],
  });
  assert.match(xml, /<uniqueProductIdentifier>a&amp;b&lt;c<\/uniqueProductIdentifier>/);
  assert.match(xml, /<economicOperatorId\/>/);
});
