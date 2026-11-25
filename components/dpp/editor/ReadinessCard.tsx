"use client";

import { ClipboardCheck } from "lucide-react";
import { AppCard } from "@/components/ui/AppCard";
import { AppTag } from "@/components/ui/AppTag";
import { CardHeading } from "@/components/ui/CardHeading";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { FieldMeta } from "@/lib/dpp/editor";
import { READINESS_HINT, REQUIREMENT_LABEL, STATE_LABEL } from "@/lib/dpp/labels";
import type { DataElement, Readiness } from "@/lib/dpp/types";

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
        <CardHeading icon={ClipboardCheck}>Vollständigkeit</CardHeading>
        <div className="flex flex-col gap-2">
          <p className="flex flex-wrap items-baseline gap-2">
            <span className="text-lg font-bold tabular-nums text-ui-text-strong">{readiness.percent} %</span>
            <span className="text-ui-text">
              {readiness.fulfilled} von {readiness.required} Pflichtfeldern
            </span>
          </p>
          <ProgressBar percent={readiness.percent} />
          <div className="flex flex-wrap gap-2">
            <AppTag value={`${readiness.outdated} veraltet`} severity="warn" />
            <AppTag value={`${readiness.missing} fehlt`} severity="danger" />
          </div>
          <p className="text-sm text-ui-text-muted">{READINESS_HINT}</p>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-medium text-ui-text-strong">Offene Felder</h3>
          {openFields.length === 0 ? (
            <p className="text-sm text-ui-text-muted">Keine offenen Felder.</p>
          ) : (
            <ul className="flex flex-col">
              {openFields.map((e) => (
                <li key={e.elementId}>
                  <button
                    type="button"
                    onClick={() => onPick(e.elementId)}
                    className="min-h-6 w-full cursor-pointer rounded-ui-sm text-left text-sm text-primary-500 hover:text-primary-700"
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
