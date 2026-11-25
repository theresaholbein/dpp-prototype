"use client";

import { PanelLeftClose } from "lucide-react";
import { AppButton } from "@/components/ui/AppButton";
import { AppTag } from "@/components/ui/AppTag";
import type { SectionFilter } from "./PassEditor";

export type SectionEntry = { id: SectionFilter; label: string; total: number; open: number };

/** Ausblendbarer Baum der Template-Abschnitte (Muster Screenshot 04). */
export function SectionTree({
  entries,
  active,
  onSelect,
  onHide,
}: {
  entries: SectionEntry[];
  active: SectionFilter;
  onSelect: (id: SectionFilter) => void;
  onHide: () => void;
}) {
  return (
    <nav aria-label="Template-Abschnitte" className="flex flex-col gap-4 rounded-ui-xl border border-ui-border bg-ui-surface p-4">
      <AppButton variant="primary" mode="text" size="small" icon={PanelLeftClose} label="Seitenleiste ausblenden" onClick={onHide} className="self-start" />
      <ul className="flex flex-col gap-1">
        {entries.map((s) => {
          const on = s.id === active;
          return (
            <li key={s.id}>
              <button
                type="button"
                aria-current={on ? "true" : undefined}
                onClick={() => onSelect(s.id)}
                className={`flex w-full cursor-pointer items-center justify-between gap-2 rounded-ui-sm p-2 text-left font-medium transition-colors duration-(--ui-duration) ${
                  on ? "bg-ui-surface-selected text-primary-500" : "text-ui-text hover:bg-surface-100"
                }`}
              >
                <span className="min-w-0 break-words">{s.label}</span>
                {s.open > 0 ? (
                  <AppTag value={`${s.open} offen`} severity="danger" rounded className="shrink-0 whitespace-nowrap" />
                ) : (
                  <AppTag value={s.total} severity="success" rounded className="shrink-0" />
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
