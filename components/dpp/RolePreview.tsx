"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { Eye } from "lucide-react";
import { SECTION_ICON } from "@/components/dpp/section-icons";
import { AppCard } from "@/components/ui/AppCard";
import { CardHeading } from "@/components/ui/CardHeading";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { sortBySection, type FieldMeta } from "@/lib/dpp/editor";
import { formatValue } from "@/lib/dpp/format";
import { SECTION_LABEL, SECTION_ORDER } from "@/lib/dpp/labels";
import { ROLES, filterForRole, getRole, type RoleId } from "@/lib/dpp/roles";
import type { Passport } from "@/lib/dpp/types";
import { useEdits } from "@/lib/dpp/use-working-copy";
import { applyEdits } from "@/lib/dpp/working-copy";

/** Rollen-Vorschau (SPEC §6.3): Arbeitsstand gefiltert nach Zugriffsebene, mit Anzahl ausgeblendeter Felder. */
export function RolePreview({ pass, meta }: { pass: Passport; meta: Record<string, FieldMeta> }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const edits = useEdits(pass.id);
  const role = getRole(params.get("role"));

  const elements = useMemo(() => sortBySection(applyEdits(pass.workingCopy.elements, edits), meta), [pass, edits, meta]);
  const { visible, hiddenCount } = filterForRole(elements, role);
  const groups = SECTION_ORDER.map((id) => ({ id, fields: visible.filter((e) => meta[e.elementId].section === id) })).filter(
    (g) => g.fields.length > 0,
  );

  const setRole = (id: RoleId) => {
    router.replace(id === ROLES[0].id ? pathname : `${pathname}?role=${id}`, { scroll: false });
  };

  const count = `${visible.length} ${visible.length === 1 ? "Feld" : "Felder"} sichtbar${hiddenCount ? `, ${hiddenCount} ausgeblendet` : ""}`;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-4">
        <span className="text-ui-text-muted">Ansicht als</span>
        <SegmentedControl label="Rolle" options={ROLES.map((r) => ({ value: r.id, label: r.label }))} value={role.id} onChange={setRole} />
      </div>

      <AppCard>
        <div className="flex flex-col gap-2">
          <CardHeading icon={Eye}>{role.title}</CardHeading>
          <p className="text-ui-text">{role.text}</p>
          <p className="font-medium text-ui-text-strong" aria-live="polite">
            {count}
          </p>
          <p className="text-sm text-ui-text-muted">Vorschau des Arbeitsstands. Öffentlich ist erst die veröffentlichte Version.</p>
        </div>
      </AppCard>

      {groups.length === 0 ? (
        <AppCard padding="large" className="items-center text-center">
          <p className="text-ui-text-muted">Für diese Rolle sind keine Felder sichtbar.</p>
        </AppCard>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
          {groups.map((g) => (
            <AppCard key={g.id}>
              <section aria-labelledby={`sec-${g.id}`} className="flex flex-col gap-4">
                <CardHeading id={`sec-${g.id}`} icon={SECTION_ICON[g.id]} level={3}>
                  {SECTION_LABEL[g.id]}
                </CardHeading>
                <dl className="flex flex-col gap-4">
                  {g.fields.map((e) => {
                    const text = formatValue(e.value);
                    return (
                      <div key={e.elementId} className="flex flex-col">
                        <dt className="text-sm text-ui-text-muted">{meta[e.elementId].label}</dt>
                        <dd className={`break-words ${text === null ? "text-ui-text-muted" : "text-ui-text-strong"}`}>{text ?? "Keine Angabe"}</dd>
                      </div>
                    );
                  })}
                </dl>
              </section>
            </AppCard>
          ))}
        </div>
      )}
    </div>
  );
}
