# SPEC – DPP-Prototyp (MVP)

Stand: 24.11.2026 · Verantwortlich: Theresa Holbein (Product Compliance) · Grundlage: `docs/concept/DPP-Modulkonzept.md`

Legende für Herkunft von Aussagen: 🟢 belegt (Norm, Primärquelle) · 🟡 teilweise belegt oder Interpretation · 🔴 nicht belegt. Diese Markierungen stammen aus dem Konzeptdokument und dürfen nicht „aufgewertet“ werden.

---

## §1 Ziel

Ein durchgängiger, klickbarer Weg in der vertrauten Code-Gaia-Oberfläche:

**Produkt wählen → Pass aus Moduldaten befüllen → Lücken sehen → veröffentlichen → QR scannen → JSON per API abrufen → Registry-Datei exportieren.**

Zweck: zeigen, wie schnell das mit KI geht.

Leitidee aus dem Konzept: Der DPP ist eine **Ausgabeschicht auf dem gemeinsamen Produktkern**, kein neues Datensilo. Er liest aus Produkte, PCF, Lieferkette und PPWR, friert Daten als versionierten Pass ein und liefert ihn aus. Der Feldkatalog ist **pro Produktgruppe konfigurierbar und versioniert** (Templates), nicht hart codiert.

## §2 Scope

**Im Scope**
- App-Shell wie die echte App (§4)
- Sieben DPP-Ansichten (§6)
- Datenmodell nach EN 18223 mit Templates und Demo-Daten (§5)
- Lese-API nach EN 18222 (§7)
- Registry-Export JSON/XML (§8)

**Nicht im Scope**
- Inhalte, Daten oder Logik anderer Module (nur Platzhalterseiten)
- Echte Anbindung an Backend, ERP oder Module (alles gemockt mit Quellenangabe)
- Datenbank, echte Anmeldung und Rollen (Rollen werden simuliert)
- Back-up beim DPP-Dienstleister, Signatur (EN 18246), echte Registry-Registrierung, Batteriepass
- Produkt-Tab „Produktpass“ im Produktdetail (kommt in §12)

## §3 Stack und Hosting

- **Next.js (App Router) + TypeScript**, Tailwind CSS für Layout und Abstände
- Tokens: `docs/design-system/tokens.css` global einbinden; Tailwind-Theme nur auf diese Variablen abbilden
- Schrift: DM Sans lokal aus `docs/design-system/fonts/` (`next/font/local`), Gewichte 400/500/700
- Icons: Lucide über `lucide-react` (gleiche Glyphen wie im Design System; die Vorlage `LucideIcon.jsx` lädt aus dem Netz, das ersetzen wir)
- Komponenten: die React-Vorlagen aus `docs/design-system/components/` als Basis übernehmen (AppButton, AppTag, AppCard/AppMessage, AppInput/AppField, SidebarItem/SidebarSection), nicht neu erfinden. Schatten daraus nicht übernehmen (Design Bible D).
- QR-Code: gepflegte npm-Bibliothek (Vorschlag `qrcode`), Ausgabe SVG
- **Keine Datenbank.** Demo-Daten als typisierte Dateien unter `data/`. Änderungen im Editor speichert der Browser (localStorage). „Veröffentlichen“ wird im Browser simuliert; öffentliche Seite und API liefern die veröffentlichten Versionen aus den Demo-Daten.
- Repo: GitHub `dpp-prototype` (privat) · Hosting: Vercel, Push auf `main` = Production, Branches = Preview
- Vercel Deployment Protection (Vercel Authentication) ist an. Folge: Die öffentliche Seite ist im Demo nur mit Vercel-Login oder Shareable Link erreichbar.

## §4 App-Shell nach der echten App

Vorlage: Screenshots in `docs/reference/` (ng.codegaia.io, 24.11.2026). Details in `docs/reference/NAVIGATION.md`.

**Sidebar** (ausgeklappt mit Logo und Einklapp-Button oben, eingeklappt nur Icons mit Trennlinien zwischen Abschnitten):

