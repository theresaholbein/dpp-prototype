import assert from "node:assert/strict";
import { test } from "node:test";
import { QUIET_ZONE, buildQrSvg, qrFileName, qrMatrix } from "./qr.ts";

const URL = "https://dpp-prototype-five.vercel.app/p/ts1042-l2026-114";

function viewBoxSize(svg: string): number {
  const m = svg.match(/viewBox="0 0 (\d+) (\d+)"/);
  assert.ok(m, "viewBox fehlt");
  return Number(m[1]);
}

test("Druckgröße in mm, Ruhezone 4 Module (EN 18220)", () => {
  const { size } = qrMatrix(URL, "M");
  const svg = buildQrSvg(URL, { sizeMm: 30, ecc: "M", iecFrame: false });
  assert.match(svg, /width="30mm" height="30mm"/);
  assert.equal(viewBoxSize(svg), size + 2 * QUIET_ZONE);
  // Erstes dunkles Modul (Finder-Pattern oben links) liegt hinter der Ruhezone.
  assert.match(svg, new RegExp(`d="M${QUIET_ZONE} ${QUIET_ZONE}h1v1h-1z`));
});

test("IEC-61406-Rahmen nur mit Option, außerhalb der Ruhezone", () => {
  const plain = buildQrSvg(URL, { sizeMm: 20, ecc: "M", iecFrame: false });
  const framed = buildQrSvg(URL, { sizeMm: 20, ecc: "M", iecFrame: true });
  assert.equal(viewBoxSize(framed), viewBoxSize(plain) + 2);
  assert.match(framed, /fill-rule="evenodd"/);
  assert.doesNotMatch(plain, /fill-rule="evenodd"/);
});

test("Höhere Fehlerkorrektur braucht mindestens so viele Module", () => {
  const sizes = (["L", "M", "Q", "H"] as const).map((e) => qrMatrix(URL, e).size);
  for (let i = 1; i < sizes.length; i++) assert.ok(sizes[i] >= sizes[i - 1]);
  assert.ok(sizes[3] > sizes[0]);
});

test("Dateiname enthält Größe, Fehlerkorrektur und Rahmen", () => {
  assert.equal(qrFileName("ts1042-l2026-114", { sizeMm: 40, ecc: "H", iecFrame: true }), "dpp-ts1042-l2026-114-40mm-H-iec61406.svg");
});
