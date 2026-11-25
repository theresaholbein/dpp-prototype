"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { NAVIGATION, activeHref } from "@/lib/navigation";
import { AppButton } from "@/components/ui/AppButton";
import { Tooltip } from "@/components/ui/Tooltip";
import { SidebarItem, SidebarSection } from "./SidebarItem";
import { SidebarFooter } from "./SidebarFooter";

const STORAGE_KEY = "cg-sidebar-collapsed";

// Einklapp-Zustand im localStorage, mit Speicherfallback, falls der Browser ihn sperrt.
const listeners = new Set<() => void>();
let memory = false;

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

function getSnapshot() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === null ? memory : stored === "1";
  } catch {
    return memory;
  }
}

function setStoredCollapsed(value: boolean) {
  memory = value;
  try {
    window.localStorage.setItem(STORAGE_KEY, value ? "1" : "0");
  } catch {
    // Speicher nicht verfügbar: nur im Arbeitsspeicher.
  }
  listeners.forEach((l) => l());
}

export function Sidebar({ hasLogo }: { hasLogo: boolean }) {
  const pathname = usePathname();
  const current = activeHref(pathname);
  const collapsed = useSyncExternalStore(subscribe, getSnapshot, () => false);
  const toggle = () => setStoredCollapsed(!collapsed);

  const toggleLabel = collapsed ? "Sidebar ausklappen" : "Sidebar einklappen";

  return (
    <aside
      className={`sticky top-0 flex h-screen shrink-0 flex-col border-r border-ui-border-hairline bg-ui-surface transition-[width] duration-(--ui-duration) ${
        collapsed ? "w-(--ui-sidebar-collapsed)" : "w-(--ui-sidebar-width)"
      }`}
    >
      <div className={`flex h-(--ui-header-height) shrink-0 items-center px-2 ${collapsed ? "justify-center" : "justify-between"}`}>
        {collapsed ? null : hasLogo ? (
          // Größe nach Screenshot 02: sichtbarer Schriftzug ca. 120 × 35 px. Die SVG hat rundum Leerraum,
          // daher 56 px Höhe für das ganze Bild (Inhalt ≈ 80 % der Breite) und kein zusätzlicher Außenabstand.
          <Image src="/Logo_navy.svg" alt="Code Gaia" width={1790} height={673} className="h-14 w-auto" priority />
        ) : (
          <span aria-hidden="true" className="h-10" />
        )}
        <Tooltip label={toggleLabel} placement={collapsed ? "right" : "bottom"}>
          <AppButton
            variant="secondary"
            mode={collapsed ? "outlined" : "text"}
            icon={collapsed ? PanelLeftOpen : PanelLeftClose}
            aria-label={toggleLabel}
            aria-expanded={!collapsed}
            onClick={toggle}
          />
        </Tooltip>
      </div>

      <nav aria-label="Hauptnavigation" className={`flex min-h-0 flex-1 flex-col overflow-y-auto px-2 py-8 ${collapsed ? "gap-2" : "gap-4"}`}>
        {NAVIGATION.map((section, i) => (
          <div key={section.title} className="flex flex-col gap-2">
            {collapsed && i > 0 ? <hr className="mx-2 border-ui-border" /> : null}
            <SidebarSection title={section.title} collapsed={collapsed}>
              {section.items.map((item) => (
                <SidebarItem
                  key={item.href}
                  label={item.label}
                  href={item.href}
                  icon={item.icon}
                  locked={item.locked}
                  tone={item.tone}
                  active={item.href === current}
                  collapsed={collapsed}
                />
              ))}
            </SidebarSection>
          </div>
        ))}
      </nav>

      <div className="shrink-0 border-t border-ui-border-hairline p-2 py-4">
        <SidebarFooter collapsed={collapsed} />
      </div>
    </aside>
  );
}
