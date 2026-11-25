/** Mock Modul Produkte (fiktiv). Später: Anbindung an das echte Modul (SPEC §12). */
export type ProductRecord = {
  sku: string;
  dataset: string;
  version: string;
  attributes: Record<string, string | string[] | null>;
};

export const PRODUCT_RECORDS: ProductRecord[] = [
  {
    sku: "TS-1042",
    dataset: "Stammdaten TS-1042",
    version: "2026-11-05",
    attributes: {
      uniqueProductIdentifier: "https://id.muster-textil.example/01/04012345000017/10/L2026-114",
      gtin: "04012345000017",
      hsCode: null,
      fibreComposition: "100 % Baumwolle (Bio)",
      recycledContent: "0 %",
    },
  },
  {
    sku: "SE-220",
    dataset: "Stammdaten SE-220",
    version: "2026-11-10",
    attributes: {
      uniqueProductIdentifier: "https://id.muster-moebel.example/01/04098765000021",
      hsCode: null,
      mainMaterials: ["Eiche massiv", "PU-Schaum", "Polyester-Bezug"],
      recycledContent: null,
    },
  },
];
