# Echte App: Aufbau und Muster (ng.codegaia.io, Stand 24.11.2026)

Quelle: Screenshots in diesem Ordner und eine Durchsicht der App am 24.11.2026. Die Screenshots zeigen Kennzahlen eines echten Mandanten. Sie dienen nur als Layoutvorlage; keine Werte daraus in den Prototyp übernehmen.

| Datei | Zeigt |
|---|---|
| 01-organisation-tabelle.png | Tab-Gruppe in der Kopfzeile, Seitentitel, Suche + Filter, primärer Button „Erstellen“, Tabelle mit sortierbaren Spalten und Zeilenaktionen |
| 02-dashboard-sidebar-offen.png | Sidebar ausgeklappt, Karten mit Tag + Titel + Wert, Leerzustand „Daten vorhanden?“ |
| 03-dashboard-sidebar-eingeklappt.png | Sidebar eingeklappt: nur Icons, Trennlinien zwischen Abschnitten, unten Icons für Nutzer, Firma, Datensatz |
| 04-berichterstattung-editor.png | Editor-Muster: „Zurück“, Statuskarte, Baum links, Inhalt Mitte, Panel rechts, Navigation unten |

## Sidebar

- Oben Logo, rechts daneben Button zum Einklappen.
- Abschnittstitel klein und grau, darunter Einträge mit Icon und Label.
- Cockpit: Projekte & Aufgaben (`/tasks/projects`), Organisation (`/configure/reporting-entities`), Dashboard (`/performance/environmental`)
- Strategie & Planung: Wesentlichkeit (`/report/materiality`), Transformation (`/improve/targets`), Umweltschutz (externer Link, grün hinterlegt)
- Bilanzierung: Klima & ESG (`/measure/activities`), Produkte (im Mandanten gesperrt), **Produktpässe (neu, im Prototyp)**
- Management: Managementsysteme (gesperrt), Lieferkette (gesperrt)
- Berichterstattung: Berichterstattung (`/report`), EU-Taxonomie (gesperrt)
- Marktplatz: Partner (`/marketplace/partners`)
- Unten: Nutzerin (Name + E-Mail), Firma, Datensatz, „Version: …“
- Aktiv: hellblauer Hintergrund, blaue Schrift. Gesperrt: hellgrau.

## Kopfzeile

- Links: Tab-Gruppe (umrandet, aktiver Tab hellblau mit blauem Rand) oder „Zurück“ auf Detailseiten.
- Rechts: vier quadratische, grau hinterlegte Icon-Buttons: Aufgaben, Notizen, Dateibibliothek, Lernen. Auf manchen Seiten zusätzlich „Kurt AI“ (nicht im Prototyp).

## Inhalt

- Seitenhintergrund hellgrau, Inhalte in weißen Karten mit feinem Rand und abgerundeten Ecken.
- Seitentitel fett, darunter Werkzeugleiste: Suche mit Lupe und Filter-Icon-Button links, primärer Button rechts.
- Tabellen: graue Kopfzeile, Sortier-Icons, Zeilenaktionen als Icon-Buttons in der letzten Spalte (Bearbeiten, Löschen rot, Sperren).
- Editor (Berichterstattung): Statuskarte „Offen / In Bearbeitung / Abgeschlossen“ oben rechts, Baum links mit „Hide sidebar“, Inhaltskarte Mitte mit Tag (z. B. „Freiwillig“), rechtes Panel mit Icon-Tabs und Feldern (Zuständige Person, Genehmigende Person, Status), unten „Vorherige“ links, „Komplett und weiter“ und primär „Nächste“ rechts.
