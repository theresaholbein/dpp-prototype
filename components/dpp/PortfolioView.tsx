"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { AppButton } from "@/components/ui/AppButton";
import { ResetDemoButton } from "@/components/dpp/ResetDemoButton";
import { AppCard } from "@/components/ui/AppCard";
import { AppTag } from "@/components/ui/AppTag";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Tooltip } from "@/components/ui/Tooltip";
import { formatDate } from "@/lib/dpp/format";
import { GRANULARITY_LABEL, PRODUCT_GROUP_LABEL, READINESS_HINT, STATUS_LABEL, STATUS_SEVERITY } from "@/lib/dpp/labels";
import { passState } from "@/lib/dpp/pass-state";
import { getPortfolioKpis, rowFromState, type PortfolioRow } from "@/lib/dpp/portfolio";
import type { Passport, ProductGroup } from "@/lib/dpp/types";
import { useDemoStore } from "@/lib/dpp/use-working-copy";

type GroupFilter = "all" | ProductGroup;

const FILTERS: { value: GroupFilter; label: string }[] = [
  { value: "all", label: "Alle" },
  { value: "textile", label: PRODUCT_GROUP_LABEL.textile },
  { value: "furniture", label: PRODUCT_GROUP_LABEL.furniture },
];

const COLUMNS = ["Produkt", "Template", "Ebene", "Pflichtfelder", "Status", "Letzte Version"];

/**
 * Kennzahlen und Portfolio-Tabelle mit Produktgruppen-Filter (SPEC §6.1).
 * Der Server liefert die Zeilen aus den Demo-Daten; im Browser kommen Änderungen und Veröffentlichungen dazu.
 */
export function PortfolioView({ rows: serverRows, passports }: { rows: PortfolioRow[]; passports: Passport[] }) {
  const [group, setGroup] = useState<GroupFilter>("all");
  const store = useDemoStore();
  const rows = useMemo(
    () =>
      serverRows.map((r) => {
        const p = passports.find((x) => x.id === r.id);
        return p ? rowFromState(p, passState(p, store.edits(p.id), store.versions(p.id))) : r;
      }),
    [serverRows, passports, store],
  );
  const visible = rows.filter((r) => group === "all" || r.productGroup === group);
  const kpis = getPortfolioKpis(rows);
  const cards = [
    { label: "Produktpässe", value: String(kpis.total) },
    { label: "Veröffentlicht", value: String(kpis.published) },
    { label: "Im EU-Register", value: String(kpis.registered) },
    { label: "Ø Pflichtfelder", value: `${kpis.avgReadiness} %` },
  ];

  return (
    <div className="flex flex-col gap-8">
      <section aria-label="Kennzahlen" className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <AppCard key={c.label}>
            <span className="text-sm text-ui-text-muted">{c.label}</span>
            <span className="text-2xl font-medium text-ui-text-strong tabular-nums">{c.value}</span>
          </AppCard>
        ))}
      </section>
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
        <div className="flex justify-end">
          <ResetDemoButton />
        </div>
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
            <ProgressBar percent={row.readinessPercent} className="w-24" />
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
