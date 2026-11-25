import assert from "node:assert/strict";
import { test } from "node:test";
import { getPassport } from "./passports.ts";
import { computeReadiness } from "./readiness.ts";
import { filterForRole, getRole } from "./roles.ts";
import { applyEdits, editability, granularityFromValue } from "./working-copy.ts";
import type { Passport } from "./types.ts";

function pass(id: string): Passport {
  const p = getPassport(id);
  assert.ok(p, `Pass ${id} fehlt`);
  return p;
}

function element(p: Passport, key: string) {
  const e = p.workingCopy.elements.find((x) => x.key === key);
  assert.ok(e, `Element ${key} fehlt`);
  return e;
}

test("Rollen-Vorschau: Verbraucher sehen nur öffentliche Felder (Abnahme 4)", () => {
  const elements = pass("tshirt").workingCopy.elements;
  const consumer = filterForRole(elements, getRole("consumer"));
  assert.ok(consumer.visible.every((e) => e.accessLevel === "public"));
  assert.equal(consumer.visible.length + consumer.hiddenCount, elements.length);
  assert.ok(consumer.hiddenCount > 0);

  const repair = filterForRole(elements, getRole("repair"));
  assert.ok(repair.visible.some((e) => e.accessLevel === "authorized"));
  assert.ok(!repair.visible.some((e) => e.accessLevel === "authority"));

  assert.equal(filterForRole(elements, getRole("authority")).hiddenCount, 0);
  assert.equal(getRole("unbekannt").id, "consumer");
});

test("Bearbeiten: Wert setzt „vorhanden“, leerer Wert setzt „fehlt“", () => {
  const p = pass("tshirt");
  const care = element(p, "careInstructions");
  const water = element(p, "waterUse");
  const next = applyEdits(p.workingCopy.elements, {
    [care.elementId]: { value: { kind: "MultiLanguage", values: { de: "" } } },
    [water.elementId]: { value: { kind: "SingleValued", value: "12 l je Stück" } },
  });
  assert.equal(next.find((e) => e.elementId === care.elementId)?.state, "missing");
  assert.equal(next.find((e) => e.elementId === care.elementId)?.value, null);
  assert.equal(next.find((e) => e.elementId === water.elementId)?.state, "present");
  // Pflegehinweise sind Pflicht: 10 von 12; Wasserverbrauch ist freiwillig und zählt nicht.
  assert.equal(computeReadiness(next, p.templateIds).fulfilled, 10);
});

test("Bearbeiten: optionale Felder ändern die Vollständigkeit nicht (Sessel 4/6)", () => {
  const p = pass("sessel");
  const docs = element(p, "conformityDocs");
  const next = applyEdits(p.workingCopy.elements, {
    [docs.elementId]: { value: { kind: "RelatedResource", label: "CE-Erklärung", href: "https://files.example/ce.pdf" } },
  });
  const r = computeReadiness(next, p.templateIds);
  assert.equal(r.fulfilled, 4);
  assert.equal(r.required, 6);
});

test("Bearbeitbarkeit: nur manuelle Felder, Granularität nur ohne Version", () => {
  const tshirt = pass("tshirt");
  const sessel = pass("sessel");
  assert.equal(editability(element(tshirt, "granularity"), tshirt.publishedVersions.length > 0), "granularity-locked");
  assert.equal(editability(element(sessel, "granularity"), sessel.publishedVersions.length > 0), "editable");
  assert.equal(editability(element(tshirt, "manufacturer"), true), "external");
  assert.equal(editability(element(tshirt, "careInstructions"), true), "editable");
});

test("Granularität aus dem Feldwert", () => {
  assert.equal(granularityFromValue(element(pass("tshirt"), "granularity").value), "batch");
  assert.equal(granularityFromValue(element(pass("sessel"), "granularity").value), "model");
});
