"use client";

import { GitCompareArrows, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AppButton } from "@/components/ui/AppButton";
import { AppCard } from "@/components/ui/AppCard";
import { AppField, AppTextarea } from "@/components/ui/AppInput";
import { AppMessage } from "@/components/ui/AppMessage";
import { CardHeading } from "@/components/ui/CardHeading";
import { useToast } from "@/components/ui/Toast";
import { sortBySection, type FieldMeta } from "@/lib/dpp/editor";
import { formatValue } from "@/lib/dpp/format";
import { STATE_LABEL } from "@/lib/dpp/labels";
import { canPublish, createVersion, nextVersionNumber, pendingChanges } from "@/lib/dpp/publish";
import type { DataElement, Passport } from "@/lib/dpp/types";
import { savePublishedVersion, usePassState } from "@/lib/dpp/use-working-copy";
import { DEMO_CONTEXT } from "@/lib/navigation";
import { QrCard } from "./QrCard";

/**
 * Veröffentlichen (SPEC §6.4): Änderungen des Arbeitsstands zur letzten Version, Versionsnotiz,
 * Bestätigung, danach ist die Version unveränderlich. Rechts der QR-Code.
 * Öffentliche Seite, QR und API zeigen nur die Demo-Versionen (SPEC §3, Entscheidung 25.11.2026).
 */
