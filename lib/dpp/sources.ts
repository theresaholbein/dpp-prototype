import { PCF_RECORDS, type PcfRecord } from "../../data/sources/pcf.ts";
import { PPWR_RECORDS, type PpwrRecord } from "../../data/sources/ppwr.ts";
import { PRODUCT_RECORDS, type ProductRecord } from "../../data/sources/products.ts";
import { SUPPLIER_RECORDS, type SupplierRecord } from "../../data/sources/supplier.ts";

/**
 * Eine Lese-Funktion pro Quellmodul (SPEC §5). Heute Mock-Daten aus data/sources/,
 * später die echten Module. Der DPP liest nur, er schreibt keine Fachdaten zurück.
 */

export function getProductData(sku: string): ProductRecord | undefined {
  return PRODUCT_RECORDS.find((r) => r.sku === sku);
}

export function getPcfData(sku: string): PcfRecord | undefined {
  return PCF_RECORDS.find((r) => r.sku === sku);
}

export function getSupplierData(sku: string): SupplierRecord | undefined {
  return SUPPLIER_RECORDS.find((r) => r.sku === sku);
}

export function getPpwrData(sku: string): PpwrRecord | undefined {
  return PPWR_RECORDS.find((r) => r.sku === sku);
}
