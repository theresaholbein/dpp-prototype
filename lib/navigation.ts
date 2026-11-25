import {
  ClipboardList,
  CreditCard,
  LayoutGrid,
  Leaf,
  ListTree,
  Package,
  QrCode,
  Settings,
  ShieldCheck,
  SquareCheckBig,
  SquarePercent,
  Store,
  Trees,
  Truck,
  type LucideIcon,
} from "lucide-react";

/**
 * Einzige Quelle für die Sidebar-Navigation und die Kopfzeilen-Tabs der Platzhalterseiten.
 * Vorlage: docs/reference/ (Screenshots, NAVIGATION.md) und SPEC.md §4.
 *
 * Pfade: wo bekannt die echten Pfade der App. Mit `pathKnown: false` markierte Pfade
 * sind Vorschläge (SPEC §4 🔴), nicht belegt.
 */

export type HeaderTab = {
  label: string;
  /** Ohne href: Tab ohne Funktion (im Prototyp keine eigene Route). */
  href?: string;
  active?: boolean;
};

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  pathKnown: boolean;
  /** Im Mandanten gesperrt: ausgegraut, nicht klickbar. Platzhalterroute existiert trotzdem. */
  locked?: boolean;
  /** Grün hinterlegt wie „Umweltschutz“ im Original. */
  tone?: "green";
  /** Tabs der Kopfzeile auf der Platzhalterseite. Standard: ein Tab mit dem Modulnamen. */
  tabs?: HeaderTab[];
  /** Ausgebautes Modul mit eigener Seite: keine Platzhalterroute. */
  hasOwnPage?: boolean;
};

export type NavSection = {
  title: string;
  items: NavItem[];
};

export const NAVIGATION: NavSection[] = [
  {
    title: "Cockpit",
    items: [
      { label: "Projekte & Aufgaben", href: "/tasks/projects", icon: SquareCheckBig, pathKnown: true },
      {
        label: "Organisation",
        href: "/configure/reporting-entities",
        icon: Settings,
        pathKnown: true,
        tabs: [{ label: "Geschäftseinheiten" }, { label: "Datensätze", active: true }, { label: "Benutzer*innen" }],
      },
      {
        label: "Dashboard",
        href: "/performance/environmental",
        icon: LayoutGrid,
        pathKnown: true,
        tabs: [{ label: "Umwelt", active: true }],
      },
    ],
  },
  {
    title: "Strategie & Planung",
    items: [
      { label: "Wesentlichkeit", href: "/report/materiality", icon: ListTree, pathKnown: true },
      { label: "Transformation", href: "/improve/targets", icon: Leaf, pathKnown: true },
      // Im Original ein externer Link; im Prototyp eine Platzhalterseite.
      { label: "Umweltschutz", href: "/environmental-protection", icon: Trees, pathKnown: false, tone: "green" },
    ],
  },
  {
    title: "Bilanzierung",
    items: [
      { label: "Klima & ESG", href: "/measure/activities", icon: CreditCard, pathKnown: true },
      // Im Screenshot gesperrt; im Prototyp offen, weil der DPP darauf aufbaut (SPEC §4).
      { label: "Produkte", href: "/products", icon: Package, pathKnown: false },
      { label: "Produktpässe", href: "/products/passports", icon: QrCode, pathKnown: false, hasOwnPage: true },
    ],
  },
  {
    title: "Management",
    items: [
      { label: "Managementsysteme", href: "/management-systems", icon: ShieldCheck, pathKnown: false, locked: true },
      { label: "Lieferkette", href: "/supply-chain", icon: Truck, pathKnown: false, locked: true },
    ],
  },
  {
    title: "Berichterstattung",
    items: [
      { label: "Berichterstattung", href: "/report", icon: ClipboardList, pathKnown: true },
      { label: "EU-Taxonomie", href: "/eu-taxonomy", icon: SquarePercent, pathKnown: false, locked: true },
    ],
  },
  {
    title: "Marktplatz",
    items: [{ label: "Partner", href: "/marketplace/partners", icon: Store, pathKnown: true }],
  },
];

export const NAV_ITEMS: NavItem[] = NAVIGATION.flatMap((s) => s.items);

/** Kopfzeilen-Tabs des Moduls Produktpässe (SPEC §6.1, §6.5). */
export const PASSPORT_TABS: HeaderTab[] = [
  { label: "Portfolio", href: "/products/passports" },
  { label: "Registry & Export", href: "/products/passports/registry" },
];

/** Kopfzeilen-Tabs eines Passes (SPEC §6.2). Veröffentlichen und Versionen folgen in Schritt 5. */
export function passportTabs(id: string): HeaderTab[] {
  const base = `/products/passports/${id}`;
  return [
    { label: "Pass-Editor", href: base },
    { label: "Rollen-Vorschau", href: `${base}/preview` },
    { label: "Veröffentlichen", href: `${base}/publish` },
    { label: "Versionen", href: `${base}/versions` },
  ];
}

export function findNavItem(pathname: string): NavItem | undefined {
  return NAV_ITEMS.find((i) => i.href === pathname);
}

/** Aktiver Eintrag: längster passender Pfad, damit /products/passports/x „Produktpässe“ aktiviert, nicht „Produkte“. */
export function activeHref(pathname: string): string | undefined {
  return NAV_ITEMS.filter((i) => pathname === i.href || pathname.startsWith(`${i.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;
}

/** Demo-Werte für den Bereich unten in der Sidebar (fiktiv, SPEC §4). */
export const DEMO_CONTEXT = {
  userName: "Erika Muster",
  userEmail: "erika.muster@muster.example",
  company: "Muster GmbH",
  dataset: "Bilanz 2025",
  appVersion: "2026.11.23-02",
};
