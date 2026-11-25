import { changedElementIds } from "./status.ts";
import type { DataElement, PassVersion } from "./types.ts";

/**
 * Veröffentlichen und Versionsabruf (SPEC §5, §6.4, §6.6). Reine Funktionen, ohne Browser-Speicher.
 * Veröffentlichte Versionen sind unveränderlich (EN 18223 §4.2, EN 18221 §4.2): es wird nur angehängt.
 */

export function nextVersionNumber(versions: PassVersion[]): number {
  return (versions.at(-1)?.version ?? 0) + 1;
}

/** Felder, die sich seit der letzten Version geändert haben. Ohne Version: alle Felder (erste Veröffentlichung). */
export function pendingChanges(versions: PassVersion[], elements: DataElement[]): string[] {
  const last = versions.at(-1);
  if (!last) return elements.map((e) => e.elementId);
  return changedElementIds(last.elements, elements);
}

/** Veröffentlichen ist möglich, wenn es noch keine Version gibt oder der Arbeitsstand abweicht. */
export function canPublish(versions: PassVersion[], elements: DataElement[]): boolean {
  return versions.length === 0 || pendingChanges(versions, elements).length > 0;
}

/** Neue Version als Snapshot des Arbeitsstands. Erste Version: keine geänderten Felder (wie v1 der Demo-Daten). */
export function createVersion(args: {
  versions: PassVersion[];
  elements: DataElement[];
  note: string;
  actor: string;
  now: Date;
}): PassVersion {
  const last = args.versions.at(-1);
  return {
    version: nextVersionNumber(args.versions),
    publishedAt: args.now.toISOString(),
    actor: args.actor,
    changedFields: last ? changedElementIds(last.elements, args.elements) : [],
    note: args.note.trim(),
    previousVersion: last?.version ?? null,
    dppStatus: "active",
    elements: structuredClone(args.elements),
  };
}

const BERLIN_DAY = new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "2-digit", day: "2-digit", timeZone: "Europe/Berlin" });

/** Kalendertag (YYYY-MM-DD, Europe/Berlin) eines ISO-Zeitpunkts. */
export function berlinDay(iso: string): string {
  return BERLIN_DAY.format(new Date(iso));
}

/**
 * „Stand am Datum“ (EN 18222 ReadDPPVersionByIdAndDate, empfohlen): die letzte Version, die am Ende
 * des Tages `date` (YYYY-MM-DD, Europe/Berlin) veröffentlicht war. Vor der ersten Version: undefined.
 */
export function versionAt(versions: PassVersion[], date: string): PassVersion | undefined {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return undefined;
  return versions.filter((v) => berlinDay(v.publishedAt) <= date).at(-1);
}
