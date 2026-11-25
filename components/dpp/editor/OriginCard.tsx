"use client";

import { ArrowRight, Lock, Pencil, Waypoints } from "lucide-react";
import { AppButton } from "@/components/ui/AppButton";
import { AppCard } from "@/components/ui/AppCard";
import { AppTag } from "@/components/ui/AppTag";
import { CardHeading } from "@/components/ui/CardHeading";
import type { FieldMeta } from "@/lib/dpp/editor";
import {
  ACCESS_AUDIENCE,
  ACCESS_LABEL,
  ACCESS_SEVERITY,
  GRANULARITY_LABEL,
  SOURCE_DESCRIPTION,
  SOURCE_HREF,
  SOURCE_MISSING_ACTION,
} from "@/lib/dpp/labels";
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
        <CardHeading icon={Waypoints}>Herkunft des Feldes</CardHeading>
        {!element || !meta ? (
          <p className="text-sm text-ui-text-muted">Feld anklicken, um Quelle, Stand und Zugriffsebene zu sehen.</p>
        ) : (
          <>
            <span className="break-words font-medium text-ui-text-strong">{meta.label}</span>
            <dl className="flex flex-col gap-4 text-sm">
              <Row term="Quelle" value={SOURCE_DESCRIPTION[element.source.module]} />
              {element.source.dataset ? <Row term="Datensatz" value={element.source.dataset} /> : null}
              {element.source.version ? <Row term="Version" value={element.source.version} /> : null}
              {element.inheritedFrom ? <Row term="Geerbt von" value={`Ebene ${GRANULARITY_LABEL[element.inheritedFrom]}`} /> : null}
              <Row term="Template" value={meta.templateName} />
              <div className="flex flex-col gap-2">
                <dt className="text-ui-text-muted">Zugriffsebene</dt>
                <dd className="flex flex-col gap-2">
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
    <div className="flex flex-col">
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
      <p className="flex items-center gap-2 text-sm text-ui-text">
        <Lock size={16} aria-hidden="true" className="shrink-0 text-ui-text-muted" />
        Nach der ersten Veröffentlichung fest.
      </p>
    );
  }
  const source = element.source.module;
  if (source === "manual") return null;
  const label = element.state === "missing" ? SOURCE_MISSING_ACTION[source] : "In Quelle öffnen";
  return <AppButton href={SOURCE_HREF[source]} variant="primary" mode="outlined" size="small" icon={ArrowRight} label={label} className="self-start" />;
}
