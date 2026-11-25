import { computeReadiness } from "./readiness.ts";
import { deriveWorkflowStatus } from "./status.ts";
import { pendingChanges } from "./publish.ts";
import { applyEdits, type Edits } from "./working-copy.ts";
import type { DataElement, Passport, PassVersion, Readiness, WorkflowStatus } from "./types.ts";

/**
 * Aktueller Stand eines Passes aus Demo-Daten und Browser (SPEC §3, §5):
 * Arbeitsstand = Demo-Arbeitsstand + Änderungen, Versionen = Demo-Versionen + im Browser veröffentlichte.
 * Öffentliche Seite, QR und API nutzen nur die Demo-Versionen (Entscheidung 25.11.2026).
 */
export type PassState = {
  elements: DataElement[];
  versions: PassVersion[];
  latest: PassVersion | undefined;
  /** Letzte Version aus den Demo-Daten, die öffentlich ausgeliefert wird. */
  latestPublic: PassVersion | undefined;
  /** Geänderte Felder seit der letzten Version; leer ohne Version. */
  changedSinceLatest: string[];
  hasUnpublishedChanges: boolean;
  status: WorkflowStatus;
  readiness: Readiness;
};

export function passState(pass: Passport, edits: Edits, browserVersions: PassVersion[]): PassState {
  const elements = applyEdits(pass.workingCopy.elements, edits);
  const lastDemo = pass.publishedVersions.at(-1)?.version ?? 0;
  const versions = [...pass.publishedVersions, ...browserVersions.filter((v) => v.version > lastDemo)];
  const latest = versions.at(-1);
  const changedSinceLatest = latest ? pendingChanges(versions, elements) : [];
  return {
    elements,
    versions,
    latest,
    latestPublic: pass.publishedVersions.at(-1),
    changedSinceLatest,
    hasUnpublishedChanges: changedSinceLatest.length > 0,
    status: deriveWorkflowStatus({ versionCount: versions.length, registered: !!pass.registration }),
    readiness: computeReadiness(elements, pass.templateIds),
  };
}
