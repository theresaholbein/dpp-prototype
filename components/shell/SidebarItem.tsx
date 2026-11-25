import Link from "next/link";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Tooltip } from "@/components/ui/Tooltip";

/**
 * Port von SidebarItem + SidebarSection aus docs/design-system/components/SidebarItem.jsx.
 * Abweichung: Link statt Button (Navigation), kein Schloss-Icon bei gesperrten Einträgen,
 * weil die Screenshots in docs/reference/ keins zeigen.
 */
type ItemProps = {
  label: string;
  href: string;
  icon: LucideIcon;
  active?: boolean;
  locked?: boolean;
  tone?: "green";
  collapsed?: boolean;
};

export function SidebarItem({ label, href, icon: Icon, active = false, locked = false, tone, collapsed = false }: ItemProps) {
  const base = `flex w-full items-center rounded-ui-lg py-2 text-left text-base font-medium leading-tight transition-colors duration-(--ui-duration) ${collapsed ? "justify-center" : "pr-0.5"}`;

  let skin: string;
  if (locked) skin = "cursor-not-allowed text-gray-light opacity-60";
  else if (active) skin = "bg-ui-surface-selected text-primary-500";
  else if (tone === "green") skin = "bg-green-light text-green-dark hover:bg-blue hover:text-surface-0";
  else skin = "text-black-text hover:bg-blue hover:text-surface-0";

  const inner = (
    <>
      <Icon size={20} aria-hidden="true" className={`shrink-0 ${collapsed ? "" : "mx-3"}`} />
      {collapsed ? null : <span className="min-w-0 flex-1 truncate">{label}</span>}
    </>
  );

  if (locked) {
    return (
      <Tooltip label={collapsed ? `${label} – im Prototyp gesperrt` : "Im Prototyp gesperrt"} placement="right" describe className="w-full">
        <button type="button" aria-disabled="true" aria-label={collapsed ? label : undefined} className={`${base} ${skin}`}>
          {inner}
        </button>
      </Tooltip>
    );
  }

  const link = (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      aria-label={collapsed ? label : undefined}
      className={`${base} ${skin}`}
    >
      {inner}
    </Link>
  );

  return collapsed ? (
    <Tooltip label={label} placement="right" className="w-full">
      {link}
    </Tooltip>
  ) : (
    link
  );
}

export function SidebarSection({ title, collapsed = false, children }: { title: string; collapsed?: boolean; children: ReactNode }) {
  return (
    <div role="group" aria-label={title} className="flex w-full flex-col gap-1">
      {collapsed ? null : <span className="pl-3 text-xs font-medium text-ui-text-muted">{title}</span>}
      {children}
    </div>
  );
}