| Abschnitt | Einträge |
|---|---|
| Cockpit | Projekte & Aufgaben · Organisation · Dashboard |
| Strategie & Planung | Wesentlichkeit · Transformation · Umweltschutz (grün hinterlegt, wie im Original) |
| Bilanzierung | Klima & ESG · Produkte · **Produktpässe (neu)** |
| Management | Managementsysteme (gesperrt) · Lieferkette (gesperrt) |
| Berichterstattung | Berichterstattung · EU-Taxonomie (gesperrt) |
| Marktplatz | Partner |

- **Platzierung „Produktpässe“: unter Bilanzierung, direkt unter „Produkte“** (entschieden am 24.11.2026).
- Gesperrte Einträge ausgegraut wie im Screenshot. Abweichung zum Screenshot: „Produkte“ ist im Prototyp nicht gesperrt, weil der DPP darauf aufbaut.
- Unten: Nutzerin (Name, E-Mail), Firma, Datensatz, Versionsnummer. Im Prototyp Demo-Werte („Muster GmbH“, „Bilanz 2025“).
- Aktiver Eintrag: hellblauer Hintergrund, blaue Schrift und Icon.

**Kopfzeile:** links Tab-Gruppe der Seite (umrandete Gruppe, aktiver Tab hellblau mit blauem Rand) oder „Zurück“-Button auf Detailseiten; rechts vier quadratische Icon-Buttons mit Tooltip: Aufgaben, Notizen, Dateibibliothek, Lernen (ohne Funktion).

**Platzhalterseite** für jeden anderen Eintrag: Kopfzeile wie im Original, darunter ein leerer Zustand im Stil von „Daten vorhanden?“: „Dieses Modul ist im Prototyp nicht ausgebaut.“

**Routen:** Wo bekannt, die echten Pfade (`/tasks/projects`, `/configure/reporting-entities`, `/performance/environmental`, `/report/materiality`, `/improve/targets`, `/measure/activities`, `/report`, `/marketplace/partners`). 🔴 Pfade für Produkte und Produktpässe sind nicht bekannt; Vorschlag `/products` und `/products/passports`.

## §5 Datenmodell

Alles unter `lib/dpp/` (Typen) und `data/` (Demo-Daten). Eine Lese-Funktion pro Quelle (`getProductData`, `getPcfData`, `getSupplierData`, `getPpwrData`).

**DPP-Template** (versionierte Feldkataloge, als JSON-Dateien)
- ID, Version, Produktgruppe, Status (Entwurf/verbindlich), Feldliste mit Datentyp, Pflicht, Zugriffsebene, `dictionaryReference`, Quell-Mapping — EN 18223 §4.3 🟢; JRC Kap. 8 🟡
- Templates im MVP:
  - „ESPR horizontal“ (Pflichtkern, Anhang III) – gilt immer
  - „Textil Bekleidung (JRC-Entwurf 05/2026)“ – Zusatz für T-Shirt. Banner: „Textil: Datenpunkte nach JRC-Vorschlag vom 13.05.2026. Der delegierte Rechtsakt steht noch aus – Felder sind nicht rechtsverbindlich.“
  - Möbel: nur „ESPR horizontal“. Banner: „Möbel: Delegierter Rechtsakt erst für 2028 geplant. Template nutzt nur horizontale Angaben – nicht rechtsverbindlich.“
- Template-ID landet im Kopf-Feld `contentSpecificationIds`.

**Feldzuordnung der Templates** — 🟡 Entscheidung Product Compliance vom 25.11.2026, Legal-Prüfung offen. Jedes Feld trägt `templateId`, damit der Editor die Herkunft aus dem Template zeigt. Jedes Template-Feld hat `requirement`: `required` | `optional` | `voluntary`. Ein Produktgruppen-Template darf ein Feld des horizontalen Kerns per Override auf `required` hochstufen.

