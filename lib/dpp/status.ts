import type { DataElement, Passport, PassVersion, WorkflowStatus } from "./types.ts";

/**
 * Workflow-Status der UI, abgeleitet, nie gespeichert (SPEC §5):
 * Entwurf = keine Version · Veröffentlicht = mindestens eine Version · Registriert = zusätzlich registriert.
 */
export function deriveWorkflowStatus({ versionCount, registered }: { versionCount: number; registered: boolean }): WorkflowStatus {
  if (versionCount === 0) return "draft";
  return registered ? "registered" : "published";
}

export function latestVersion(pass: Passport): PassVersion | undefined {
  return pass.publishedVersions.at(-1);
}

function fingerprint(e: DataElement): string {
  return JSON.stringify([e.value, e.state, e.accessLevel]);
}

/** elementIds, deren Wert, Zustand oder Zugriffsebene sich zwischen zwei Ständen unterscheiden. */
export function changedElementIds(before: DataElement[], after: DataElement[]): string[] {
  const old = new Map(before.map((e) => [e.elementId, fingerprint(e)]));
  const ids = new Set([...before.map((e) => e.elementId), ...after.map((e) => e.elementId)]);
  const now = new Map(after.map((e) => [e.elementId, fingerprint(e)]));
  return [...ids].filter((id) => old.get(id) !== now.get(id));
}

/** Arbeitsstand weicht von der letzten veröffentlichten Version ab. Ohne Version: false. */
export function hasUnpublishedChanges(pass: Passport): boolean {
  const last = latestVersion(pass);
  if (!last) return false;
  return changedElementIds(last.elements, pass.workingCopy.elements).length > 0;
}
