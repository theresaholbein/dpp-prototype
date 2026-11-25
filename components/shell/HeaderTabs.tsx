"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { HeaderTab } from "@/lib/navigation";

/**
 * Tab-Gruppe links in der Kopfzeile (nicht im Design System portiert, nach Screenshot 01/02):
 * umrandete Gruppe, aktiver Tab hellblau mit blauem Rand.
 */
export function HeaderTabs({ tabs, label }: { tabs: HeaderTab[]; label: string }) {
  const pathname = usePathname();

  return (
    <nav aria-label={label} className="flex gap-1 rounded-ui-lg border border-ui-border p-1">
      {tabs.map((tab) => {
        const active = tab.active ?? tab.href === pathname;
        const cls = `rounded-ui-sm border px-3 py-1.5 text-base font-medium leading-tight transition-colors duration-(--ui-duration) ${
          active
            ? "border-primary-500 bg-ui-surface-selected text-primary-500"
            : "border-transparent text-gray-dark hover:bg-surface-100"
        }`;
        return tab.href ? (
          <Link key={tab.label} href={tab.href} aria-current={active ? "page" : undefined} className={cls}>
            {tab.label}
          </Link>
        ) : (
          <button key={tab.label} type="button" aria-current={active ? "page" : undefined} className={`cursor-pointer ${cls}`}>
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}
