"use client";

import { useSyncExternalStore } from "react";
import { STORAGE_PREFIX, editsKey, type Edits } from "./working-copy.ts";
import type { ElementValue } from "./types.ts";

/**
 * Browser-Speicher des Arbeitsstands (SPEC §3, localStorage).
 * Server und erster Render sehen keine Änderungen (keine Hydration-Fehler); danach liest der Browser.
 * Jeder Zugriff ist abgesichert: Ohne Speicher läuft die Demo mit den Demo-Daten weiter.
 */

const EMPTY: Edits = {};
const listeners = new Set<() => void>();
const cache = new Map<string, { raw: string | null; edits: Edits }>();

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

function readEdits(passId: string): Edits {
  const key = editsKey(passId);
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(key);
  } catch {
    return EMPTY;
  }
  const hit = cache.get(key);
  if (hit && hit.raw === raw) return hit.edits;
  let edits = EMPTY;
  try {
    if (raw) edits = JSON.parse(raw) as Edits;
  } catch {
    edits = EMPTY;
  }
  cache.set(key, { raw, edits });
  return edits;
}

/** Änderungen eines Passes aus dem Browser. */
export function useEdits(passId: string): Edits {
  return useSyncExternalStore(
    subscribe,
    () => readEdits(passId),
    () => EMPTY,
  );
}

/**
 * Speichert einen Feldwert. Entspricht er dem Demo-Wert, wird die Änderung entfernt,
 * damit der Arbeitsstand nicht ohne Grund abweicht. false = Browser-Speicher nicht verfügbar.
 */
export function saveEdit(passId: string, elementId: string, value: ElementValue | null, original: ElementValue | null): boolean {
  try {
    const next: Edits = { ...readEdits(passId) };
    if (JSON.stringify(value) === JSON.stringify(original)) delete next[elementId];
    else next[elementId] = { value };
    const key = editsKey(passId);
    if (Object.keys(next).length === 0) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, JSON.stringify(next));
    notify();
    return true;
  } catch {
    return false;
  }
}

/** Löscht alle Browser-Daten der Demo (Feldwerte, später auch Veröffentlichungen und Registry-Ergebnisse). */
export function resetDemo(): boolean {
  try {
    const keys: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k?.startsWith(STORAGE_PREFIX)) keys.push(k);
    }
    for (const k of keys) window.localStorage.removeItem(k);
    cache.clear();
    notify();
    return true;
  } catch {
    return false;
  }
}
