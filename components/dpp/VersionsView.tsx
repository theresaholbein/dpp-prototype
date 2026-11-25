"use client";

import { CalendarSearch, History, Send } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AppButton } from "@/components/ui/AppButton";
import { AppCard } from "@/components/ui/AppCard";
import { AppField, AppInput } from "@/components/ui/AppInput";
import { AppTag } from "@/components/ui/AppTag";
import { CardHeading } from "@/components/ui/CardHeading";
import { sortBySection, type FieldMeta } from "@/lib/dpp/editor";
import { formatDate, formatValue } from "@/lib/dpp/format";
import { versionAt } from "@/lib/dpp/publish";
import { filterForRole, getRole } from "@/lib/dpp/roles";
import type { Passport, PassVersion } from "@/lib/dpp/types";
import { usePassState } from "@/lib/dpp/use-working-copy";

/**
 * Versionen (SPEC §6.6): Zeitleiste und „Stand am Datum“ (EN 18222 ReadDPPVersionByIdAndDate, empfohlen).
 * Gesucht wird nur in veröffentlichten Versionen, nie im Arbeitsstand. Das Datum steht in der URL (?date=YYYY-MM-DD).
 */
export function VersionsView({ pass, meta }: { pass: Passport; meta: Record<string, FieldMeta> }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const { versions } = usePassState(pass);

  const date = params.get("date") ?? "";
  const validDate = /^\d{4}-\d{2}-\d{2}$/.test(date);
  const selected = validDate ? versionAt(versions, date) : versions.at(-1);
  const demoVersions = new Set(pass.publishedVersions.map((v) => v.version));

  const setDate = (value: string) => {
    router.replace(value ? `${pathname}?date=${value}` : pathname, { scroll: false });
  };

  if (versions.length === 0) {
    return (
      <AppCard padding="large" className="items-center text-center">
        <History size={32} aria-hidden="true" className="text-ui-text-muted" />
        <p className="text-lg font-medium text-ui-text-strong">Noch nicht veröffentlicht</p>
        <p className="text-ui-text-muted">Versionen entstehen beim Veröffentlichen und sind danach unveränderlich.</p>
        <AppButton href={`/products/passports/${pass.id}/publish`} icon={Send} label="Zum Veröffentlichen" />
      </AppCard>
    );
  }

  const label = (id: string) => meta[id]?.label ?? id;

  return (
    <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_24rem]">
      <AppCard>
        <section aria-labelledby="history-title" className="flex flex-col gap-4">
          <CardHeading id="history-title" icon={History}>
            Versionsverlauf
          </CardHeading>
          <ol className="flex flex-col gap-2">
            {[...versions].reverse().map((v) => {
              const active = v === selected;
              return (
                <li key={v.version} aria-current={active ? "true" : undefined}>
                  <div
                    className={`flex flex-col gap-2 rounded-ui-lg border p-4 ${active ? "border-primary-500 bg-primary-50" : "border-ui-border"}`}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-lg font-medium text-ui-text-strong">v{v.version}</span>
                      <span className="text-ui-text">
                        {formatDate(v.publishedAt)} · {v.actor}
                      </span>
                      {active ? <AppTag value={validDate ? "Gültig am gewählten Datum" : "Aktuelle Version"} severity="primary" /> : null}
                      {!demoVersions.has(v.version) ? <AppTag value="Nur in diesem Browser" severity="secondary" /> : null}
                    </div>
                    {v.note ? <p className="text-ui-text">{v.note}</p> : null}
                    <p className="text-sm text-ui-text-muted">
                      {v.previousVersion === null
                        ? "Erste Version"
                        : v.changedFields.length === 0
                          ? "Keine geänderten Felder"
                          : `Geändert: ${v.changedFields.map(label).join(", ")}`}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>
      </AppCard>

      <AppCard>
        <section aria-labelledby="asof-title" className="flex flex-col gap-4">
          <CardHeading id="asof-title" icon={CalendarSearch}>
            Stand am Datum
          </CardHeading>
          <AppField
            label="Datum"
            htmlFor="asof"
            hint="Ruft die Fassung ab, die an diesem Tag gültig war (EN 18222 empfiehlt dafür „ReadDPPVersionByIdAndDate“)."
            hintId="asof-hint"
          >
            <AppInput id="asof" type="date" value={validDate ? date : ""} aria-describedby="asof-hint" onChange={(e) => setDate(e.target.value)} />
          </AppField>
          <p aria-live="polite" className="font-medium text-ui-text-strong">
            {selected
              ? validDate
                ? `Am ${formatDate(`${date}T12:00:00Z`)} gültig: v${selected.version} vom ${formatDate(selected.publishedAt)}`
                : `Ohne Datum: aktuelle Version v${selected.version}`
              : `Am ${formatDate(`${date}T12:00:00Z`)} gab es noch keine veröffentlichte Version.`}
          </p>
          {selected ? <PublicFields version={selected} meta={meta} /> : null}
        </section>
      </AppCard>
    </div>
  );
}

/** Öffentliche Felder einer Version, wie sie die öffentliche Passseite zeigt. */
function PublicFields({ version, meta }: { version: PassVersion; meta: Record<string, FieldMeta> }) {
  const { visible } = filterForRole(sortBySection(version.elements, meta), getRole("consumer"));
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-ui-text">Öffentliche Felder in v{version.version}</span>
      <dl className="flex flex-col gap-2">
        {visible.map((e) => {
          const text = formatValue(e.value);
          return (
            <div key={e.elementId} className="flex flex-col">
              <dt className="text-sm text-ui-text-muted">{meta[e.elementId]?.label ?? e.elementId}</dt>
              <dd className={`break-words ${text === null ? "text-ui-text-muted" : "text-ui-text-strong"}`}>{text ?? "Keine Angabe"}</dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}
