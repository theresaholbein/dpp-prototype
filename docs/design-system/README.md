# Code Gaia Design System (Produktebene)

Kopie aus dem Code Gaia Design System (Claude, Stand 24.11.2026).

- `tokens.css` – alle CSS-Variablen. Für die Produkt-UI gelten `--ui-*` und `--product-*`. Die `--cg-*`-Werte sind für Marketing.
- `tokens.json` – dieselben Tokens als JSON.
- `fonts/` – DM Sans 400, 500, 700 (woff2).
- `components/` – React-Vorlagen der App-Komponenten, portiert aus den Volt-Komponenten der echten App: AppButton, AppTag, AppCard + AppMessage, AppInput + AppField, SidebarItem + SidebarSection, LucideIcon.

Hinweise:
- `LucideIcon.jsx` lädt Icons aus dem Netz. Im Prototyp stattdessen `lucide-react` mit denselben Namen nutzen.
- `AppInput.jsx` nutzt `--ui-shadow-input`. Laut Design Bible (D) keine Schatten übernehmen.
- Noch nicht portiert (laut Design System): u. a. DataTable, Dialog, Select, Tabs, Toast, Tree. Diese nach Design Bible und Screenshots bauen.
