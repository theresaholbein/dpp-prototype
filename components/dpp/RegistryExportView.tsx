"use client";

import { Download, FileOutput } from "lucide-react";
import { useMemo, useState } from "react";
import { AppButton } from "@/components/ui/AppButton";
import { AppCard } from "@/components/ui/AppCard";
import { AppMessage } from "@/components/ui/AppMessage";
import { AppTag, type TagSeverity } from "@/components/ui/AppTag";
import { CardHeading } from "@/components/ui/CardHeading";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { useToast } from "@/components/ui/Toast";
import { PRODUCT_GROUP_LABEL, STATUS_LABEL, STATUS_SEVERITY } from "@/lib/dpp/labels";
import { passState } from "@/lib/dpp/pass-state";
import {
  MAX_ITEMS_PER_FILE,
  REGISTRY_FORMAT_NOTICE,
  buildRegistryExport,
  candidateFromPassport,
  candidateFromSummary,
  type RegistryFile,
  type RegistryFormat,
  type RegistryOutcome,
  type RegistryResult,
} from "@/lib/dpp/registry";
import { deriveWorkflowStatus } from "@/lib/dpp/status";
import type { Passport, PassSummary } from "@/lib/dpp/types";
import { useDemoStore } from "@/lib/dpp/use-working-copy";

const FORMATS: { value: RegistryFormat; label: string }[] = [
  { value: "json", label: "JSON" },
  { value: "xml", label: "XML" },
];

const OUTCOME: Record<RegistryOutcome, { label: string; severity: TagSeverity }> = {
  included: { label: "Aufgenommen", severity: "success" },
  error: { label: "Fehler", severity: "danger" },
  registered: { label: "Bereits registriert", severity: "secondary" },
};

const COLUMNS = ["Produkt", "Status", "Öffentliche Version", "Ergebnis"];

function download(file: RegistryFile) {
  const href = URL.createObjectURL(new Blob([file.content], { type: file.mimeType }));
  const a = document.createElement("a");
  a.href = href;
  a.download = file.filename;
  a.click();
  URL.revokeObjectURL(href);
}

/**
 * Registry & Export (SPEC §6.5, §8): Pässe auswählen (max. 100), Format wählen, Upload-Datei je Produktgruppe erzeugen.
 * In die Datei kommt die letzte öffentlich ausgelieferte Version; Ergebnis je Zeile in der Tabelle.
 */
