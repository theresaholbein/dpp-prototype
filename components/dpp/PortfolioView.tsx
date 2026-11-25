"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useState } from "react";
import { AppButton } from "@/components/ui/AppButton";
import { AppTag } from "@/components/ui/AppTag";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Tooltip } from "@/components/ui/Tooltip";
import { formatDate } from "@/lib/dpp/format";
import { GRANULARITY_LABEL, PRODUCT_GROUP_LABEL, READINESS_HINT, STATUS_LABEL, STATUS_SEVERITY } from "@/lib/dpp/labels";
import type { PortfolioRow } from "@/lib/dpp/portfolio";
import type { ProductGroup } from "@/lib/dpp/types";

type GroupFilter = "all" | ProductGroup;

const FILTERS: { value: GroupFilter; label: string }[] = [
  { value: "all", label: "Alle" },
  { value: "textile", label: PRODUCT_GROUP_LABEL.textile },
  { value: "furniture", label: PRODUCT_GROUP_LABEL.furniture },
];

const COLUMNS = ["Produkt", "Template", "Ebene", "Pflichtfelder", "Status", "Letzte Version"];

/**
 * Portfolio-Tabelle mit Produktgruppen-Filter (SPEC §6.1).
 * Zeilen berechnet der Server; hier liegt nur der Filter. Ab Schritt 5 kommt der Browser-Stand dazu.
 */
export function PortfolioView({ rows }: { rows: PortfolioRow[] }) {
  const [group, setGroup] = useState<GroupFilter>("all");
  const visible = rows.filter((r) => group === "all" || r.productGroup === group);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <SegmentedControl label="Produktgruppe" options={FILTERS} value={group} onChange={setGroup} />
        <AppButton label="Pass anlegen" icon={Plus} />
      </div>

      <div className="overflow-x-auto rounded-ui-xl border border-ui-border bg-ui-surface">
        <table className="w-full min-w-220 border-collapse text-left text-base">
          <thead>
            <tr className="bg-ui-surface-muted">
              {COLUMNS.map((c) => (
                <th key={c} scope="col" className="whitespace-nowrap border-b border-ui-border p-4 font-medium text-ui-text-strong">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td colSpan={COLUMNS.length} className="p-8 text-center text-ui-text-muted">
                  Keine Produktpässe in dieser Produktgruppe.
                </td>
              </tr>
            ) : (
              visible.map((r) => <Row key={r.id} row={r} />)
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Row({ row }: { row: PortfolioRow }) {
  return (
    <tr className="border-b border-ui-border-hairline last:border-b-0">
      <td className="p-4 align-top">
        <div className="flex flex-col gap-1">
          {row.canOpen ? (
            <Link
              href={`/products/passports/${row.id}`}
              className="w-fit font-medium text-primary-500 hover:text-primary-700"
            >
              {row.productName}
            </Link>
          ) : (
            <span className="font-medium text-ui-text-strong">{row.productName}</span>
          )}
          <span className="text-sm text-ui-text-muted">
            {row.sku} · {PRODUCT_GROUP_LABEL[row.productGroup]}
            {row.canOpen ? null : " · Demo-Zeile"}
          </span>
        </div>
      </td>
      <td className="p-4 align-top text-ui-text">{row.templateLabel}</td>
      <td className="p-4 align-top text-ui-text">{GRANULARITY_LABEL[row.granularity]}</td>
      <td className="p-4 align-top">
        <Tooltip label={READINESS_HINT} describe wrap>
          <span tabIndex={0} className="flex items-center gap-2 rounded-ui-sm text-ui-text">
            <span className="w-12 whitespace-nowrap text-right tabular-nums">{row.readinessPercent} %</span>
            <span className="h-2 w-24 overflow-hidden rounded-full bg-surface-200" aria-hidden="true">
              <span className="block h-full rounded-full bg-primary-500" style={{ width: `${row.readinessPercent}%` }} />
            </span>
          </span>
        </Tooltip>
      </td>
      <td className="p-4 align-top">
        <div className="flex flex-col gap-1">
          <AppTag value={STATUS_LABEL[row.status]} severity={STATUS_SEVERITY[row.status]} />
          {row.changesSince ? <span className="text-sm text-ui-text-muted">Änderungen seit v{row.changesSince}</span> : null}
        </div>
      </td>
      <td className="whitespace-nowrap p-4 align-top text-ui-text">
        {row.latestVersion ? `v${row.latestVersion.version} · ${formatDate(row.latestVersion.publishedAt)}` : "–"}
      </td>
    </tr>
  );
}
