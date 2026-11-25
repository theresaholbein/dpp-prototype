# DPP-Prototyp Code Gaia

Ein klickbarer MVP des Digitalen Produktpasses (DPP) in der vertrauten Code-Gaia-Oberfläche. Er zeigt, wie schnell so etwas mit KI entsteht. Der Prototyp ist eine Demo, keine Vorlage für die Umsetzung.

Durchgängiger Weg: **Produkt wählen → Pass aus Moduldaten befüllen → Lücken sehen → veröffentlichen → QR scannen → JSON per API abrufen → Registry-Datei exportieren.**

Verbindlich für Inhalte und Entscheidungen ist [SPEC.md](SPEC.md).

## Was der Prototyp zeigt

| Ansicht | Route | Inhalt |
|---|---|---|
| Portfolio | `/products/passports` | Kennzahlen, Filter nach Produktgruppe, Tabelle mit Pflichtfeldern in % und Status |
| Pass-Editor | `/products/passports/[id]` | Template-Abschnitte, Feldliste mit Quelle, Zustand und Zugriffsebene, Vollständigkeit, Herkunft des Felds |
| Rollen-Vorschau | `/products/passports/[id]/preview` | Sicht als Verbraucher, Reparatur/Recycling oder Marktüberwachung, mit Anzahl ausgeblendeter Felder |
| Veröffentlichen | `/products/passports/[id]/publish` | Änderungen seit der letzten Version, Versionsnotiz, Bestätigung, QR-Code als SVG |
| Versionen | `/products/passports/[id]/versions` | Zeitleiste und „Stand am Datum“ |
| Registry & Export | `/products/passports/registry` | Auswahl (max. 100), Upload-Datei als JSON oder XML, Ergebnis je Zeile |
| Öffentliche Passseite | `/p/[dppId]` | Ohne App-Shell, mobil zuerst, DE/EN, nur Felder „Öffentlich“ |

**Lese-API nach EN 18222** unter `/api/v1/dpps` (nur JSON, nur Felder „Öffentlich“):

| Operation | Pfad |
|---|---|
| ReadDPPById | `GET /api/v1/dpps/{dppId}` |
| ReadDPPByProductId | `GET /api/v1/dpps?productId={upi}` |
| ReadDPPIdsByProductIds | `POST /api/v1/dpps/ids` mit `{ "productIds": [...] }` |
| ReadDPPVersionByIdAndDate | `GET /api/v1/dpps/{dppId}?date=YYYY-MM-DD` |
| ReadDataElement | `GET /api/v1/dpps/{dppId}/elements/{templateId}/{key}` |

**Demo-Pässe** (alle fiktiv):
- **Basic T-Shirt Bio-Baumwolle** (TS-1042, Textil, Ebene Charge, DPP-ID `ts1042-l2026-114`): v1–v3 veröffentlicht, nicht registriert, Arbeitsstand mit offenen Änderungen. „Veröffentlichen“ erzeugt v4.
- **Sessel Lino** (SE-220, Möbel, Ebene Modell): Entwurf ohne Version. „Veröffentlichen“ erzeugt v1.
- Drei weitere Pässe nur als Tabellenzeilen: Hoodie (veröffentlicht v5), Esstisch (Entwurf), Jeans (registriert v7).

Alle anderen Module der App sind als Platzhalterseiten sichtbar, ohne Inhalte, Daten oder Logik.

## Was simuliert ist

- **Demo-Daten:** Alle Werte sind fiktiv und liegen typisiert unter `data/`. Produkte, PCF, Lieferkette und PPWR sind nicht angebunden; der Pass zeigt nur die Quelle an und schreibt keine Fachdaten zurück.
- **Keine Datenbank:** Änderungen im Editor und Veröffentlichungen speichert der Browser (localStorage). Sie erscheinen in Portfolio, Editor, Veröffentlichen und Versionen mit dem Hinweis „Nur in diesem Browser“. Öffentliche Seite, QR-Code und API liefern nur die veröffentlichten Demo-Versionen.
- **Rollen:** Es gibt keine Anmeldung und keine Rechte. Die Rollen-Vorschau filtert nach Zugriffsebene. „Zugang für Fachleute“ auf der öffentlichen Seite zeigt nur einen Hinweis; Anmeldung und Rollen nach EN 18239 kommen später.
- **Registry:** Das Dateiformat ist vereinfacht und muss gegen die offizielle Registry-Vorlage geprüft werden. Die Registrierungs-ID ist gemockt (z. B. `REG-DEMO-0007`), die Registry selbst ist nicht angebunden. In die Datei kommt die letzte Demo-Version; offene Änderungen nicht.
- **Nicht im Prototyp:** Back-up beim DPP-Dienstleister, Signatur (EN 18246), echte Registrierung, Batteriepass, Create/Update/Delete in der API.

## Lokal starten

Voraussetzung: Node.js und npm.

```bash
npm install
```

`.env.local` anlegen (Vorlage `.env.example`):

