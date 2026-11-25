import type { PassSummary } from "../../lib/dpp/types.ts";

/** Weitere Pässe nur als Tabellenzeilen (SPEC §5), Werte aus PRODUCTS im Mockup. Fiktiv. */
export const PASS_SUMMARIES: PassSummary[] = [
  {
    id: "hoodie",
    productName: "Hoodie Recycling-Polyester",
    sku: "HO-310",
    productGroup: "textile",
    granularity: "batch",
    readinessPercent: 92,
    latestVersion: { version: 5, publishedAt: "2026-11-03T10:00:00+01:00" },
  },
  {
    id: "tisch",
    productName: "Esstisch Eiche massiv",
    sku: "ET-118",
    productGroup: "furniture",
    granularity: "model",
    readinessPercent: 41,
  },
  {
    id: "jeans",
    productName: "Jeans Stretch",
    sku: "JE-501",
    productGroup: "textile",
    granularity: "batch",
    readinessPercent: 100,
    latestVersion: { version: 7, publishedAt: "2026-10-21T10:00:00+02:00" },
    registration: { registrationId: "REG-DEMO-0007" },
  },
];