| Template | required | optional |
|---|---|---|
| „ESPR horizontal“ (Basis nach Anhang III und Art. 7(5); welche Felder Pflicht sind, legt der jeweilige Rechtsakt fest) | Eindeutige Produktkennung (UPI), Granularität, Wirtschaftsakteur (Hersteller), Kennung Wirtschaftsakteur, Besorgniserregende Stoffe, Stoffliste mit Konzentrationen | GTIN/Artikelnummer, Produktionsstätte, Zolltarifnummer (HS/TARIC, neu), Konformitätsdokumente, Technische Dokumentation |
| „Textil Bekleidung (JRC-Entwurf 05/2026)“, Zusatz | Faserzusammensetzung, Recyclinganteil, Product Carbon Footprint (Hinweis: JRC sieht PEFCR vor, Demo-Wert nach ISO 14067), Pflegehinweise; Overrides auf required: GTIN/Artikelnummer, Produktionsstätte | Herkunftsland der Faser (Hinweis „in Prüfung“), Reparatur- und Demontagehinweise (freiwillig) |
| „Freiwillige Angaben (Code Gaia)“, nicht rechtlich begründet, alle `voluntary` | – | T-Shirt: Wasserverbrauch Herstellung. Sessel: Hauptmaterialien, Recyclinganteil, Product Carbon Footprint, Demontagehinweise |

„Freiwillige Angaben“ ist keine Inhaltsspezifikation und landet nicht in `contentSpecificationIds`.

**Vollständigkeit (Pflichtfelder)**
- Vollständigkeit = erfüllte Pflichtfelder / alle Pflichtfelder der aktiven Templates, gerundet auf ganze Prozent.
- Erfüllt = Wert vorhanden. Zustand „veraltet“ zählt als erfüllt, wird aber als Warnung gezählt und gezeigt. Optionale und freiwillige Felder zählen nicht.
- Eine Funktion `computeReadiness` in `lib/dpp`; Portfolio, Editor und Veröffentlichen nutzen nur diese.
- Demo-Werte (als Test abgelegt): T-Shirt 11/12 = 92 %, Sessel 4/6 = 67 %.
- Hinweistext: „Pflicht laut Template, nicht rechtsverbindlich. Verbindliche Pflichtfelder legt erst der delegierte Rechtsakt fest.“

**Produktpass (Kopf)** — EN 18223 Tab. 1 🟢
`digitalProductPassportId` (URL), `uniqueProductIdentifier`, `granularity` (model/batch/item), `dppSchemaVersion`, `dppStatus` (active/inactive/archived/invalid), `lastUpdated`, `economicOperatorId`, `facilityId` (optional), `contentSpecificationIds`

**Datenelement** — EN 18223 §4.1.2 🟢; Quelle intern
`elementId`, Typ (SingleValued, MultiValued, Collection, MultiLanguage, RelatedResource), Wert, Zugriffsebene (Öffentlich, Berechtigt, Behörde), Quelle (Modul, Datensatz, Version), Template-Abschnitt (Identität, Akteure, Material, Stoffe, Umwelt, Konformität, Anleitungen), Zustand (vorhanden, fehlt, veraltet), optional `dictionaryReference`

**Pass-Version** — EN 18223 §4.2, EN 18221 §4.2 🟢
Snapshot aller Datenelemente, Zeitstempel, Akteur, geänderte Felder, Vorgängerversion, Versionsnotiz. Veröffentlichte Versionen sind unveränderlich.

**Arbeitsstand, Versionen und Status** (Entscheidung 25.11.2026)
- Ein Pass hat `publishedVersions` (unveränderliche Snapshots), `workingCopy` (aktueller Arbeitsstand, editierbar, nie öffentlich) und optional `registration` (Registrierungs-ID, Datum).
- `dppStatus` (EN 18223) gehört zur veröffentlichten Version, nicht zum Arbeitsstand.
- Der Workflow-Status der UI wird abgeleitet, nicht gespeichert: „Entwurf“ = keine veröffentlichte Version; „Veröffentlicht“ = mindestens eine Version, nicht registriert; „Registriert“ = veröffentlicht und `registration` vorhanden. Zusätzlich `hasUnpublishedChanges` = Arbeitsstand weicht von der letzten Version ab.
- Öffentliche Passseite, API und QR liefern immer die letzte veröffentlichte Version, nie den Arbeitsstand. Ein Pass ohne Version ist öffentlich nicht erreichbar (404).
- Kopf-Felder `uniqueProductIdentifier`, `granularity` und `economicOperatorId` werden aus den Datenelementen der Version abgeleitet; `digitalProductPassportId` aus `NEXT_PUBLIC_BASE_URL` und der DPP-ID.