```
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

```bash
npm run dev
```

Danach http://localhost:3000 öffnen; die Startseite leitet zum Portfolio weiter.

Weitere Befehle:

```bash
npm run lint
```

```bash
npm test
```

```bash
npm run build
```

## Deploy auf Vercel

- Repository `dpp-prototype` ist mit Vercel verbunden: Push auf `main` = Production, andere Branches = Preview.
- Umgebungsvariable `NEXT_PUBLIC_BASE_URL` auf die Production-URL setzen (`https://dpp-prototype-five.vercel.app`). Sie bestimmt den Inhalt des QR-Codes und die `digitalProductPassportId`.
- Vercel Deployment Protection (Vercel Authentication) ist an. Die öffentliche Passseite ist im Demo deshalb nur mit Vercel-Login oder Shareable Link erreichbar, auch beim Scannen des QR-Codes.

## Demo zurücksetzen

„Demo zurücksetzen“ steht unter der Portfolio-Tabelle und auf der Fehlerseite. Nach einer Bestätigung verwirft der Button alle Änderungen und Veröffentlichungen der Demo in diesem Browser; T-Shirt und Sessel stehen danach wieder auf dem Ausgangsstand.

## Offene Punkte

Herkunft der Aussagen wie in SPEC.md: 🟢 belegt · 🟡 teilweise belegt oder Interpretation · 🔴 nicht belegt. Die Markierungen sind aus SPEC.md übernommen und nicht aufgewertet.

**Rechtsgrundlage und Normen**
- 🔴 Rechtsakt für DPP-Dienstleister (Inhalt, Termin)
- 🔴 EN 18246 Stand; EN 18239 Inhalt und Zitierung im Amtsblatt nicht bestätigt
- 🔴 DPP-Inhalte für Möbel: keine Studie, kein Entwurf
- 🟡 ESPR-Artikel nicht direkt auf EUR-Lex gelesen; Legal bestätigt bindende Auslegungen
- 🟡 Aufbewahrungsdauer mindestens 10 Jahre laut JRC, nicht gegen ESPR-Text geprüft

**Datenmodell und Demo-Daten**
- 🔴 `economicOperatorId` ist Pflicht-Kopffeld (EN 18223 Tab. 1), die „Kennung Wirtschaftsakteur“ fehlt aber in beiden Demo-Pässen. Kopf-Feld bleibt `null`, Veröffentlichen und Registry-Export warnen. Entscheidung offen: so lassen oder Demo-Kennung ergänzen.
- 🔴 PCF-Wert des T-Shirts in v1/v2 („4,8 kg CO2e je Stück“) ist erfunden, damit die v3-Notiz einen Vorgänger hat.
- 🔴 Welche T-Shirt-Felder vom Modell geerbt werden, ist ein Demo-Vorschlag, nicht belegt.
- 🟡 Feldzuordnung und Pflicht-Einstufung der Templates sind eine interne Entscheidung, nicht von Legal geprüft.
- 🟡 „In Quelle öffnen“ führt bei PCF-Feldern auf „Produkte“. In welchem Modul der PCF in der echten App liegt, ist offen.
- 🔴 Pfade für Produkte und Produktpässe in der echten App sind nicht bekannt; umgesetzt sind `/products` und `/products/passports`.

**API und Registry**
- 🟡 Pfade und Parameter der Lese-API sind ein Vorschlag und noch gegen EN 18222 §4/§8 zu prüfen.
- 🟡 Registry-API für System-zu-System-Registrierung nicht beschrieben.
- 🔴 Wert von `schemaVersion` („demo-0.1“), Codes für `productGroup` („textile“, „furniture“) und die Namen der Item-Felder (`dppId`, `economicOperatorId`, `backupOperatorId`, `apiEndpoint`, `status`) sind Annahmen, nicht aus der Registry-Vorlage. `backupOperatorId` ist immer leer.

**QR-Code**
- 🔴 IEC 61406: Maße und Kennzeichnung des Rahmens sind nicht belegt. Umgesetzt ist nur ein Rahmen von 1 Modul Stärke außerhalb der Ruhezone. Ob sich die Druckgröße auf das Symbol ohne Ruhezone beziehen soll, ist offen.

**Design**
- Ränder und Flächen unter 3:1 Kontrast (Design Bible D) kommen direkt aus `tokens.css` und brauchen eine Entscheidung: Kartenrand (1,5:1), Trennlinien (ca. 1,2:1), Rand des Outlined-Buttons (1,8:1), AppMessage „warn“ (2,2:1 / 2,4:1), Spur des Fortschrittsbalkens (1,3:1).
- Innenabstände der Atome aus dem Design System (AppButton, AppTag, AppInput) bleiben wie im Design System.
- Für den Bestätigungsdialog gibt es kein Overlay-Token; der Hintergrund nutzt das Browser-Standard-Backdrop.
- Kein Berechtigungszustand (Design Bible J), weil es im Prototyp keine Anmeldung und keine Rechte gibt.
