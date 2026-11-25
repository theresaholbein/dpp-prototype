"use client";

import { useState, type FormEvent } from "react";
import { AppButton } from "@/components/ui/AppButton";
import { AppField, AppInput, AppSelect } from "@/components/ui/AppInput";
import { GRANULARITY_LABEL } from "@/lib/dpp/labels";
import type { DataElement, ElementType, ElementValue, Granularity } from "@/lib/dpp/types";
import { GRANULARITY_KEY } from "@/lib/dpp/working-copy";

/** Formular für manuell gepflegte Felder. Leere Eingabe entfernt den Wert (Zustand „fehlt“). */

type Draft = { a: string; b: string };

function toDraft(value: ElementValue | null): Draft {
  if (!value) return { a: "", b: "" };
  switch (value.kind) {
    case "SingleValued":
      return { a: value.value, b: "" };
    case "MultiValued":
      return { a: value.values.join(", "), b: "" };
    case "MultiLanguage":
      return { a: value.values.de ?? "", b: value.values.en ?? "" };
    case "RelatedResource":
      return { a: value.label, b: value.href };
    case "Collection":
      return { a: "", b: "" };
  }
}

function fromDraft(type: ElementType, d: Draft): ElementValue | null {
  const a = d.a.trim();
  const b = d.b.trim();
  switch (type) {
    case "SingleValued":
      return a ? { kind: "SingleValued", value: a } : null;
    case "MultiValued": {
      const values = a.split(",").map((v) => v.trim()).filter(Boolean);
      return values.length ? { kind: "MultiValued", values } : null;
    }
    case "MultiLanguage":
      return a || b ? { kind: "MultiLanguage", values: { ...(a ? { de: a } : {}), ...(b ? { en: b } : {}) } } : null;
    case "RelatedResource":
      return a || b ? { kind: "RelatedResource", label: a, href: b } : null;
    case "Collection":
      return null;
  }
}

function validate(type: ElementType, d: Draft): Partial<Record<keyof Draft, string>> {
  if (type !== "RelatedResource") return {};
  const a = d.a.trim();
  const b = d.b.trim();
  if (!a && !b) return {};
  const errors: Partial<Record<keyof Draft, string>> = {};
  if (!a) errors.a = "Bitte eine Bezeichnung angeben.";
  let ok = false;
  try {
    ok = ["http:", "https:"].includes(new URL(b).protocol);
  } catch {
    ok = false;
  }
  if (!ok) errors.b = "Bitte einen vollständigen Link angeben, z. B. https://…";
  return errors;
}

export function FieldEditForm({
  element,
  type,
  label,
  onSave,
}: {
  element: DataElement;
  type: ElementType;
  label: string;
  onSave: (value: ElementValue | null) => void;
}) {
  const initial = toDraft(element.value);
  const [draft, setDraft] = useState<Draft>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof Draft, string>>>({});
  const dirty = draft.a !== initial.a || draft.b !== initial.b;
  const base = `edit-${element.elementId}`;
  const isGranularity = element.key === GRANULARITY_KEY;

  const submit = (ev: FormEvent) => {
    ev.preventDefault();
    const found = validate(type, draft);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    onSave(fromDraft(type, draft));
  };

  const cancel = () => {
    setDraft(initial);
    setErrors({});
  };

  const input = (key: keyof Draft, fieldLabel: string, opts: { hint?: string; placeholder?: string; type?: string } = {}) => {
    const id = key === "a" ? base : `${base}-b`;
    const hintId = `${id}-hint`;
    return (
      <AppField label={fieldLabel} htmlFor={id} hint={opts.hint} error={errors[key]} hintId={hintId}>
        <AppInput
          id={id}
          type={opts.type ?? "text"}
          value={draft[key]}
          placeholder={opts.placeholder}
          invalid={!!errors[key]}
          aria-describedby={errors[key] || opts.hint ? hintId : undefined}
          onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
        />
      </AppField>
    );
  };

  return (
    <form onSubmit={submit} noValidate aria-label={`${label} bearbeiten`} className="flex flex-col gap-4">
      {isGranularity ? (
        <AppField label="Ebene" htmlFor={base} hint="Nach der ersten Veröffentlichung nicht mehr änderbar." hintId={`${base}-hint`}>
          <AppSelect
            id={base}
            aria-describedby={`${base}-hint`}
            value={draft.a}
            onChange={(e) => setDraft({ a: e.target.value, b: "" })}
          >
            {draft.a === "" ? <option value="">Bitte wählen</option> : null}
            {initial.a && !Object.values(GRANULARITY_LABEL).includes(initial.a) ? <option value={initial.a}>{initial.a}</option> : null}
            {(Object.entries(GRANULARITY_LABEL) as [Granularity, string][]).map(([code, l]) => (
              <option key={code} value={l}>
                {l}
              </option>
            ))}
          </AppSelect>
        </AppField>
      ) : type === "MultiLanguage" ? (
        <>
          {input("a", "Deutsch")}
          {input("b", "Englisch (optional)")}
        </>
      ) : type === "RelatedResource" ? (
        <>
          {input("a", "Bezeichnung", { placeholder: "z. B. Anleitung.pdf" })}
          {input("b", "Link", { type: "url", placeholder: "https://…" })}
        </>
      ) : type === "MultiValued" ? (
        input("a", "Werte", { hint: "Mehrere Werte durch Komma trennen." })
      ) : (
        input("a", "Wert")
      )}
      <div className="flex flex-wrap justify-end gap-2">
        <AppButton variant="secondary" label="Abbrechen" onClick={cancel} disabled={!dirty} />
        <AppButton type="submit" label="Speichern" disabled={!dirty} />
      </div>
    </form>
  );
}