**Registry-Eintrag** — EN 18222 Tab. 11 🟢
Produkt-ID, DPP-ID, Akteur-ID, Back-up-Akteur-ID, API-Endpunkt, Registrierungs-ID (gemockt), Status

**Granularität** — EN 18219 §4.3/§4.4/§5.2 🟢; Vererbung JRC §9.1 🟡: Ebene bleibt nach Inverkehrbringen fix. Vererbung Einzelstück ← Charge ← Modell.

**Demo-Daten** (alle fiktiv)
- **T-Shirt** „Basic T-Shirt Bio-Baumwolle“, TS-1042, Textil, Ebene Charge, Templates horizontal + Textil-Entwurf. Zeigt Vererbung Modell → Charge. v1 (28.10.2026), v2 (05.11.2026), v3 (18.11.2026) veröffentlicht, nicht registriert. Der Arbeitsstand enthält die drei Änderungen aus `DIFF` im Mockup (`hasUnpublishedChanges`); „Veröffentlichen“ erzeugt v4.
- **Sessel** „Sessel Lino“, SE-220, Möbel, Ebene Modell, nur horizontal. Zeigt, dass Möbel-Inhalte fehlen. Keine veröffentlichte Version, Status „Entwurf“; „Veröffentlichen“ erzeugt v1. Ergänzt: „Kennung Wirtschaftsakteur“ und „Stoffliste mit Konzentrationen“, beide „fehlt“, Quelle Lieferant.
- Drei weitere Pässe nur als Tabellenzeilen (Hoodie veröffentlicht v5, Esstisch Entwurf, Jeans registriert v7).
- Feldwerte, Quellen, Zustände und Zugriffsebenen wie im Mockup `docs/prototype/Main.dc.html` (Konstante `FIELDS`), Versionsverlauf wie `VERS`. Label „Besorgniserregende Stoffe“ statt „SVHC“.
- Fehlende Felder zeigen die Pflegestelle („In Produkte ergänzen“, „Bei Lieferant anfragen“). Der DPP schreibt keine Fachdaten zurück.

## §6 Seiten

Vorlage für Inhalte und Abläufe: `docs/prototype/`. Vorlage für Aussehen: `docs/reference/` und die Design Bible.

1. **Portfolio** (`/products/passports`): Kennzahlen (Kennzahl „Veröffentlicht“ zählt Pässe mit mindestens einer Version), Filter nach Produktgruppe, Tabelle mit Produkt (führendes Element), Template, Ebene, „Pflichtfelder“ in % mit Balken und Tooltip (Hinweistext §5), Status (Entwurf, Veröffentlicht, Registriert, abgeleitet nach §5) als AppTag, bei `hasUnpublishedChanges` in derselben Zelle dezent „Änderungen seit vN“, „Letzte Version“ mit Datum bzw. „–“ bei Entwürfen. Ein primärer Button „Pass anlegen“ (ohne Funktion). Tabs der Kopfzeile: Portfolio · Registry & Export.
2. **Pass-Editor** (`/products/passports/[id]`): Aufbau nach dem Editor-Muster der echten App (Screenshot `04-berichterstattung-editor.png`):
   - oben Statuskarte: „11 von 12 Pflichtfeldern“, darunter „2 veraltet“ und „1 fehlt“, mit Hinweistext §5
   - je Feld zusätzlich der Tag „Pflicht“ bzw. „Optional“ neben Quelle, Zustand und Zugriffsebene
   - links ausblendbarer Baum der Template-Abschnitte
   - Mitte das gewählte Feld bzw. die Feldliste mit Wert, Tags für Quelle, Zustand und Zugriffsebene
   - rechts Panel mit Herkunft (Modul, Datensatz, Version), Zugriffsebene und Aktion („In Quelle öffnen“ führt auf die Platzhalterseite des Moduls; manuelle Felder sind bearbeitbar)
   - unten „Vorheriges Feld“ links, „Nächstes Feld“ rechts
   - Banner je Produktgruppe (§5). Kopfzeile: „Zurück“ und Tabs Pass-Editor · Rollen-Vorschau · Veröffentlichen · Versionen.