export function PublishView({ pass, meta, publicUrl }: { pass: Passport; meta: Record<string, FieldMeta>; publicUrl: string }) {
  const state = usePassState(pass);
  const { showToast, toastRegion } = useToast();
  const dialog = useRef<HTMLDialogElement>(null);
  const [note, setNote] = useState("");
  const [published, setPublished] = useState<number | null>(null);
  // Nach dem Veröffentlichen ist der Button deaktiviert; Fokus auf die Erfolgsmeldung, damit er nicht verloren geht.
  const successRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (published) successRef.current?.focus();
  }, [published]);

  const next = nextVersionNumber(state.versions);
  const last = state.latest;
  const changed = new Set(pendingChanges(state.versions, state.elements));
  const rows = sortBySection(
    state.elements.filter((e) => changed.has(e.elementId)),
    meta,
  );
  const before = new Map(last?.elements.map((e) => [e.elementId, e]) ?? []);
  const possible = canPublish(state.versions, state.elements);
  const missingRequired = state.elements.filter((e) => meta[e.elementId].requirement === "required" && (e.state === "missing" || e.value === null));
  const operatorMissing = missingRequired.some((e) => e.key === "operatorId");
  const publicVersion = state.latestPublic?.version;

  const publish = () => {
    dialog.current?.close();
    const version = createVersion({ versions: state.versions, elements: state.elements, note, actor: DEMO_CONTEXT.userName, now: new Date() });
    if (savePublishedVersion(pass.id, version)) {
      setPublished(version.version);
      setNote("");
    } else {
      showToast("Veröffentlichen nicht möglich: Der Browser erlaubt keinen lokalen Speicher.", "error");
    }
  };

  const dbNote = (v: number) =>
    publicVersion
      ? `v${v} ist in diesem Browser veröffentlicht. Öffentliche Seite, QR-Code und API zeigen im Prototyp weiter die Demo-Version v${publicVersion}, weil es keine Datenbank gibt.`
      : `v${v} ist in diesem Browser veröffentlicht. Öffentlich ist der Pass im Prototyp weiter nicht erreichbar, weil es keine Datenbank gibt.`;

  return (
    <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_24rem]">
      <div className="flex flex-col gap-4">
        {published ? (
          <AppMessage ref={successRef} tabIndex={-1} severity="success" role="status">
            {dbNote(published)}
          </AppMessage>
        ) : null}

        <AppCard>
          <section aria-labelledby="diff-title" className="flex flex-col gap-4">
            <CardHeading id="diff-title" icon={GitCompareArrows}>
              {last ? `Änderungen seit v${last.version}` : "Erste Version"}
            </CardHeading>
            {last ? (
              rows.length === 0 ? (
                <p className="text-ui-text-muted">Keine Änderungen seit v{last.version}.</p>
              ) : (
                <div className="overflow-x-auto rounded-ui-lg border border-ui-border">
                  <table className="w-full min-w-140 border-collapse text-left">
                    <thead>
                      <tr className="bg-ui-surface-muted">
                        {["Feld", `v${last.version}`, `Neu in v${next}`].map((c) => (
                          <th key={c} scope="col" className="border-b border-ui-border p-2 font-medium text-ui-text-strong">
                            {c}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((e) => (
                        <tr key={e.elementId} className="border-b border-ui-border-hairline align-top last:border-b-0">
                          <th scope="row" className="p-2 font-medium text-ui-text">
                            {meta[e.elementId].label}
                          </th>
                          <td className="break-words p-2 text-ui-text-muted">{describe(before.get(e.elementId), e)}</td>
                          <td className="break-words p-2 text-ui-text-strong">{describe(e, before.get(e.elementId))}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            ) : (
              <p className="text-ui-text">
                Der Pass hat noch keine Version. v1 übernimmt alle {state.elements.length} Felder des Arbeitsstands.
              </p>
            )}

            {possible && missingRequired.length > 0 ? (
              <AppMessage severity="warn">
                {missingRequired.length === 1 ? "1 Pflichtfeld fehlt" : `${missingRequired.length} Pflichtfelder fehlen`}:{" "}
                {missingRequired.map((e) => meta[e.elementId].label).join(", ")}.
                {operatorMissing ? " Ohne Kennung Wirtschaftsakteur bleibt das Kopf-Feld economicOperatorId leer." : ""} Veröffentlichen ist im
                Prototyp trotzdem möglich.
              </AppMessage>
            ) : null}

            <AppField label="Versionsnotiz" htmlFor="version-note" hint="Optional. Erscheint im Versionsverlauf." hintId="version-note-hint">
              <AppTextarea
                id="version-note"
                value={note}
                maxLength={200}
                disabled={!possible}
                aria-describedby="version-note-hint"
                placeholder="z. B. PCF nach ISO 14067 neu berechnet"
                onChange={(e) => setNote(e.target.value)}
              />
            </AppField>

            <div className="flex flex-wrap items-center justify-end gap-4">
              {!possible && last ? <span className="text-ui-text-muted">Keine Änderungen seit v{last.version}</span> : null}
              <AppButton icon={Send} label={`Als v${next} veröffentlichen`} disabled={!possible} onClick={() => dialog.current?.showModal()} />
            </div>
            <p className="text-sm text-ui-text-muted">
              Im Prototyp gibt es keine Datenbank: Veröffentlichungen bleiben in diesem Browser.{" "}
              {publicVersion
                ? `Öffentliche Seite, QR-Code und API zeigen weiter die Demo-Version v${publicVersion}.`
                : "Öffentlich ist der Pass weiter nicht erreichbar."}
            </p>
          </section>
        </AppCard>
      </div>

      <QrCard dppId={pass.dppId} url={publicUrl} available={state.versions.length > 0} />

      <dialog
        ref={dialog}
        aria-labelledby="publish-title"
        aria-describedby="publish-text"
        className="m-auto w-full max-w-md rounded-ui-xl border border-ui-border bg-ui-surface p-6 text-ui-text"
      >
        <div className="flex flex-col gap-4">
          <h2 id="publish-title" className="text-lg font-medium text-ui-text-strong">
            Als v{next} veröffentlichen?
          </h2>
          <p id="publish-text">
            v{next} wird veröffentlicht und kann danach nicht mehr geändert werden. Spätere Änderungen erfordern eine neue Version.
          </p>
          <div className="flex justify-end gap-2">
            <AppButton variant="secondary" label="Abbrechen" onClick={() => dialog.current?.close()} autoFocus />
            <AppButton label="Veröffentlichen" onClick={publish} />
          </div>
        </div>
      </dialog>
      {toastRegion}
    </div>
  );
}

/** Anzeigetext eines Stands; bei gleichem Wert der Zustand, damit die Änderung sichtbar ist. */
function describe(e: DataElement | undefined, other: DataElement | undefined): string {
  if (!e) return "–";
  const text = formatValue(e.value) ?? "Keine Angabe";
  const otherText = other ? (formatValue(other.value) ?? "Keine Angabe") : null;
  return otherText === text ? `${text} (${STATE_LABEL[e.state]})` : text;
}
