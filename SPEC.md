# SPEC – DPP-Prototyp (MVP)

Stand: 24.11.2026 · Verantwortlich: Theresa Holbein (Product Compliance) · Grundlage: `docs/concept/DPP-Modulkonzept.md`

Legende für Herkunft von Aussagen: 🟢 belegt (Norm, Primärquelle) · 🟡 teilweise belegt oder Interpretation · 🔴 nicht belegt. Diese Markierungen stammen aus dem Konzeptdokument und dürfen nicht „aufgewertet“ werden.

---

## §1 Ziel

Ein durchgängiger, klickbarer Weg in der vertrauten Code-Gaia-Oberfläche:

**Produkt wählen → Pass aus Moduldaten befüllen → Lücken sehen → veröffentlichen → QR scannen → JSON per API abrufen → Registry-Datei exportieren.**

Zweck: zeigen, wie schnell das mit KI geht, und dem Engineering eine wiederverwendbare Vorlage für Datenmodell (EN 18223), API (EN 18222) und UI geben.

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
- 🟡 Hinweis fürs Engineering: Die echte App nutzt laut Design System Vue mit Volt-Komponenten. Der Prototyp ist React; er ist Vorlage für Struktur und Verhalten, nicht für direkten Code-Transfer.

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

Alles unter `lib/dpp/` (Typen) und `data/` (Demo-Daten). Eine Lese-Funktion pro Quelle (`getProductData`, `getPcfData`, `getSupplierData`, `getPpwrData`), damit Engineering später echte Module anschließen kann.

**DPP-Template** (versionierte Feldkataloge, als JSON-Dateien)
- ID, Version, Produktgruppe, Status (Entwurf/verbindlich), Feldliste mit Datentyp, Pflicht, Zugriffsebene, `dictionaryReference`, Quell-Mapping — EN 18223 §4.3 🟢; JRC Kap. 8 🟡
- Templates im MVP:
  - „ESPR horizontal“ (Pflichtkern, Anhang III) – gilt immer
  - „Textil Bekleidung (JRC-Entwurf 05/2026)“ – Zusatz für T-Shirt. Banner: „Textil: Datenpunkte nach JRC-Vorschlag vom 13.05.2026. Der delegierte Rechtsakt steht noch aus – Felder sind nicht rechtsverbindlich.“
  - Möbel: nur „ESPR horizontal“. Banner: „Möbel: Delegierter Rechtsakt erst für 2028 geplant. Template nutzt nur horizontale Angaben – nicht rechtsverbindlich.“
- Template-ID landet im Kopf-Feld `contentSpecificationIds`.

**Produktpass (Kopf)** — EN 18223 Tab. 1 🟢
`digitalProductPassportId` (URL), `uniqueProductIdentifier`, `granularity` (model/batch/item), `dppSchemaVersion`, `dppStatus` (active/inactive/archived/invalid), `lastUpdated`, `economicOperatorId`, `facilityId` (optional), `contentSpecificationIds`

**Datenelement** — EN 18223 §4.1.2 🟢; Quelle intern
`elementId`, Typ (SingleValued, MultiValued, Collection, MultiLanguage, RelatedResource), Wert, Zugriffsebene (Öffentlich, Berechtigt, Behörde), Quelle (Modul, Datensatz, Version), Template-Abschnitt (Identität, Akteure, Material, Stoffe, Umwelt, Konformität, Anleitungen), Zustand (vorhanden, fehlt, veraltet), optional `dictionaryReference`

**Pass-Version** — EN 18223 §4.2, EN 18221 §4.2 🟢
Snapshot aller Datenelemente, Zeitstempel, Akteur, geänderte Felder, Vorgängerversion, Versionsnotiz. Veröffentlichte Versionen sind unveränderlich.

**Registry-Eintrag** — EN 18222 Tab. 11 🟢
Produkt-ID, DPP-ID, Akteur-ID, Back-up-Akteur-ID, API-Endpunkt, Registrierungs-ID (gemockt), Status

**Granularität** — EN 18219 §4.3/§4.4/§5.2 🟢; Vererbung JRC §9.1 🟡: Ebene bleibt nach Inverkehrbringen fix. Vererbung Einzelstück ← Charge ← Modell.