3. **Rollen-Vorschau**: Umschalter Verbraucher · Reparatur/Recycling · Marktüberwachung; zeigt die öffentliche Ansicht gefiltert nach Zugriffsebene, mit Anzahl ausgeblendeter Felder.
4. **Veröffentlichen**: Änderungen des Arbeitsstands zur letzten Version, Versionsnotiz, primärer Button „Als vN veröffentlichen“. Ohne Änderungen ist der Button deaktiviert, mit Hinweis „Keine Änderungen seit vN“. Fehlende Pflichtfelder erscheinen als Warnung; Veröffentlichen bleibt möglich (Prototyp). Danach QR-Code: Druckgröße (20/30/40 mm), Fehlerkorrektur L/M/Q/H, optionaler IEC-61406-Rahmen, Download als SVG. QR nach ISO/IEC 18004, 4 Module Ruhezone (EN 18220 §5, §6 🟢). Inhalt: URL der öffentlichen Passseite.
5. **Registry & Export**: Tabelle mit Auswahl (max. 100), Format JSON oder XML, „Upload-Datei erzeugen“, Ergebnis je Zeile (aufgenommen, Fehler „nicht veröffentlicht“ bei Status „Entwurf“, bereits registriert mit Mock-ID). In die Datei kommt die letzte veröffentlichte Version (T-Shirt mit v3); offene Änderungen nicht mitnehmen, aber einen Hinweis zeigen.
6. **Versionen**: Zeitleiste mit Version, Datum, Akteur, geänderten Feldern, Notiz; „Stand am Datum“ sucht nur in den veröffentlichten Versionen. Ohne Version Leerzustand „Noch nicht veröffentlicht“.
7. **Öffentliche Passseite** (`/p/[dppId]`, ohne App-Shell, mobil zuerst): Produktname groß zuerst (internes Feedback, Konzept), Kurzfakten, aufklappbare Abschnitte, Sprachumschalter DE/EN, Dokumente, Button „Zugang für Fachleute“, Fußzeile mit DPP-ID, Version, Stand, verantwortlichem Akteur. Nur Felder „Öffentlich“. HTML barrierefrei (EN 301 549 laut EN 18216 🟢).

**Zustände** (Design Bible J): Leerzustand und Ladezustand für jede Liste, Fehler allgemein als Toast, Feldfehler inline.

## §7 Lese-API (EN 18222)

Route Handler unter `/api/v1/dpps`. JSON Pflicht; XML/JSON-LD optional per Content Negotiation (EN 18216 §5, EN 18222 §8.1 🟢). Ohne Anmeldung nur Felder der Ebene „Öffentlich“.

| Operation | Pfad (Vorschlag) | Status |
|---|---|---|
| ReadDPPById | `GET /api/v1/dpps/{dppId}` | Pflicht 🟢 |
| ReadDPPByProductId | `GET /api/v1/dpps?productId={upi}` | Pflicht 🟢 |
| ReadDPPIdsByProductIds | `POST /api/v1/dpps/ids` mit Liste | Pflicht 🟢 |
| ReadDPPVersionByIdAndDate | `GET /api/v1/dpps/{dppId}?date=YYYY-MM-DD` | empfohlen 🟢 |
| ReadDataElement | `GET /api/v1/dpps/{dppId}/elements/{path}` | empfohlen 🟢 |

🟡 Die genauen Pfade und Parameter sind ein Vorschlag und noch gegen EN 18222 §4/§8 zu prüfen. Create/Update/Delete sind nicht im MVP.

## §8 Registry-Export

- Upload per JSON- oder XML-Datei, **max. 100 DPPs je Datei** (Registry User Guide v1.03, 16.09.2026 🟢)
- Felder der Vorlage: `schemaVersion`, `productGroup`, `items[].uniqueProductIdentifier` (intern, Slack 19.11.2026)
- Registrierungsdatensatz je Pass nach EN 18222 Tab. 11 🟢 (siehe §5)
- Registrierungs-ID wird gemockt (z. B. `REG-DEMO-0007`)
- In UI und Code sichtbar kennzeichnen: „Format vereinfacht – gegen offizielle Registry-Vorlage prüfen.“ 🟡

## §9 Design-Regeln (Kurzfassung)

Verbindlich ist `docs/design-bible/DESIGN-BIBLE.md`. Die wichtigsten Punkte für diesen Build:

