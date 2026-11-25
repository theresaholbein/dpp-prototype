import assert from "node:assert/strict";
import { test } from "node:test";
import { readDataElement, readDppById, readDppByProductId, readDppIdsByProductIds } from "./api.ts";

const TSHIRT = "ts1042-l2026-114";
const UPI = "https://id.muster-textil.example/01/04012345000017/10/L2026-114";

test("ReadDPPById: Kopf enthält alle Felder aus EN 18223 Tab. 1 (Abnahme 1), letzte Demo-Version v3", () => {
  const r = readDppById(TSHIRT);
  assert.ok(r.ok);
  for (const key of ["digitalProductPassportId", "uniqueProductIdentifier", "granularity", "dppSchemaVersion", "dppStatus", "lastUpdated", "economicOperatorId", "contentSpecificationIds"]) {
    assert.ok(key in r.data.header, `Kopf-Feld ${key} fehlt`);
  }
  assert.equal(r.data.header.uniqueProductIdentifier, UPI);
  assert.equal(r.data.version.version, 3);
});

test("Nur öffentliche Datenelemente, ohne Quelle und Zustand", () => {
  const r = readDppById(TSHIRT);
  assert.ok(r.ok);
  assert.ok(r.data.elements.length > 0);
  for (const e of r.data.elements) {
    assert.equal(e.accessLevel, "public");
    assert.ok(!("source" in e) && !("state" in e));
  }
  assert.ok(!r.data.elements.some((e) => e.elementId === "cg-espr-horizontal/facility"), "Produktionsstätte ist berechtigt");
});

test("ReadDPPVersionByIdAndDate: Stand am Datum aus den veröffentlichten Versionen", () => {
  const v1 = readDppById(TSHIRT, "2026-11-01");
  const v2 = readDppById(TSHIRT, "2026-11-10");
  assert.ok(v1.ok && v2.ok);
  assert.equal(v1.data.version.version, 1);
  assert.equal(v2.data.version.version, 2);
  const before = readDppById(TSHIRT, "2026-10-01");
  assert.ok(!before.ok);
  assert.equal(before.status, 404);
  const bad = readDppById(TSHIRT, "01.11.2026");
  assert.ok(!bad.ok);
  assert.equal(bad.status, 400);
});

test("Pass ohne Version (Sessel) und unbekannte ID: 404", () => {
  for (const id of ["se220", "gibt-es-nicht"]) {
    const r = readDppById(id);
    assert.ok(!r.ok);
    assert.equal(r.status, 404);
  }
});

test("ReadDPPByProductId und ReadDPPIdsByProductIds", () => {
  const r = readDppByProductId(UPI);
  assert.ok(r.ok);
  assert.equal(r.data.version.version, 3);
  assert.equal(readDppByProductId(null).ok, false);

  const ids = readDppIdsByProductIds({ productIds: [UPI, "urn:unbekannt"] });
  assert.ok(ids.ok);
  assert.match(ids.data.items[0].dppId ?? "", /\/p\/ts1042-l2026-114$/);
  assert.equal(ids.data.items[1].dppId, null);

  const bad = readDppIdsByProductIds({ productIds: "x" });
  assert.ok(!bad.ok);
  assert.equal(bad.status, 400);
});

test("ReadDataElement: öffentlich 200, Behörde 403, unbekannt 404", () => {
  const pcf = readDataElement(TSHIRT, "cg-textile-apparel-jrc-2026-05/pcf");
  assert.ok(pcf.ok);
  assert.equal(pcf.data.value?.kind, "MultiLanguage");

  const old = readDataElement(TSHIRT, "cg-textile-apparel-jrc-2026-05/pcf", "2026-11-10");
  assert.ok(old.ok);
  assert.deepEqual(old.data.value, { kind: "MultiLanguage", values: { de: "4,8 kg CO2e je Stück", en: "4.8 kg CO2e per item" } });

  const restricted = readDataElement(TSHIRT, "cg-espr-horizontal/substanceList");
  assert.ok(!restricted.ok);
  assert.equal(restricted.status, 403);

  const unknown = readDataElement(TSHIRT, "cg-espr-horizontal/gibtsnicht");
  assert.ok(!unknown.ok);
  assert.equal(unknown.status, 404);
});
