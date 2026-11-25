"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useToast } from "@/components/ui/Toast";
import { sortBySection, type FieldMeta } from "@/lib/dpp/editor";
import { SECTION_LABEL, SECTION_ORDER } from "@/lib/dpp/labels";
import { computeReadiness } from "@/lib/dpp/readiness";
import type { DataElement, ElementValue, Passport, SectionId } from "@/lib/dpp/types";
import { saveEdit, useEdits } from "@/lib/dpp/use-working-copy";
import { applyEdits, editability } from "@/lib/dpp/working-copy";
import { FieldList } from "./FieldList";
import { OriginCard } from "./OriginCard";
import { ReadinessCard } from "./ReadinessCard";
import { SectionTree, type SectionEntry } from "./SectionTree";

export type SectionFilter = "all" | SectionId;

/**
 * Pass-Editor (SPEC §6.2): Abschnitte links, Felder Mitte, Vollständigkeit und Herkunft rechts.
 * Arbeitsstand = Demo-Daten + Änderungen aus dem Browser. Abschnitt und Feld stehen in der URL.
 */
export function PassEditor({ pass, meta }: { pass: Passport; meta: Record<string, FieldMeta> }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const edits = useEdits(pass.id);
  const { showToast, toastRegion } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const elements = useMemo(() => sortBySection(applyEdits(pass.workingCopy.elements, edits), meta), [pass, edits, meta]);
  const readiness = useMemo(() => computeReadiness(elements, pass.templateIds), [elements, pass.templateIds]);
  const hasVersion = pass.publishedVersions.length > 0;
  const original = useMemo(() => new Map(pass.workingCopy.elements.map((e) => [e.elementId, e.value])), [pass]);

  const sectionParam = params.get("section");
  const section: SectionFilter = sectionParam && (SECTION_ORDER as string[]).includes(sectionParam) ? (sectionParam as SectionId) : "all";
  const selectedId = params.get("field");
  const selected = elements.find((e) => e.elementId === selectedId) ?? null;

  const visible = section === "all" ? elements : elements.filter((e) => meta[e.elementId].section === section);

  const navigate = (next: { section?: SectionFilter; field?: string | null }) => {
    const q = new URLSearchParams(params.toString());
    const s = next.section ?? section;
    if (s === "all") q.delete("section");
    else q.set("section", s);
    const f = next.field === undefined ? selectedId : next.field;
    if (f) q.set("field", f);
    else q.delete("field");
    const qs = q.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const open = (e: DataElement) => e.state !== "present";
  const entries: SectionEntry[] = [
    { id: "all", label: "Alle Felder", total: elements.length, open: elements.filter(open).length },
    ...SECTION_ORDER.map((id) => {
      const inSec = elements.filter((e) => meta[e.elementId].section === id);
      return { id, label: SECTION_LABEL[id], total: inSec.length, open: inSec.filter(open).length };
    }).filter((s) => s.total > 0),
  ];

  const openFields = elements
    .filter(open)
    .sort((a, b) => Number(meta[b.elementId].requirement === "required") - Number(meta[a.elementId].requirement === "required"));

  // Vorheriges/Nächstes Feld über alle Felder; wechselt den Abschnitt mit, wenn einer gewählt ist.
  const index = selected ? elements.indexOf(selected) : -1;
  const goTo = (i: number) => {
    const target = elements[i];
    navigate({ field: target.elementId, section: section === "all" ? "all" : meta[target.elementId].section });
  };
  const onPrev = index > 0 ? () => goTo(index - 1) : null;
  const onNext =
    index === -1
      ? visible.length > 0
        ? () => navigate({ field: visible[0].elementId })
        : null
      : index < elements.length - 1
        ? () => goTo(index + 1)
        : null;

  const pick = (elementId: string) => {
    const s = meta[elementId].section;
    navigate({ field: elementId, section: section === "all" || section === s ? section : s });
  };

  const save = (element: DataElement, value: ElementValue | null) => {
    const ok = saveEdit(pass.id, element.elementId, value, original.get(element.elementId) ?? null);
    if (ok) showToast("Gespeichert im Browser");
    else showToast("Speichern nicht möglich: Der Browser erlaubt keinen lokalen Speicher.", "error");
  };

  const editabilityOf = (e: DataElement) => editability(e, hasVersion);

  return (
    <div
      className={`grid items-start gap-4 ${
        sidebarOpen ? "xl:grid-cols-[16rem_minmax(0,1fr)_20rem]" : "xl:grid-cols-[minmax(0,1fr)_20rem]"
      }`}
    >
      {sidebarOpen ? (
        <SectionTree entries={entries} active={section} onSelect={(id) => navigate({ section: id })} onHide={() => setSidebarOpen(false)} />
      ) : null}
      <FieldList
        title={section === "all" ? "Alle Felder" : SECTION_LABEL[section]}
        showSection={section === "all"}
        elements={visible}
        meta={meta}
        selectedId={selected?.elementId ?? null}
        editabilityOf={editabilityOf}
        sidebarHidden={!sidebarOpen}
        onShowSidebar={() => setSidebarOpen(true)}
        onSelect={(id) => navigate({ field: id === selectedId ? null : id })}
        onSave={save}
        onPrev={onPrev}
        onNext={onNext}
      />
      <div className="flex flex-col gap-4">
        <ReadinessCard readiness={readiness} openFields={openFields} meta={meta} onPick={pick} />
        <OriginCard
          element={selected}
          meta={selected ? meta[selected.elementId] : null}
          editability={selected ? editabilityOf(selected) : null}
          onEdit={() => {
            if (selected) document.getElementById(`edit-${selected.elementId}`)?.focus();
          }}
        />
      </div>
      {toastRegion}
    </div>
  );
}