- Weißraum großzügig; Abstände nur aus der Skala 2/4/8 (6 selten), als `gap` auf dem Wrapper, Padding rundum gleich (E)
- Keine Schatten; Trennung über Farbe, Kontrast, Rand mit ≥ 3:1 (D)
- Ein primärer blauer Button pro Inhaltsbereich; höchstens sechs Hauptfunktionen pro Seite (F)
- Icon-only-Buttons nur bei eindeutigem Icon, immer mit Tooltip; Klickfläche ≥ 24 × 24 px (G)
- Tabellen: ein führendes Element pro Zeile, Zeilenaktionen in eigener Spalte ganz rechts, Nebenfunktionen bei Hover/Fokus einblenden (H)
- Leichtestes passendes Gefäß: Panel < Dialog < eigene Seite; Bestätigungsdialog nur bei folgenreichen Aktionen (I) — „Veröffentlichen“ erzeugt eine unveränderliche Version, daher Bestätigung mit konkretem Text
- Leer-, Lade-, Fehler- und Berechtigungszustände für jede Seite (J)
- Text: Satzanfang groß, keine Versalien, keine Unterstreichung oder Kursivschrift zur Auszeichnung, definiertes Umbruchverhalten (K)
- Alles per Tastatur erreichbar, auch Hover-Elemente (I)

## §10 Umgebungsvariablen

| Name | Zweck | Secret |
|---|---|---|
| `NEXT_PUBLIC_BASE_URL` | Basis-URL für QR-Code und `digitalProductPassportId`, lokal `http://localhost:3000`, auf Vercel die Production-URL `https://dpp-prototype-five.vercel.app` | nein |

Keine weiteren Variablen im MVP.

## §11 Bauschritte

1. **App-Shell** – Sidebar, Kopfzeile, Platzhalterseiten nach §4 (Mi Vormittag)
2. **Datenmodell + Portfolio** – §5, §6.1 (Mi)
3. **Vercel** – Import, Deployment Protection (Mi Nachmittag)
4. **Pass-Editor + Rollen-Vorschau** – §6.2, §6.3 (Do Vormittag)
5. **Veröffentlichen, Versionen, QR, öffentliche Seite** – §6.4, §6.6, §6.7 (Do Nachmittag)
6. **Lese-API** – §7 (Fr Vormittag)
7. **Registry-Export** – §8, §6.5 (Fr Vormittag)
8. **Feinschliff, Review** – §9, README, offene Fragen in `docs/OPEN-QUESTIONS.md` (Fr)

**Abnahme** (aus dem Konzept):
1. JSON eines Passes enthält alle Kopf-Felder aus EN 18223 Tab. 1.
2. QR-Code öffnet die öffentliche Seite (im Demo mit Vercel-Login bzw. Shareable Link, siehe §3).
3. Eine Änderung erzeugt Version 2, Version 1 bleibt abrufbar.
4. Rollen-Vorschau blendet eingeschränkte Felder aus.
5. Export-Datei hat das Registry-Format mit bis zu 100 Einträgen.

## §12 Später (nicht im MVP)

- Echte Daten aus Produkte, PCF, Lieferkette, PPWR; ERP per CSV simulieren
- Datenbank und echte Persistenz der Versionen; Anmeldung und Rollen nach EN 18239
- Tab „Produktpass“ im Produktdetail (dort, wo heute der PPWR-Pass liegt)
- Create/Update/Delete-Endpunkte; XML und JSON-LD vollständig
- Offizielle Registry-Vorlage und echte Registrierung, sobald Textil-Kategorie freigeschaltet
- Back-up beim DPP-Dienstleister (F11), Signatur (EN 18246)
- PEF-Felder im Datenmodell vorsehen (OKR 1)

## Offen / nicht belegt (aus dem Konzept)

- 🔴 Rechtsakt für DPP-Dienstleister (Inhalt, Termin)
- 🔴 EN 18246 Stand; EN 18239 Inhalt und Zitierung im Amtsblatt nicht bestätigt
- 🔴 DPP-Inhalte für Möbel: keine Studie, kein Entwurf
- 🟡 Registry-API für System-zu-System-Registrierung nicht beschrieben
- 🟡 ESPR-Artikel nicht direkt auf EUR-Lex gelesen; Legal bestätigt bindende Auslegungen
- 🟡 Aufbewahrungsdauer mindestens 10 Jahre laut JRC, nicht gegen ESPR-Text geprüft

