/** Mock Modul Lieferkette: Antworten aus Lieferantenfragebögen (fiktiv). */
export type SupplierRecord = {
  sku: string;
  dataset: string;
  version: string;
  attributes: Record<string, string | null>;
};

export const SUPPLIER_RECORDS: SupplierRecord[] = [
  {
    sku: "TS-1042",
    dataset: "Lieferantenfragebogen Muster Textil GmbH",
    version: "03/2026",
    attributes: {
      manufacturerName: "Muster Textil GmbH",
      operatorId: null,
      facility: "Werk 2, Musterstadt",
      fibreOrigin: null,
      substancesOfConcern: "Keine über 0,1 % (Erklärung 03/2026)",
      substanceList: "TS-1042_Stoffe.pdf",
    },
  },
  {
    sku: "SE-220",
    dataset: "Lieferantenfragebogen Muster Möbelwerk GmbH",
    version: "09/2026",
    attributes: {
      manufacturerName: "Muster Möbelwerk GmbH",
      operatorId: null,
      facility: null,
      substancesOfConcern: "Keine über 0,1 %",
      substanceList: null,
    },
  },
];
