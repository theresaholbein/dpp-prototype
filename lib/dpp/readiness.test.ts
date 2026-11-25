import assert from "node:assert/strict";
import { test } from "node:test";
import { getPassport } from "./passports.ts";
import { getPortfolioKpis, getPortfolioRows } from "./portfolio.ts";
import { computeReadiness } from "./readiness.ts";
import { hasUnpublishedChanges } from "./status.ts";

function readinessOf(id: string) {
  const pass = getPassport(id);
  assert.ok(pass, `Pass ${id} fehlt`);
  return computeReadiness(pass.workingCopy.elements, pass.templateIds);
}

test("T-Shirt: 11 von 12 Pflichtfeldern = 92 %, 2 veraltet, 1 fehlt (SPEC §5)", () => {
  assert.deepEqual(readinessOf("tshirt"), { required: 12, fulfilled: 11, missing: 1, outdated: 2, percent: 92 });
});

test("Sessel: 4 von 6 Pflichtfeldern = 67 % (SPEC §5)", () => {
  const r = readinessOf("sessel");
  assert.equal(r.required, 6);
  assert.equal(r.fulfilled, 4);
  assert.equal(r.percent, 67);
});

test("T-Shirt hat offene Änderungen seit v3, Sessel keine Version", () => {
  assert.equal(hasUnpublishedChanges(getPassport("tshirt")!), true);
  assert.equal(getPassport("sessel")!.publishedVersions.length, 0);
});

test("Portfolio-Kennzahlen: 5 / 3 / 1 / 78 %", () => {
  assert.deepEqual(getPortfolioKpis(getPortfolioRows()), { total: 5, published: 3, registered: 1, avgReadiness: 78 });
});