## Offen aus dem Bau (Schritt 2, 25.11.2026)

- 🔴 `economicOperatorId` ist Pflicht-Kopffeld (EN 18223 Tab. 1), die „Kennung Wirtschaftsakteur“ fehlt aber in beiden Demo-Pässen. Umsetzung vorerst: Kopf-Feld `null`, „Veröffentlichen“ soll warnen. Entscheidung offen: so lassen oder Demo-Kennung ergänzen.
- 🔴 PCF-Wert des T-Shirts in v1/v2 („4,8 kg CO2e je Stück“) ist erfunden, damit die v3-Notiz „PCF neu berechnet“ einen Vorgänger hat.
- 🔴 Welche T-Shirt-Felder vom Modell geerbt werden (GTIN/Artikelnummer, Zolltarifnummer, Wirtschaftsakteur, Faserzusammensetzung, Pflegehinweise), ist ein Demo-Vorschlag, nicht belegt.
- 🟡 Feldzuordnung und Pflicht-Einstufung der Templates (§5) sind eine interne Entscheidung, nicht von Legal geprüft.

## Offen aus dem Bau (Schritt 4, 25.11.2026)

- 🟡 „In Quelle öffnen“ führt bei PCF-Feldern auf „Produkte“ (Entscheidung 25.11.2026). In welchem Modul der PCF in der echten App liegt, ist offen.
- Granularität ist nur ohne veröffentlichte Version bearbeitbar (Entscheidung 25.11.2026). Seit Schritt 5 leitet der Kopf `granularity` aus dem Feld „Granularität“ der Version ab (§5).
- Für den Bestätigungsdialog gibt es kein Overlay-Token; der Hintergrund nutzt das Browser-Standard-Backdrop.
- Abweichungen vom Design System wegen Kontrast: Warn-Meldung mit dunklem Text (yellow-110 nur fürs Icon), Feldfehler in red-110 statt pink.

## Entscheidungen und offene Punkte aus Schritt 5 (25.11.2026)

- QR-Bibliothek: `qrcode` (MIT). Das SVG bauen wir aus der Modulmatrix selbst (Größe in mm, Ruhezone 4 Module, optionaler Rahmen). Farben der Druckdatei aus `tokens.css` (surface-950 auf surface-0).
- Öffentliche Seite, QR-Code und API zeigen nur die Demo-Versionen (§3). Im Browser veröffentlichte Versionen erscheinen in Portfolio, Editor, Veröffentlichen und Versionen, mit Hinweis „Nur in diesem Browser“. Erfolgsmeldung nennt das ausdrücklich.
- Sprachen: Als `MultiLanguage` nur sprachabhängiger Text (Faserzusammensetzung, Pflegehinweise, Reparatur-/Demontagehinweise, Besorgniserregende Stoffe, Dokumenttitel, Product Carbon Footprint und Granularität, weil ihre Werte deutschen Text enthalten wie „je Stück“ oder „Charge“). Kennungen, Firmennamen und URLs bleiben einsprachig. Der Editor schreibt bei der Granularität Deutsch und Englisch. Fehlt EN, zeigt die Seite den deutschen Wert mit `lang="de"`. Alle EN-Texte der Demo-Daten sind fiktive Demo-Übersetzungen. Template-Felder haben `labelEn`; der Produktname hat optional `productNameEn`.
- Neues freiwilliges Feld „Pflegeanleitung“ (Template „Freiwillige Angaben (Code Gaia)“, öffentlich, Quelle Modul Produkte, Datensatz „Produktdateien“), beim T-Shirt in allen Versionen. Platzhalter-PDF unter `public/demo/`. `RelatedResource` hat optional `title` (de/en), `mimeType`, `languages`.
- Kernangaben der öffentlichen Seite je Produktgruppe in `data/product-groups.ts` (Auswahl nach Mockup, keine Rechtsvorgabe).
- Akteur der Versionen ist die fiktive Demo-Nutzerin „Erika Muster“, auch bei den Demo-Versionen v1 und v3 (vorher „T. Holbein“ aus dem Mockup, ersetzt nach CLAUDE.md Regel 6). Versionsnotiz ist optional.
- 🔴 IEC 61406: Maße und Kennzeichnung des Rahmens sind nicht belegt. Umgesetzt ist nur ein Rahmen von 1 Modul Stärke außerhalb der Ruhezone. Druckgröße = Kantenlänge der ganzen Datei inklusive Ruhezone und Rahmen; ob sich die Druckgröße auf das Symbol ohne Ruhezone beziehen soll, ist offen.
- 🟡 „Zugang für Fachleute“ zeigt nur einen Hinweis; Anmeldung und Rollen nach EN 18239 kommen später (§12).

