"use client";

import { AppCard } from "@/components/ui/AppCard";
import { AppTag } from "@/components/ui/AppTag";
import { READINESS_HINT, REQUIREMENT_LABEL, STATE_LABEL } from "@/lib/dpp/labels";
import type { DataElement, Readiness } from "@/lib/dpp/types";
import type { FieldMeta } from "@/lib/dpp/editor";

/** Vollständigkeit der Pflichtfelder (computeReadiness) und offene Felder (SPEC §6.2). */
export function ReadinessCard({
  readiness,
  openFields,
  meta,
  onPick,
}: {
  readiness: Readiness;
  openFields: DataElement[];
  meta: Record<string, FieldMeta>;
  onPick: (elementId: string) => void;
}) {
  return (
    <AppCard>
      <div className="flex flex-col gap-4">
        <h2 className="text-sm font-medium text-ui-text-muted">Vollständigkeit</h2>
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-2xl font-medium tabular-nums text-ui-text-strong">{readiness.percent} %</span>
            <span className="text-ui-text">
              {readiness.fulfilled} von {readiness.required} Pflichtfeldern
            </span>
          </div>
          <span className="h-2 w-full overflow-hidden rounded-full bg-surface-200" aria-hidden="true">
            <span className="block h-full rounded-full bg-primary-500" style={{ width: `${readiness.percent}%` }} />
          </span>
          <div className="flex flex-wrap gap-2">
            <AppTag value={`${readiness.outdated} veraltet`} severity="warn" />
            <AppTag value={`${readiness.missing} fehlt`} severity="danger" />
          </div>
          <p className="text-xs text-ui-text-muted">{READINESS_HINT}</p>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-medium text-ui-text">Offene Felder</h3>
          {openFields.length === 0 ? (
            <p className="text-sm text-ui-text-muted">Keine offenen Felder.</p>
          ) : (
            <ul className="flex flex-col gap-1">
              {openFields.map((e) => (
                <li key={e.elementId}>
                  <button
                    type="button"
                    onClick={() => onPick(e.elementId)}
                    className="cursor-pointer rounded-ui-sm text-left text-sm text-primary-500 hover:text-primary-700"
                  >
                    {meta[e.elementId].label}{" "}
                    <span className="text-ui-text-muted">
                      ({STATE_LABEL[e.state]} · {REQUIREMENT_LABEL[meta[e.elementId].requirement]})
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </AppCard>
  );
}
