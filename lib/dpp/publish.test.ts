import assert from "node:assert/strict";
import { test } from "node:test";
import { buildHeader, getPassport } from "./passports.ts";
import { passState } from "./pass-state.ts";
import { canPublish, createVersion, pendingChanges, versionAt } from "./publish.ts";
import type { Passport } from "./types.ts";

function pass(id: string): Passport {
  const p = getPassport(id);
  assert.ok(p, `Pass ${id} fehlt`);
  return p;
}

const NOW = new Date("2026-11-26T10:00:00+01:00");

test("T-Shirt: v4 enthält genau die drei Änderungen aus DIFF, Vorgänger v3", () => {
  const p = pass("tshirt");
  const v4 = createVersion({ versions: p.publishedVersions, elements: p.workingCopy.elements, note: " PCF und Pflege ", actor: "Erika Muster", now: NOW });
  assert.equal(v4.version, 4);
  assert.equal(v4.previousVersion, 3);
  assert.equal(v4.note, "PCF und Pflege");
  assert.equal(v4.dppStatus, "active");
  assert.deepEqual(
    [...v4.changedFields].sort(),
    ["cg-espr-horizontal/technicalDocs", "cg-textile-apparel-jrc-2026-05/careInstructions", "cg-textile-apparel-jrc-2026-05/pcf"],
  );
});

test("Nach dem Veröffentlichen: keine offenen Änderungen, erneutes Veröffentlichen nicht möglich (Abnahme 3)", () => {
  const p = pass("tshirt");
  const v4 = createVersion({ versions: p.publishedVersions, elements: p.workingCopy.elements, note: "", actor: "Erika Muster", now: NOW });
  const state = passState(p, {}, [v4]);
  assert.equal(state.versions.length, 4);
  assert.equal(state.hasUnpublishedChanges, false);
  assert.equal(canPublish(state.versions, state.elements), false);
  // v1 bleibt unverändert abrufbar.
  assert.equal(state.versions[0], p.publishedVersions[0]);
  assert.equal(state.latestPublic?.version, 3, "Öffentlich bleibt die Demo-Version");
});

test("Snapshot ist unabhängig vom Arbeitsstand", () => {
  const p = pass("tshirt");
  const elements = structuredClone(p.workingCopy.elements);
  const v = createVersion({ versions: p.publishedVersions, elements, note: "", actor: "x", now: NOW });
  elements[0].state = "missing";
  assert.equal(v.elements[0].state, "present");
});

test("Sessel: erste Version v1 ohne Vorgänger, alle Felder gelten als neu", () => {
  const p = pass("sessel");
  assert.equal(canPublish([], p.workingCopy.elements), true);
  assert.equal(pendingChanges([], p.workingCopy.elements).length, p.workingCopy.elements.length);
  const v1 = createVersion({ versions: [], elements: p.workingCopy.elements, note: "", actor: "Erika Muster", now: NOW });
  assert.equal(v1.version, 1);
  assert.equal(v1.previousVersion, null);
  assert.deepEqual(v1.changedFields, []);
  assert.equal(passState(p, {}, [v1]).status, "published");
});

test("Stand am Datum sucht nur in veröffentlichten Versionen", () => {
  const versions = pass("tshirt").publishedVersions;
  assert.equal(versionAt(versions, "2026-10-27"), undefined);
  assert.equal(versionAt(versions, "2026-10-28")?.version, 1);
  assert.equal(versionAt(versions, "2026-11-01")?.version, 1);
  assert.equal(versionAt(versions, "2026-11-10")?.version, 2);
  assert.equal(versionAt(versions, "2026-11-18")?.version, 3);
  assert.equal(versionAt(versions, "2027-01-01")?.version, 3);
  assert.equal(versionAt(versions, "kein Datum"), undefined);
  assert.equal(versionAt([], "2026-11-18"), undefined);
});

test("Kopf: Granularität aus dem Datenelement der Version (SPEC §5)", () => {
  const p = pass("sessel");
  const elements = p.workingCopy.elements.map((e) =>
    e.key === "granularity" ? { ...e, value: { kind: "SingleValued" as const, value: "Charge" } } : e,
  );
  const v1 = createVersion({ versions: [], elements, note: "", actor: "x", now: NOW });
  assert.equal(buildHeader(p, v1).granularity, "batch");
  assert.equal(buildHeader(pass("tshirt"), pass("tshirt").publishedVersions[2]).granularity, "batch");
});