**Demo-Daten** (alle fiktiv)
- **T-Shirt** „Basic T-Shirt Bio-Baumwolle“, TS-1042, Textil, Ebene Charge, Templates horizontal + Textil-Entwurf. Zeigt Vererbung Modell → Charge.
- **Sessel** „Sessel Lino“, SE-220, Möbel, Ebene Modell, nur horizontal. Zeigt, dass Möbel-Inhalte fehlen.
- Drei weitere Pässe nur als Tabellenzeilen (Hoodie veröffentlicht, Esstisch Entwurf, Jeans registriert).
- Feldwerte, Quellen, Zustände und Zugriffsebenen wie im Mockup `docs/prototype/Main.dc.html` (Konstante `FIELDS`), Versionsverlauf wie `VERS`.
- Fehlende Felder zeigen die Pflegestelle („In Produkte ergänzen“, „Bei Lieferant anfragen“). Der DPP schreibt keine Fachdaten zurück.

## §6 Seiten

Vorlage für Inhalte und Abläufe: `docs/prototype/`. Vorlage für Aussehen: `docs/reference/` und die Design Bible.

1. **Portfolio** (`/products/passports`): Kennzahlen, Filter nach Produktgruppe, Tabelle mit Produkt (führendes Element), Template, Ebene, Vollständigkeit in %, Status (Entwurf, Veröffentlicht, Registriert) als AppTag, letzte Version. Ein primärer Button „Pass anlegen“ (ohne Funktion). Tabs der Kopfzeile: Portfolio · Registry & Export.
2. **Pass-Editor** (`/products/passports/[id]`): Aufbau nach dem Editor-Muster der echten App (Screenshot `04-berichterstattung-editor.png`):
   - oben Statuskarte mit „vorhanden / fehlt / veraltet“ und Vollständigkeit in %
   - links ausblendbarer Baum der Template-Abschnitte
   - Mitte das gewählte Feld bzw. die Feldliste mit Wert, Tags für Quelle, Zustand und Zugriffsebene
   - rechts Panel mit Herkunft (Modul, Datensatz, Version), Zugriffsebene und Aktion („In Quelle öffnen“ führt auf die Platzhalterseite des Moduls; manuelle Felder sind bearbeitbar)
   - unten „Vorheriges Feld“ links, „Nächstes Feld“ rechts
   - Banner je Produktgruppe (§5). Kopfzeile: „Zurück“ und Tabs Pass-Editor · Rollen-Vorschau · Veröffentlichen · Versionen.
3. **Rollen-Vorschau**: Umschalter Verbraucher · Reparatur/Recycling · Marktüberwachung; zeigt die öffentliche Ansicht gefiltert nach Zugriffsebene, mit Anzahl ausgeblendeter Felder.
4. **Veröffentlichen**: Änderungen zur letzten Version, Versionsnotiz, primärer Button „Als vN veröffentlichen“. Danach QR-Code: Druckgröße (20/30/40 mm), Fehlerkorrektur L/M/Q/H, optionaler IEC-61406-Rahmen, Download als SVG. QR nach ISO/IEC 18004, 4 Module Ruhezone (EN 18220 §5, §6 🟢). Inhalt: URL der öffentlichen Passseite.
5. **Registry & Export**: Tabelle mit Auswahl (max. 100), Format JSON oder XML, „Upload-Datei erzeugen“, Ergebnis je Zeile (aufgenommen, Fehler „nicht veröffentlicht“, bereits registriert mit Mock-ID).
6. **Versionen**: Zeitleiste mit Version, Datum, Akteur, geänderten Feldern, Notiz; „Stand am Datum“ zeigt die gültige Version.
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

🟡 Die genauen Pfade und Parameter sind ein Vorschlag; Engineering prüft sie gegen EN 18222 §4/§8. Create/Update/Delete sind nicht im MVP.

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
| `NEXT_PUBLIC_BASE_URL` | Basis-URL für QR-Code und `digitalProductPassportId`, lokal `http://localhost:3000`, auf Vercel die Production-URL | nein |

Keine weiteren Variablen im MVP.

## §11 Bauschritte

1. **App-Shell** – Sidebar, Kopfzeile, Platzhalterseiten nach §4 (Mi Vormittag)
2. **Datenmodell + Portfolio** – §5, §6.1 (Mi)
3. **Vercel** – Import, Deployment Protection (Mi Nachmittag)
4. **Pass-Editor + Rollen-Vorschau** – §6.2, §6.3 (Do Vormittag)
5. **Veröffentlichen, Versionen, QR, öffentliche Seite** – §6.4, §6.6, §6.7 (Do Nachmittag)
6. **Lese-API** – §7 (Fr Vormittag)
7. **Registry-Export** – §8, §6.5 (Fr Vormittag)
8. **Feinschliff, Review, Übergabe-Doku** – §9, README, `docs/ARCHITECTURE.md`, `docs/OPEN-QUESTIONS.md` (Fr)

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