export function RegistryExportView({ passports, summaries }: { passports: Passport[]; summaries: PassSummary[] }) {
  const store = useDemoStore();
  const candidates = useMemo(
    () => [
      ...passports.map((p) => candidateFromPassport(p, passState(p, store.edits(p.id), store.versions(p.id)))),
      ...summaries.map((s) =>
        candidateFromSummary(s, deriveWorkflowStatus({ versionCount: s.latestVersion ? 1 : 0, registered: !!s.registration })),
      ),
    ],
    [passports, summaries, store],
  );

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [format, setFormat] = useState<RegistryFormat>("json");
  const [outcome, setOutcome] = useState<{ files: RegistryFile[]; results: RegistryResult[] } | null>(null);
  const { showToast, toastRegion } = useToast();

  const full = selected.size >= MAX_ITEMS_PER_FILE;
  const allSelected = candidates.length > 0 && candidates.every((c) => selected.has(c.id));
  const resultById = new Map(outcome?.results.map((r) => [r.id, r]));

  const change = (next: Set<string>) => {
    setSelected(next);
    setOutcome(null);
  };
  const toggle = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    change(next);
  };
  const toggleAll = () => change(allSelected ? new Set() : new Set(candidates.slice(0, MAX_ITEMS_PER_FILE).map((c) => c.id)));

  const generate = () => {
    try {
      const result = buildRegistryExport(
        candidates.filter((c) => selected.has(c.id)),
        format,
        new Date(),
      );
      setOutcome(result);
      result.files.forEach(download);
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Upload-Datei konnte nicht erzeugt werden.", "error");
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <AppMessage severity="warn">{REGISTRY_FORMAT_NOTICE} Die Registrierung selbst ist im Prototyp nicht angebunden.</AppMessage>

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <SegmentedControl label="Format" options={FORMATS} value={format} onChange={(f) => { setFormat(f); setOutcome(null); }} />
            <span className="text-base text-ui-text-muted tabular-nums" aria-live="polite">
              {selected.size} von max. {MAX_ITEMS_PER_FILE} ausgewählt
            </span>
          </div>
          <AppButton label="Upload-Datei erzeugen" icon={FileOutput} disabled={selected.size === 0} onClick={generate} />
        </div>

        <div className="overflow-x-auto rounded-ui-xl border border-ui-border bg-ui-surface">
          <table className="w-full min-w-200 border-collapse text-left text-base">
            <thead>
              <tr className="bg-ui-surface-muted">
                <th scope="col" className="w-12 border-b border-ui-border p-4">
                  <label className="flex size-6 cursor-pointer items-center justify-center">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      disabled={candidates.length === 0}
                      onChange={toggleAll}
                      aria-label="Alle auswählen"
                      className="size-4 cursor-pointer accent-primary-500"
                    />
                  </label>
                </th>
                {COLUMNS.map((c) => (
                  <th key={c} scope="col" className="whitespace-nowrap border-b border-ui-border p-4 font-medium text-ui-text-strong">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {candidates.length === 0 ? (
                <tr>
                  <td colSpan={COLUMNS.length + 1} className="p-8 text-center text-ui-text-muted">
                    Keine Produktpässe vorhanden.
                  </td>
                </tr>
              ) : (
                candidates.map((c) => {
                  const checked = selected.has(c.id);
                  const result = resultById.get(c.id);
                  return (
                    <tr key={c.id} className="border-b border-ui-border-hairline last:border-b-0">
                      <td className="p-4 align-top">
                        <label className="flex size-6 cursor-pointer items-center justify-center">
                          <input
                            type="checkbox"
                            checked={checked}
                            disabled={!checked && full}
                            onChange={() => toggle(c.id)}
                            aria-label={`${c.productName} auswählen`}
                            className="size-4 cursor-pointer accent-primary-500 disabled:cursor-not-allowed"
                          />
                        </label>
                      </td>
                      <td className="p-4 align-top">
                        <div className="flex flex-col gap-1">
                          <span className="font-medium text-ui-text-strong">{c.productName}</span>
                          <span className="text-sm text-ui-text-muted">
                            {c.sku} · {PRODUCT_GROUP_LABEL[c.productGroup]}
                            {c.passport ? null : " · Demo-Zeile"}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 align-top">
                        <AppTag value={STATUS_LABEL[c.status]} severity={STATUS_SEVERITY[c.status]} />
                      </td>
                      <td className="p-4 align-top">
                        <div className="flex flex-col gap-1">
                          <span className="text-ui-text tabular-nums">{c.publicVersion ? `v${c.publicVersion}` : "–"}</span>
                          {c.notes.map((n) => (
                            <span key={n} className="text-sm text-ui-text-muted">
                              {n}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4 align-top">
                        {result ? <ResultCell result={result} /> : <span className="text-ui-text-muted">–</span>}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {outcome ? <FilesCard files={outcome.files} /> : null}
      {toastRegion}
    </div>
  );
}

function ResultCell({ result }: { result: RegistryResult }) {
  const o = OUTCOME[result.outcome];
  return (
    <div className="flex flex-col gap-1">
      <AppTag value={o.label} severity={o.severity} />
      <span className="text-sm text-ui-text">{result.message}</span>
      {result.warnings.map((w) => (
        <span key={w} className="text-sm text-ui-text-muted">
          {w}
        </span>
      ))}
    </div>
  );
}

function FilesCard({ files }: { files: RegistryFile[] }) {
  return (
    <AppCard>
      <section aria-labelledby="files-title" className="flex flex-col gap-4">
        <CardHeading id="files-title" icon={FileOutput}>
          Upload-Dateien
        </CardHeading>
        {files.length === 0 ? (
          <AppMessage severity="secondary">Keine Datei erzeugt: Kein ausgewählter Pass konnte aufgenommen werden.</AppMessage>
        ) : (
          <ul className="flex flex-col gap-2">
            {files.map((f) => (
              <li key={f.filename} className="flex flex-wrap items-center justify-between gap-2">
                <span className="min-w-0 break-all text-ui-text">
                  {f.filename} · {PRODUCT_GROUP_LABEL[f.productGroup]} · {f.itemCount} {f.itemCount === 1 ? "Pass" : "Pässe"}
                </span>
                <AppButton variant="primary" mode="text" size="small" icon={Download} label="Erneut herunterladen" onClick={() => download(f)} />
              </li>
            ))}
          </ul>
        )}
        <span className="text-sm text-ui-text-muted">{REGISTRY_FORMAT_NOTICE}</span>
      </section>
    </AppCard>
  );
}
