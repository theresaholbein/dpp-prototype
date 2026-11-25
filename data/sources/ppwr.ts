/** Mock Modul PPWR (Verpackung). Im MVP noch ohne Daten; Anschluss folgt (SPEC §5, §12). */
export type PpwrRecord = { sku: string; dataset: string; version: string; attributes: Record<string, string | null> };

export const PPWR_RECORDS: PpwrRecord[] = [];