## Offen aus dem Design-Review (Schritt 4, 25.11.2026)

Design Bible D verlangt ≥ 3:1 Kontrast für Ränder und Hintergründe von UI-Komponenten. Diese Werte kommen direkt aus `tokens.css` bzw. den Design-System-Vorlagen, gelten app-weit und entsprechen den Screenshots der echten App; sie sind deshalb nicht geändert, sondern brauchen eine Entscheidung:
- Kartenrand `--ui-border` (surface-300) auf Weiß: 1,5:1
- Trennlinien `--ui-border-hairline` auf Weiß: ca. 1,2:1 (Kopfzeile, Sidebar, Tabellen, Feldliste)
- Rand des Outlined-Buttons (primary-200) auf Weiß: 1,8:1
- Rand und Fläche von AppMessage „warn“ (yellow auf yellow-light bzw. Seite): 2,2:1 / 2,4:1
- Spur des Fortschrittsbalkens (surface-200) auf Weiß: 1,3:1 (der Wert steht immer als Zahl daneben)
- Innenabstände der Atome aus dem Design System (AppButton, AppTag, AppInput: horizontal ≠ vertikal) bleiben wie im Design System.
- Berechtigungszustand (Design Bible J): Im Prototyp gibt es keine Anmeldung und keine Rechte (SPEC §2), daher kein Zustand „keine Berechtigung“.

## Entscheidungen und offene Punkte aus Schritt 6 und 7 (25.11.2026)

Die Rückfragen zu Schritt 6/7 blieben unbeantwortet; umgesetzt sind diese Annahmen, mit dem Plan freigegeben:
- Der Prototyp ist eine Demo, keine Vorlage für die Umsetzung (Entscheidung 25.11.2026).
- Lese-API: nur JSON (XML/JSON-LD weiter §12). Nur Datenelemente der Ebene „Öffentlich“, ohne interne Angaben Quelle und Zustand. Nur Demo-Versionen, wie öffentliche Seite und QR. `ReadDataElement` adressiert über `elementId` (`templateId/key`); nicht öffentliche Elemente antworten 403, unbekannte 404. `ReadDPPIdsByProductIds` erwartet `{ "productIds": [...] }`, unbekannte Kennungen ergeben `dppId: null`. CORS offen für alle Ursprünge.
- Registry-Export: In die Datei kommt die letzte Demo-Version; offene Änderungen und nur im Browser veröffentlichte Versionen nicht, mit Hinweis in der Tabelle.
- Registry-Export: Fehlt die Kennung Wirtschaftsakteur (T-Shirt v3), wird der Pass trotzdem aufgenommen (`economicOperatorId: null`) und die Zeile warnt. Siehe offener Punkt aus Schritt 2.
- Registry-Export: Reine Tabellenzeilen ohne Passdaten (Hoodie) ergeben den Fehler „Keine Passdaten im Prototyp“; keine erfundene Produktkennung.
- Registry-Export: Eine Datei je Produktgruppe, Auswahl insgesamt höchstens 100.
- 🔴 Wert von `schemaVersion` („demo-0.1“), Codes für `productGroup` („textile“, „furniture“) und die Namen der Item-Felder (`dppId`, `economicOperatorId`, `backupOperatorId`, `apiEndpoint`, `status`) sind Annahmen, nicht aus der Registry-Vorlage. `backupOperatorId` ist immer leer (Back-up nicht im MVP).
