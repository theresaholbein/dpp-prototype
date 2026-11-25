"use client";

import { useEffect } from "react";
import { ChevronLeft, ChevronRight, Lock, PanelLeftOpen } from "lucide-react";
import { AppButton } from "@/components/ui/AppButton";
import { AppTag } from "@/components/ui/AppTag";
import { Tooltip } from "@/components/ui/Tooltip";
import type { FieldMeta } from "@/lib/dpp/editor";
import { formatValue } from "@/lib/dpp/format";
import {
  ACCESS_LABEL,
  ACCESS_SEVERITY,
  REQUIREMENT_LABEL,
  SECTION_LABEL,
  SOURCE_LABEL,
  STATE_LABEL,
  STATE_SEVERITY,
} from "@/lib/dpp/labels";
import type { DataElement, ElementValue } from "@/lib/dpp/types";
import type { Editability } from "@/lib/dpp/working-copy";
import { FieldEditForm } from "./FieldEditForm";

type Props = {
  title: string;
  showSection: boolean;
  elements: DataElement[];
  meta: Record<string, FieldMeta>;
  selectedId: string | null;
  editabilityOf: (e: DataElement) => Editability;
  sidebarHidden: boolean;
  onShowSidebar: () => void;
  onSelect: (elementId: string) => void;
  onSave: (element: DataElement, value: ElementValue | null) => void;
  onPrev: (() => void) | null;
  onNext: (() => void) | null;
};

/** Feldliste der Mitte: Wert, Tags für Einstufung, Quelle, Zustand und Zugriffsebene; gewähltes Feld klappt auf (SPEC §6.2). */
export function FieldList({
  title,
  showSection,
  elements,
  meta,
  selectedId,
  editabilityOf,
  sidebarHidden,
  onShowSidebar,
  onSelect,
  onSave,
  onPrev,
  onNext,
}: Props) {
  // Gewähltes Feld sichtbar halten, z. B. nach Klick in „Offene Felder“ oder „Nächstes Feld“.
  useEffect(() => {
    if (selectedId) document.getElementById(`row-${selectedId}`)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [selectedId]);

  return (
    <section aria-labelledby="field-list-title" className="flex min-w-0 flex-col rounded-ui-xl border border-ui-border bg-ui-surface">
      <div className="flex items-center gap-2 border-b border-ui-border-hairline p-4">
        {sidebarHidden ? (
          <Tooltip label="Seitenleiste einblenden">
            <AppButton variant="primary" mode="text" icon={PanelLeftOpen} aria-label="Seitenleiste einblenden" onClick={onShowSidebar} />
          </Tooltip>
        ) : null}
        <h2 id="field-list-title" className="text-lg font-medium text-ui-text-strong">
          {title}
        </h2>
        <span className="text-sm text-ui-text-muted">{elements.length === 1 ? "1 Feld" : `${elements.length} Felder`}</span>
      </div>

      {elements.length === 0 ? (
        <p className="p-8 text-center text-ui-text-muted">Keine Felder in diesem Abschnitt.</p>
      ) : (
        <ul>
          {elements.map((e) => {
            const m = meta[e.elementId];
            const selected = e.elementId === selectedId;
            const text = formatValue(e.value);
            return (
              <li key={e.elementId} id={`row-${e.elementId}`} className="scroll-mt-(--ui-header-height) border-b border-ui-border-hairline last:border-b-0">
                <button
                  type="button"
                  aria-expanded={selected}
                  aria-controls={selected ? `detail-${e.elementId}` : undefined}
                  onClick={() => onSelect(e.elementId)}
                  className={`flex w-full cursor-pointer flex-wrap items-center justify-between gap-4 p-4 text-left transition-colors duration-(--ui-duration) ${
                    selected ? "bg-ui-surface-selected" : "hover:bg-surface-100"
                  }`}
                >
                  <span className="flex min-w-0 flex-1 basis-60 flex-col gap-1">
                    {showSection ? <span className="text-sm text-ui-text-muted">{SECTION_LABEL[m.section]}</span> : null}
                    <span className="break-words font-medium text-ui-text-strong">{m.label}</span>
                    <span className={`break-words ${text === null ? "text-red-110" : "text-ui-text"}`}>{text ?? "Noch kein Wert"}</span>
                  </span>
                  <span className="flex flex-wrap items-center gap-2">
                    <AppTag value={REQUIREMENT_LABEL[m.requirement]} severity={m.requirement === "required" ? "primary" : "secondary"} />
                    <AppTag value={SOURCE_LABEL[e.source.module]} severity="secondary" />
                    <AppTag value={STATE_LABEL[e.state]} severity={STATE_SEVERITY[e.state]} />
                    <AppTag value={ACCESS_LABEL[e.accessLevel]} severity={ACCESS_SEVERITY[e.accessLevel]} rounded />
                  </span>
                </button>
                {selected ? (
                  <FieldDetail element={e} meta={m} editability={editabilityOf(e)} onSave={(v) => onSave(e, v)} />
                ) : null}
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-auto flex items-center justify-between gap-4 border-t border-ui-border-hairline p-4">
        <AppButton variant="primary" mode="text" icon={ChevronLeft} label="Vorheriges Feld" onClick={onPrev ?? undefined} disabled={!onPrev} />
        <AppButton variant="primary" mode="text" icon={ChevronRight} iconRight label="Nächstes Feld" onClick={onNext ?? undefined} disabled={!onNext} />
      </div>
    </section>
  );
}

function FieldDetail({
  element,
  meta,
  editability,
  onSave,
}: {
  element: DataElement;
  meta: FieldMeta;
  editability: Editability;
  onSave: (value: ElementValue | null) => void;
}) {
  const v = element.value;
  return (
    <div id={`detail-${element.elementId}`} className="flex flex-col gap-4 border-t border-ui-border-hairline p-4">
      {v?.kind === "RelatedResource" ? <p className="break-all text-sm text-ui-text-muted">{v.href}</p> : null}
      {v?.kind === "MultiLanguage" && v.values.en ? <p className="text-sm text-ui-text-muted">Englisch: {v.values.en}</p> : null}
      {meta.hint ? <p className="text-sm text-ui-text-muted">Hinweis aus dem Template: {meta.hint}</p> : null}
      {editability === "editable" ? (
        <FieldEditForm key={JSON.stringify(v)} element={element} type={meta.elementType} label={meta.label} onSave={onSave} />
      ) : editability === "granularity-locked" ? (
        <p className="flex items-start gap-2 text-ui-text">
          <Lock size={16} aria-hidden="true" className="mt-1 shrink-0 text-ui-text-muted" />
          Die Ebene ist nach der ersten Veröffentlichung fest. Für eine andere Ebene einen neuen, verknüpften Pass anlegen.
        </p>
      ) : (
        <p className="text-sm text-ui-text-muted">
          Der Wert kommt aus einem anderen Modul (Quelle rechts). Der Pass übernimmt ihn und schreibt nicht zurück.
        </p>
      )}
    </div>
  );
}
