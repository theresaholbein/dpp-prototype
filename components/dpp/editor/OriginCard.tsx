"use client";

import Link from "next/link";
import { ArrowRight, Lock, Pencil } from "lucide-react";
import { AppButton } from "@/components/ui/AppButton";
import { AppCard } from "@/components/ui/AppCard";
import { AppTag } from "@/components/ui/AppTag";
import {
  ACCESS_AUDIENCE,
  ACCESS_LABEL,
  ACCESS_SEVERITY,
  GRANULARITY_LABEL,
  SOURCE_DESCRIPTION,
  SOURCE_HREF,
  SOURCE_MISSING_ACTION,
} from "@/lib/dpp/labels";
import type { FieldMeta } from "@/lib/dpp/editor";
import type { DataElement } from "@/lib/dpp/types";
import type { Editability } from "@/lib/dpp/working-copy";

/** Herkunft des gewählten Felds: Modul, Datensatz, Version, Zugriffsebene und Aktion (SPEC §6.2). */
export function OriginCard({
  element,
  meta,
  editability,
  onEdit,
}: {
  element: DataElement | null;
  meta: FieldMeta | null;
  editability: Editability | null;
  onEdit: () => void;
}) {
  return (
    <AppCard>
      <div className="flex flex-col gap-4">
        <h2 className="text-sm font-medium text-ui-text-muted">Herkunft des Feldes</h2>
        {!element || !meta ? (
          <p className="text-sm text-ui-text-muted">Feld anklicken, um Quelle, Stand und Zugriffsebene zu sehen.</p>
        ) : (
          <>
            <span className="break-words text-lg font-medium text-ui-text-strong">{meta.label}</span>
            <dl className="flex flex-col gap-2 text-sm">
              <Row term="Quelle" value={SOURCE_DESCRIPTION[element.source.module]} />
              {element.source.dataset ? <Row term="Datensatz" value={element.source.dataset} /> : null}
              {element.source.version ? <Row term="Version" value={element.source.version} /> : null}
              {element.inheritedFrom ? <Row term="Geerbt von" value={`Ebene ${GRANULARITY_LABEL[element.inheritedFrom]}`} /> : null}
              <Row term="Template" value={meta.templateName} />
              <div className="flex flex-col gap-1">
                <dt className="text-ui-text-muted">Zugriffsebene</dt>
                <dd className="flex flex-col gap-1">
                  <AppTag value={ACCESS_LABEL[element.accessLevel]} severity={ACCESS_SEVERITY[element.accessLevel]} rounded />
                  <span className="text-ui-text">Sichtbar für {ACCESS_AUDIENCE[element.accessLevel]}</span>
                </dd>
              </div>
            </dl>
            <Action element={element} editability={editability} onEdit={onEdit} />
          </>
        )}
      </div>
    </AppCard>
  );
}

function Row({ term, value }: { term: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-ui-text-muted">{term}</dt>
      <dd className="break-words text-ui-text">{value}</dd>
    </div>
  );
}

function Action({ element, editability, onEdit }: { element: DataElement; editability: Editability | null; onEdit: () => void }) {
  if (editability === "editable") {
    return <AppButton variant="primary" mode="outlined" size="small" icon={Pencil} label="Wert bearbeiten" onClick={onEdit} className="self-start" />;
  }
  if (editability === "granularity-locked") {
    return (
      <p className="flex items-start gap-2 text-sm text-ui-text">
        <Lock size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-ui-text-muted" />
        Nach der ersten Veröffentlichung fest.
      </p>
    );
  }
  const source = element.source.module;
  if (source === "manual") return null;
  const label = element.state === "missing" ? SOURCE_MISSING_ACTION[source] : "In Quelle öffnen";
  return (
    <Link
      href={SOURCE_HREF[source]}
      className="inline-flex w-fit items-center gap-2 rounded-ui-sm border border-primary-200 px-2.5 py-1.5 text-sm font-medium text-primary-500 transition-colors duration-(--ui-duration) hover:bg-primary-50 active:bg-primary-100"
    >
      <ArrowRight size={16} aria-hidden="true" />
      {label}
    </Link>
  );
}
