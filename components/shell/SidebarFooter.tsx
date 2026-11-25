import { Building2, Folder, UserCog, type LucideIcon } from "lucide-react";
import { DEMO_CONTEXT } from "@/lib/navigation";
import { Tooltip } from "@/components/ui/Tooltip";

/** Nutzerin, Firma, Datensatz und Version unten in der Sidebar (Demo-Werte, ohne Funktion). */
type Row = { icon: LucideIcon; label: string; primary: string; secondary?: string };

const rows: Row[] = [
  { icon: UserCog, label: "Nutzerin", primary: DEMO_CONTEXT.userName, secondary: DEMO_CONTEXT.userEmail },
  { icon: Building2, label: "Firma", primary: DEMO_CONTEXT.company },
  { icon: Folder, label: "Datensatz", primary: DEMO_CONTEXT.dataset },
];

export function SidebarFooter({ collapsed }: { collapsed: boolean }) {
  if (collapsed) {
    return (
      <div className="flex flex-col items-center gap-2">
        {rows.map(({ icon: Icon, label, primary }) => (
          <Tooltip key={label} label={`${label}: ${primary}`} placement="right">
            <span role="img" aria-label={`${label}: ${primary}`} className="flex size-10 items-center justify-center rounded-ui-sm bg-surface-100 text-gray-dark">
              <Icon size={20} aria-hidden="true" />
            </span>
          </Tooltip>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <dl className="flex flex-col gap-2">
        {rows.map(({ icon: Icon, label, primary, secondary }) => (
          <div key={label} className="flex items-center">
            <dt className="mx-3 shrink-0 text-gray-dark">
              <Icon size={20} aria-hidden="true" />
              <span className="sr-only">{label}</span>
            </dt>
            <dd className="flex min-w-0 flex-col">
              <span className="truncate text-sm font-medium text-ui-text-strong" title={primary}>
                {primary}
              </span>
              {secondary ? (
                <span className="truncate text-xs text-ui-text-muted" title={secondary}>
                  {secondary}
                </span>
              ) : null}
            </dd>
          </div>
        ))}
      </dl>
      <span className="pl-3 text-xs text-ui-text-label">Version: {DEMO_CONTEXT.appVersion}</span>
    </div>
  );
}
