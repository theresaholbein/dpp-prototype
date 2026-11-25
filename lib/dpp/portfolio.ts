import { PASS_SUMMARIES } from "../../data/passports/summaries.ts";
import { PRODUCT_GROUPS } from "../../data/product-groups.ts";
import { getPassports } from "./passports.ts";
import { passState, type PassState } from "./pass-state.ts";
import { deriveWorkflowStatus } from "./status.ts";
import { GRANULARITY_KEY, granularityFromValue } from "./working-copy.ts";
import type { Granularity, Passport, ProductGroup, WorkflowStatus } from "./types.ts";

/** Eine Zeile der Portfolio-Tabelle (SPEC §6.1). Serialisierbar für Client-Komponenten. */
export type PortfolioRow = {
  id: string;
  productName: string;
  sku: string;
  productGroup: ProductGroup;
  templateLabel: string;
  granularity: Granularity;
  readinessPercent: number;
  status: WorkflowStatus;
  latestVersion: { version: number; publishedAt: string } | null;
  /** Version, seit der der Arbeitsstand Änderungen hat; null ohne Änderungen. */
  changesSince: number | null;
  /** Voller Pass mit Editor; false bei reinen Tabellenzeilen. */
  canOpen: boolean;
};

export type PortfolioKpis = { total: number; published: number; registered: number; avgReadiness: number };

/** Zeile eines vollen Passes aus seinem Stand (Demo-Daten, im Browser ergänzt um Änderungen und Versionen). */
export function rowFromState(p: Passport, state: PassState): PortfolioRow {
  const last = state.latest;
  return {
    id: p.id,
    productName: p.productName,
    sku: p.sku,
    productGroup: p.productGroup,
    templateLabel: PRODUCT_GROUPS[p.productGroup].templateLabel,
    granularity: granularityFromValue(state.elements.find((e) => e.key === GRANULARITY_KEY)?.value ?? null) ?? p.granularity,
    readinessPercent: state.readiness.percent,
    status: state.status,
    latestVersion: last ? { version: last.version, publishedAt: last.publishedAt } : null,
    changesSince: last && state.hasUnpublishedChanges ? last.version : null,
    canOpen: true,
  };
}

export function getPortfolioRows(): PortfolioRow[] {
  const full = getPassports().map((p) => rowFromState(p, passState(p, {}, [])));

  const summaries = PASS_SUMMARIES.map(
    (s): PortfolioRow => ({
      id: s.id,
      productName: s.productName,
      sku: s.sku,
      productGroup: s.productGroup,
      templateLabel: PRODUCT_GROUPS[s.productGroup].templateLabel,
      granularity: s.granularity,
      readinessPercent: s.readinessPercent,
      status: deriveWorkflowStatus({ versionCount: s.latestVersion ? 1 : 0, registered: !!s.registration }),
      latestVersion: s.latestVersion ?? null,
      changesSince: null,
      canOpen: false,
    }),
  );

  return [...full, ...summaries];
}

export function getPortfolioKpis(rows: PortfolioRow[]): PortfolioKpis {
  const avg = rows.length ? Math.round(rows.reduce((sum, r) => sum + r.readinessPercent, 0) / rows.length) : 0;
  return {
    total: rows.length,
    published: rows.filter((r) => r.status !== "draft").length,
    registered: rows.filter((r) => r.status === "registered").length,
    avgReadiness: avg,
  };
}
