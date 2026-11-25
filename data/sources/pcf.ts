/** Mock Modul Produkt-CO2e-Bilanz (fiktiv). */
export type PcfRecord = { sku: string; dataset: string; version: string; pcfPerUnit: string; method: string; releasedAt: string };

export const PCF_RECORDS: PcfRecord[] = [
  { sku: "TS-1042", dataset: "PCF TS-1042 Charge L2026-114", version: "Berechnung 3", pcfPerUnit: "4,1 kg CO2e je Stück", method: "ISO 14067", releasedAt: "2026-11-22" },
  { sku: "SE-220", dataset: "PCF SE-220", version: "Berechnung 1", pcfPerUnit: "86 kg CO2e je Stück", method: "ISO 14067", releasedAt: "2025-09-30" },
];
