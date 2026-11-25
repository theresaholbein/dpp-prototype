"use client";

import { useMemo, useSyncExternalStore } from "react";
import { passState, type PassState } from "./pass-state.ts";
import { STORAGE_PREFIX, editsKey, versionsKey, type Edits } from "./working-copy.ts";
import type { ElementValue, Passport, PassVersion } from "./types.ts";

/**
 * Browser-Speicher der Demo (SPEC §3, localStorage): Änderungen am Arbeitsstand und im Browser veröffentlichte Versionen.
 * Server und erster Render sehen keine Browser-Daten (keine Hydration-Fehler); danach liest der Browser.
 * Jeder Zugriff ist abgesichert: Ohne Speicher läuft die Demo mit den Demo-Daten weiter.
 */

const EMPTY_EDITS: Edits = {};
const EMPTY_VERSIONS: PassVersion[] = [];
const EMPTY_SNAPSHOT = "[]";
const listeners = new Set<() => void>();

function notify() {
  for (const l of listeners) l();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

/** Alle Demo-Schlüssel als ein String: gleicher Inhalt = gleicher Snapshot, daher stabil für useSyncExternalStore. */
function snapshot(): string {
  try {
    const entries: [string, string][] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k?.startsWith(STORAGE_PREFIX)) entries.push([k, window.localStorage.getItem(k) ?? ""]);
    }
    entries.sort(([a], [b]) => a.localeCompare(b));
    return JSON.stringify(entries);
  } catch {
    return EMPTY_SNAPSHOT;
  }
}

function parse<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export type DemoStore = { edits: (passId: string) => Edits; versions: (passId: string) => PassVersion[] };

/** Lesesicht auf alle Browser-Daten der Demo. */
export function useDemoStore(): DemoStore {
  const raw = useSyncExternalStore(subscribe, snapshot, () => EMPTY_SNAPSHOT);
  return useMemo(() => {
    const map = new Map(parse<[string, string][]>(raw, []));
    const edits = new Map<string, Edits>();
    const versions = new Map<string, PassVersion[]>();
    return {
      edits: (passId) => {
        const key = editsKey(passId);
        if (!edits.has(key)) edits.set(key, parse(map.get(key), EMPTY_EDITS));
        return edits.get(key)!;
      },
      versions: (passId) => {
        const key = versionsKey(passId);
        if (!versions.has(key)) versions.set(key, parse(map.get(key), EMPTY_VERSIONS));
        return versions.get(key)!;
      },
    };
  }, [raw]);
}

/** Änderungen eines Passes aus dem Browser. */
export function useEdits(passId: string): Edits {
  return useDemoStore().edits(passId);
}

/** Arbeitsstand, Versionen, Status und Vollständigkeit eines Passes inkl. Browser-Daten. */
export function usePassState(pass: Passport): PassState {
  const store = useDemoStore();
  const edits = store.edits(pass.id);
  const versions = store.versions(pass.id);
  return useMemo(() => passState(pass, edits, versions), [pass, edits, versions]);
}

function readKey<T>(key: string, fallback: T): T {
  return parse(window.localStorage.getItem(key), fallback);
}

/**
 * Speichert einen Feldwert. Entspricht er dem Demo-Wert, wird die Änderung entfernt,
 * damit der Arbeitsstand nicht ohne Grund abweicht. false = Browser-Speicher nicht verfügbar.
 */
export function saveEdit(passId: string, elementId: string, value: ElementValue | null, original: ElementValue | null): boolean {
  try {
    const key = editsKey(passId);
    const next: Edits = { ...readKey(key, EMPTY_EDITS) };
    if (JSON.stringify(value) === JSON.stringify(original)) delete next[elementId];
    else next[elementId] = { value };
    if (Object.keys(next).length === 0) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, JSON.stringify(next));
    notify();
    return true;
  } catch {
    return false;
  }
}

/** Hängt eine veröffentlichte Version an. Bestehende Versionen werden nie verändert. false = Speicher nicht verfügbar. */
export function savePublishedVersion(passId: string, version: PassVersion): boolean {
  try {
    const key = versionsKey(passId);
    const existing = readKey(key, EMPTY_VERSIONS);
    if (existing.some((v) => v.version === version.version)) return false;
    window.localStorage.setItem(key, JSON.stringify([...existing, version]));
    notify();
    return true;
  } catch {
    return false;
  }
}

/** Löscht alle Browser-Daten der Demo (Feldwerte, Veröffentlichungen, später Registry-Ergebnisse). */
export function resetDemo(): boolean {
  try {
    const keys: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k?.startsWith(STORAGE_PREFIX)) keys.push(k);
    }
    for (const k of keys) window.localStorage.removeItem(k);
    notify();
    return true;
  } catch {
    return false;
  }
}
