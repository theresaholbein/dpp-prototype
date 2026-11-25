
# DPP-Modul Code Gaia – Anforderungen & Modulkonzept
 · 
## Kurzfassung
Das DPP-Modul sollte kein neuer Datensilo werden, sondern eine Ausgabeschicht auf dem gemeinsamen Produktkern: Es liest Daten aus Products, PCF, Suppliers und PPWR, friert sie als versionierten Pass ein und liefert ihn normkonform aus (Identifier, QR, HTML/JSON, API, Registry-Export). Die Technik ist seit Juli 2026 durch sechs harmonisierte EN-Normen und die EU-Registry festgelegt. Die Inhalte je Produktgruppe sind es noch nicht: Für Textil gibt es nur einen JRC-Vorschlag, für Möbel noch gar nichts. Deshalb muss der Feldkatalog pro Produktgruppe konfigurierbar und versioniert sein, nicht hart codiert.
Der Prototyp sollte genau diese Trennung zeigen: horizontaler Pflichtkern (gilt immer) plus austauschbares Produktgruppen-Template (Textil-Entwurf, Möbel nur horizontal).
Legende: 🟢 belegt (Anhang/Primärquelle) · 🟡 teilweise belegt, Sekundärquelle oder Interpretation · 🔴 nicht belegt. „Intern“ = Code-Gaia-Unterlagen (Notion, Slack), kein Beleg für Regulatorik.
Baut auf der Engineering-Seite Digital Product Passport (Product Pixies, 16.11.2026) auf, die den Ist-Stand im Backend bereits geprüft hat. Dieses Dokument ergänzt Modulschnitt, UI-Konzept und Prototyp-Scope.
## Rechtsrahmen und Stand (24.11.2026)
Infrastruktur und Technik sind verbindlich, Produktinhalte für Textil und Möbel noch nicht. Für keine ESPR-Produktgruppe gilt heute eine DPP-Pflicht. Nach Annahme eines delegierten Rechtsakts gelten mindestens 18 Monate Übergangsfrist.
Baustein
 | Stand
 | Bedeutung für das Modul
 | Status / Quelle
 | 
ESPR (EU) 2024/1781
 | in Kraft seit 18.07.2024
 | Rahmen: Art. 9–15, Anhang III (Inhaltskategorien)
 | 🟢 JRC-Studie Textil, Kap. 2
 | 
EN 18216, 18219, 18220, 18221, 18222, 18223
 | im Amtsblatt zitiert, DB (EU) 2026/1736 vom 14.07.2026
 | Identifier, Datenträger, Austauschformat, Speicherung, API, Datenmodell sind festgelegt; Konformitätsvermutung für Art. 10/11
 | 🟢 Normtexte im Projekt; EUR-Lex
 | 
EN 18239 (Zugriffsrechte, Sicherheit)
 | als EN veröffentlicht (BSI 30.09.2026), noch nicht zitiert; Zitierung für Nov 2026 geplant
 | Rollenmodell vorbereiten, Details nachziehen
 | 🟡 BSI-Katalog, Kommissionsseite
 | 
EN 18246 (Authentizität, Integrität)
 | Entwurf
 | Signatur/Integrität vorerst offen
 | 🔴 kein Stand gefunden
 | 
EU-DPP-Registry, DVO (EU) 2026/1778
 | live seit 20.07.2026, in Kraft seit 06.08.2026
 | Registrierung vor Inverkehrbringen; Code Gaia ist im Testportal registriert (QSeal seit 30.10.2026)
 | 🟢 Kommission, EUR-Lex; intern Slack #rd-62-dpp
 | 
Registry-Upload
 | Formular oder JSON/XML-Datei, max. 100 DPPs je Datei; Batterie-Registrierung noch nicht möglich (semantischer Katalog fehlt)
 | Export-Format für den Prototyp festlegen; API-Weg nicht beschrieben
 | 🟢 Registry User Guide v1.03, 16.09.2026
 | 
Batteriepass (VO 2023/1542)
 | Pflicht ab 18.02.2027
 | nicht Zielbranche, aber einziger harter Stichtag
 | 🟢 Kommission
 | 
DA DPP-Dienstleister
 | geplant Q2 oder Q3 2027 (Kommissionsseite widersprüchlich); EU-Folien Juni 2026: Q1 2027
 | Anforderungen an Hosting/Back-up/Zertifizierung offen
 | 🟡 widersprüchliche Quellen
 | 
DA Textil (Bekleidung)
 | Annahme geplant Q4 2027 (Textilseite) bzw. Q3–Q4 2027 (Hauptseite)
 | Pflicht frühestens ca. 2029 (Interpretation: +18 Monate); Inhalt bis dahin nur JRC-Vorschlag vom 13.05.2026
 | 🟡 Kommission; JRC-Studie im Projekt
 | 
DA Möbel
 | Annahme geplant 2028; EU-Folie nennt „2029 Pflicht“
 | keine Inhaltsstudie gefunden, nur horizontale ESPR-Pflichten abbildbar
 | 🟡 widersprüchliche Angaben
 | 
Quellen-Konsistenz: Emidat-Benchmark (06.11.2026) und Narravero-Whitepaper (11/2026) nennen dieselben Daten für Registry, Normen und Batteriepass. Narravero gibt für Textil „ab 2029“, für Möbel „ab 2030“ an (indikativ).
## Was das Modul können muss
Elf Funktionen ergeben sich direkt aus ESPR, den sechs EN-Normen und der Registry. F1–F10 gehören in den Prototyp (teils simuliert), F11 nur als Architekturvorbereitung.
#
 | Funktion
 | Konkret
 | Quelle · Status
 | Prototyp
 | 
F1
 | Produktgruppen-Templates
 | Versionierte Feldkataloge: „ESPR horizontal“ (Anhang III) als Pflichtkern, „Textil Bekleidung (JRC-Entwurf 05/2026)“ als Zusatz, Möbel nur horizontal. Template-ID landet im Header-Feld contentSpecificationIds.
 | EN 18223 Tab. 1 🟢; JRC Kap. 7 🟡 (Entwurf)
 | Muss
 | 
F2
 | Identifier und Granularität
 | Eindeutige Produkt-ID als auflösbare URL (z. B. GS1 Digital Link auf GTIN-Basis); Ebene Modell, Charge oder Einzelstück; Ebene bleibt nach Inverkehrbringen fix, Wechsel nur per neuer, verknüpfter ID. Vererbung Einzelstück ← Charge ← Modell.
 | EN 18219 §4.3, §4.4, §5.2 🟢; Vererbungsmodell JRC §9.1 🟡
 | Muss
 | 
F3
 | Akteure und Standorte
 | Pflicht: economicOperatorId; optional facilityId. Hersteller, Importeur mit EORI, verantwortlicher EU-Akteur. ID-Schemata z. B. LEI, GLN, USt-ID.
 | EN 18223 Tab. 1, EN 18219 §6 🟢; JRC Tab. 6 🟡
 | Muss
 | 
F4
 | Befüllung aus Modulen mit Herkunft
 | Jedes Feld zeigt seine Quelle (Modul, Datensatz, Version, Nachweis). Vollständigkeitsprüfung vor Veröffentlichung: prüft Präsenz und Format, nicht Richtigkeit.
 | JRC UC1 🟡; intern Architekturprinzipien Notion
 | Muss
 | 
F5
 | Zugriffsebenen
 | Je Feld: öffentlich (ohne Login, ohne App), berechtigtes Interesse (z. B. Recycler), nur Behörden. Archivversionen erben die Rechte.
 | EN 18219 §4.6.2, EN 18221 §4.2 🟢; Ebenen JRC Tab. 14 🟡; EN 18239 Details offen
 | Muss (Rollen simuliert)
 | 
F6
 | Versionierung und Status
 | Veröffentlichen = eingefrorener Snapshot; jede Änderung archiviert mit Zeitstempel, Akteur, geänderten Feldern. Status active, inactive, archived, invalid. Pass bleibt über die Lebensdauer abrufbar.
 | EN 18223 §4.2, EN 18221 §4.1–4.2 🟢
 | Muss
 | 
F7
 | Ausgabeformate
 | JSON Pflicht; XML, JSON-LD optional per Content Negotiation. HTML-Ansicht barrierefrei (EN 301 549). Darstellung „compressed“ und „full“. Mehrsprachige Felder.
 | EN 18216 §5, EN 18222 §8.1, EN 18223 §4.1.2.8 🟢
 | Muss (JSON + HTML)
 | 
F8
 | Datenträger
 | QR-Code (ISO/IEC 18004) oder Data Matrix mit der Produkt-ID; 4 Module Ruhezone; optionaler IEC-61406-Rahmen (gefüllte Ecke = Modell, abgeschnittene Ecke = Charge/Stück). Lesbar ohne Zusatz-App. Textil: auch eingenaht/NFC möglich.
 | EN 18220 §5, §6, Anh. C 🟢
 | Muss (QR als SVG/PNG)
 | 
F9
 | API nach EN 18222
 | Pflicht: ReadDPPById, ReadDPPByProductId, ReadDPPIdsByProductIds. Empfohlen: Create, Update (PATCH), Delete, Version per Datum, einzelnes Datenelement per JSONPath. REST unter v1/dpps/{dppId}, HTTPS ab TLS 1.2, HTTP/2.
 | EN 18222 §4, §8; EN 18216 §4 🟢
 | Muss (Read-Endpunkte)
 | 
F10
 | Registry-Anbindung
 | Registrierungsdatensatz: Produkt-ID, DPP-ID, Akteur-ID, Back-up-Akteur-ID, API-Endpunkt. Heute: JSON/XML-Upload (schemaVersion, productGroup, items[]). Rückgabe-Registrierungs-ID speichern. Siegel (QSeal) bleibt beim Kunden.
 | EN 18222 Tab. 11 🟢; Registry User Guide v1.03 🟢; Template intern Slack 19.11.2026
 | Muss (Export + Mock-ID)
 | 
F11
 | Back-up und Persistenz
 | Kopie bei unabhängigem DPP-Dienstleister, Replikation jeder Änderung über die EN-18222-API, definierter RPO. Nach Marktaustritt des Akteurs allgemeiner Zugriff über das Back-up. Export ohne Lock-in.
 | EN 18221 §4.3, §4.5 🟢; ESPR Art. 10(4) 🟢 (laut EN 18221 Anh. ZA)
 | Nein, nur vorbereiten
 | 
Abgrenzung: Das Modul berechnet nichts selbst. Fußabdruck, Stoffe, Recyclingfähigkeit kommen aus PCF, Suppliers, PPWR oder späteren Modulen. Das hält den DPP-Code klein und erzwingt den gemeinsamen Datenkern (OKR 2).
## Zusammenspiel mit bestehenden Modulen
Der größte Hebel ist der vorhandene PPWR-Produktpass: öffentliche Seite, Feld-Allowlist und fester Link existieren schon. Er wird zum DPP-Ausgabekanal ausgebaut statt neu gebaut. Alle Angaben in dieser Tabelle: Quelle interne Unterlagen (Backend-Check Engineering 16.11.2026, Notion PPWR Deliverables, Slack-Changelog).
Modul
 | Was der DPP daraus liest
 | Lücke für den DPP
 | 
Products
 | Produkt und Kunden-ID, Gewicht, Maße, Stückliste (BOM-Import, Eltern-Kind-Struktur), Attribut-Framework mit Datentyp, Kontext, Pflicht je Rolle
 | keine GTIN, keine Charge/Seriennummer, kein CN/TARIC, keine Faserliste mit Anteilen, keine ESPR-Produktkategorie
 | 
PCF
 | kg CO2e je Produkt, Scope, Lebenszyklusphasen, Faktorquelle/-version/-region
 | keine PEFCR-Methode, keine Leistungsklasse, kein PEF-Single-Score (JRC-Textilvorschlag stützt sich darauf)
 | 
Suppliers
 | Lieferant mit Adresse, Land, Kontakt, Produktverknüpfung; Fragebögen an Lieferanten mit Review
 | keine Akteurs-ID (LEI/GLN/EORI), keine Standort-ID; Fragebögen sind PPWR-gebunden
 | 
PPWR
 | öffentlicher Produktpass (pass.codegaia.io/p/<product>/<passport>), Feld- und Datei-Freigabe je Assessment, DoC mit Nummer, Version, Freigabe; Stoffangaben
 | keine Versionsarchivierung, kein maschinenlesbares Format, keine Registry, nur eine öffentliche Ebene, Zufalls-ID statt Norm-ID, Link abschaltbar; Stoffe als Freitext ohne CAS/EC
 | 
Produktdateien (PP-204)
 | Assessment- und Komponenten-Dateien am Produkt
 | müssen als RelatedResource mit MIME-Typ, URL, Sprache und Titel ausgegeben werden (EN 18223 §4.1.2.7 🟢)
 | 
ERP-Anbindung (geplant)
 | perspektivisch GTIN, Chargen, Mengen
 | Build-vs-Buy offen; für den Prototyp per CSV simulieren
 | 
Regel für die Integration: Der DPP schreibt keine Fachdaten zurück. Fehlt ein Feld, zeigt der Editor die Quelle, in der es gepflegt werden muss („In Products ergänzen“, „Bei Lieferant anfragen“). So entsteht der Druck auf den gemeinsamen Kern, ohne Doppelpflege.
## Architektur und Datenmodell
Fachdaten bleiben in ihren Modulen; der DPP hält nur Template, Zuordnung und eingefrorene Versionen. Gestrichelt = erst nach dem Dienstleister-Rechtsakt.
Kernobjekte (Vorschlag, Interpretation der Normen):
Objekt
 | Felder
 | Grundlage
 | 
DPP-Template
 | ID, Version, Produktgruppe, Status (Entwurf/verbindlich), Feldliste mit Datentyp, Pflicht, Zugriffsebene, dictionaryReference, Quell-Mapping
 | EN 18223 §4.3 🟢; JRC Kap. 8 🟡
 | 
Produktpass
 | digitalProductPassportId (URL), uniqueProductIdentifier, granularity, dppSchemaVersion, dppStatus, lastUpdated, economicOperatorId, facilityId, contentSpecificationIds
 | EN 18223 Tab. 1 🟢
 | 
Pass-Version
 | Snapshot aller Datenelemente, Zeitstempel, Akteur, geänderte Felder, Vorgängerversion
 | EN 18223 §4.2, EN 18221 §4.2 🟢
 | 
Datenelement
 | elementId, Typ (Einzelwert, Liste, Sammlung, mehrsprachig, Ressource), Wert, Zugriffsebene, Quelle (Modul, Datensatz, Version)
 | EN 18223 §4.1.2 🟢; Quelle = intern
 | 
Registry-Eintrag
 | Produkt-ID, DPP-ID, Akteur-ID, Back-up-Akteur-ID, API-Endpunkt, Registrierungs-ID, Status
 | EN 18222 Tab. 11, §3.6 🟢
 | 
## Wie es aussehen sollte
Empfehlung: zwei Einstiege, sieben Ansichten. Das Modul sitzt im Bereich Product Compliance als „Produktpässe“ (Portfolio) und als Tab „Produktpass“ im Produktdetail, wo heute der PPWR-Pass liegt. Gestaltung nach dem Code-Gaia-Designsystem (intern).
Ansicht
 | Zweck
 | Kerninhalte
 | 
1. Portfolio
 | Wo stehen wir über alle Produkte?
 | Tabelle: Produkt, Template, Ebene (Modell/Charge/Stück), Bereitschaft in % Pflichtfelder, Status (Entwurf, veröffentlicht, registriert), letzte Version; Filter nach Produktgruppe
 | 
2. Pass-Editor
 | Pass befüllen und prüfen
 | Links Abschnitte des Templates (Identität, Akteure, Material, Stoffe, Umwelt, Konformität, Anleitungen). Mitte Felder mit Wert, Quellen-Badge (Products, PCF, Lieferant, PPWR, manuell), Zustand (vorhanden, fehlt, veraltet) und Zugriffs-Chip (Öffentlich, Berechtigt, Behörde). Rechts Vollständigkeit und Sprung zur Pflegestelle. Hinweisband bei Entwürfen: „Textil: JRC-Vorschlag, nicht rechtsverbindlich“
 | 
3. Rollen-Vorschau
 | Sehen, was wer sieht
 | Umschalter Verbraucher, Reparatur/Recycler, Behörde; rendert die öffentliche Seite je Rolle
 | 
4. Veröffentlichen
 | Snapshot erzeugen
 | Änderungen zur Vorversion, Versionsnotiz, Bestätigung; danach QR-Code mit Größe, Fehlerkorrektur, optionalem IEC-61406-Rahmen als SVG/PNG
 | 
5. Registry und Export
 | Registrierung vorbereiten
 | Auswahl bis 100 Pässe, Download JSON/XML im Registry-Format, Status je Pass, Feld für die zurückgegebene Registrierungs-ID, Fehlerliste
 | 
6. Versionen
 | Nachvollziehbarkeit
 | Zeitleiste der Versionen mit Akteur und geänderten Feldern; Ansicht „Stand am Datum X“
 | 
7. Öffentliche Passseite
 | Was am Produkt gescannt wird
 | Mobil zuerst. Oben groß der Produktname, darunter Kurzfakten (Material, Fußabdruck, Pflege). Aufklappbare Abschnitte, Sprachwahl, Dokumente zum Download. Knopf „Zugang für Fachleute“ für eingeschränkte Daten. Fußzeile: DPP-ID, Version, letzte Änderung, verantwortlicher Akteur
 | 
Der Produktname steht auf der öffentlichen Seite bewusst vor dem Dokumenttitel; das war internes Feedback zum ersten Pass-Entwurf (Slack #rd-62-dpp, 31.07.2026). Ein klickbares Mockup dieser Ansichten wäre der nächste sinnvolle Schritt vor dem Code.
## MVP-Scope für den Prototyp
Der Prototyp sollte einen durchgängigen Weg zeigen, nicht viele Felder: Produkt wählen → Pass aus Moduldaten befüllen → Lücken sehen → veröffentlichen → QR scannen → JSON per API abrufen → Registry-Datei exportieren. Das deckt sich mit dem Whitepaper-Hinweis, dass der kritische Pfad über Daten und Prozess läuft, nicht über die Darstellung.
Demo-Produkte
T-Shirt (Textil): Template „ESPR horizontal + Textil JRC-Entwurf“, Ebene Charge, GTIN vorhanden, Faserzusammensetzung, Pflegehinweise, PCF-Wert. Zeigt Vererbung Modell → Charge. Engineering hat bereits eine Dummy-Seite für ein T-Shirt gegen die Test-Registry geprüft (Slack 19.11.2026).
Sessel (Möbel): nur Template „ESPR horizontal“, Ebene Modell. Zeigt bewusst, dass Möbel-Inhalte noch fehlen und das Template später nachgeladen wird.
Baustein
 | Prototyp
 | Begründung
 | 
Templates F1 als JSON-Dateien
 | bauen
 | Kern der Idee „konfigurierbar statt hart codiert“
 | 
Moduldaten (Products, PCF, Suppliers, PPWR)
 | mocken (Seed-Daten mit Quellenangabe)
 | Kein Zugriff aufs Backend nötig; Quellen-Badges trotzdem echt darstellbar
 | 
Pass-Header und Datenelemente nach EN 18223
 | bauen
 | Liefert direkt die JSON-Struktur fürs Engineering
 | 
Versionierung und Status F6
 | bauen (einfach: Snapshot-Liste)
 | Wichtigster Unterschied zum heutigen PPWR-Pass
 | 
Zugriffsebenen F5
 | bauen als Rollen-Umschalter, Auth simulieren
 | EN 18239 noch nicht zitiert
 | 
QR-Code F8
 | bauen (Bibliothek)
 | sichtbarer Demo-Effekt, normnah
 | 
API F9
 | Read-Endpunkte bauen
 | zeigt EN-18222-Pfade, für Engineering wiederverwendbar
 | 
Registry F10
 | JSON/XML-Export bauen, Registrierungs-ID mocken
 | echte Registrierung für Textil noch nicht möglich
 | 
Back-up F11, Signatur, ERP
 | weglassen, nur im README als offen markieren
 | Rechtsakt bzw. EN 18246 fehlen
 | 
Abnahme für den Prototyp: (1) JSON eines Passes validiert gegen die Header-Felder aus EN 18223 Tab. 1. (2) QR-Code öffnet die öffentliche Seite ohne Login. (3) Eine Änderung erzeugt Version 2, Version 1 bleibt abrufbar. (4) Rollen-Vorschau blendet eingeschränkte Felder aus. (5) Export-Datei hat das Registry-Format mit bis zu 100 Einträgen.
## Sparring: geprüfte Annahmen
Die Richtung „DPP als Ausgabe des gemeinsamen Kerns“ trägt. Zwei Annahmen tragen nicht oder nur teilweise: die DPP-EPD-Brücke für Textil/Möbel und ein früher Einstieg als zertifizierter DPP-Dienstleister.
Annahme
 | Befund
 | Status
 | 
DPP und EPD haben gemeinsame Nenner, daher Möbel und Textil
 | EPD nach EN 15804 ist Treiber bei Bauprodukten (CPR), laut Emidat-Benchmark. Der JRC-Textilvorschlag stützt den Fußabdruck auf PEFCR, nicht auf EPD. Für Möbel fand ich keine Inhaltsstudie. Gemeinsamer Nenner ist eher PCF → PEF als EPD.
 | 🟡 Textil nicht gestützt, Möbel 🔴
 | 
Der PPWR-Pass ist die Basis
 | Allowlist, öffentliche Seite und fester Link sind wiederverwendbar. Abschaltbarer Link, fehlende Versionen und fehlendes JSON widersprechen EN 18221 §4.1–4.2.
 | 🟢 Normen; Ist-Stand intern
 | 
Wir werden zertifizierter DPP-Dienstleister
 | Rechtsakt und Zertifizierung fehlen, Termin widersprüchlich (Q1–Q3 2027). Back-up-Pflicht schafft einen Markt, aber mit Haftung über die Kundenbeziehung hinaus.
 | 🔴 Anforderungen unbekannt
 | 
Jetzt bauen lohnt sich
 | Pflicht frühestens ca. 2029 (Textil) bzw. 2030 (Möbel). Kunden kaufen heute Vorbereitung; Anfragen aus Mode liegen vor (TROT, Chaps Merchandising, intern).
 | 🟡 Interpretation
 | 
JRC-Felder sind die Textil-Pflichtfelder
 | Die Studie sagt selbst, dass Konsultation und Folgenabschätzung noch ausstehen.
 | 🟢 JRC Kap. 1, 3.1
 | 
Risiken: EN 18239 und EN 18246 können Zugriffsmodell und Signatur verändern. Die Registry-Validierung nutzt je Produktgruppe einen semantischen Katalog, der Feldnamen vorgeben kann; der Prototyp sollte dictionaryReference je Feld vorsehen. Einzelstück-IDs sind laut JRC der größte Kostentreiber; Charge als Standard ist sicherer.
Empfehlung: Erst als Software für den Wirtschaftsakteur bauen (Pass erstellen, ausliefern, registrieren), Dienstleister-Rolle erst nach dem Rechtsakt entscheiden. Das entspricht der internen Linie vom 21.09.2026 (Slack). PEF-Felder jetzt im Datenmodell vorsehen, wie in OKR 1 geplant.
Was müsste wahr sein, damit das kippt? Ein Bestandskunde braucht vor 18.02.2027 einen Batteriepass (dann Partner statt Eigenbau), oder der Dienstleister-Rechtsakt verlangt Hosting durch zertifizierte Dritte für den Hauptpass (dann wäre die Rolle Pflicht, nicht Option).
Nächste Validierung: Legal zur Back-up-Pflicht und Haftung; Kundengespräch mit einem Textil-Lead zu Ebene (Modell vs. Charge) und vorhandenen GTINs; Engineering prüft das Registry-Upload-Format mit einer Textil-Kategorie, sobald freigeschaltet.
## Nicht belegt / offen
🔴 Inhalt und Termin des Rechtsakts für DPP-Dienstleister (Zertifizierung, Unabhängigkeit, Insolvenzregeln).
🔴 EN 18246 (Authentizität): kein Veröffentlichungsstand gefunden. EN 18239: Inhalt nicht gelesen, Zitierung im Amtsblatt nicht bestätigt.
🔴 Inhaltliche DPP-Felder für Möbel: keine Studie, kein Entwurf gefunden.
🟡 Registry-API für System-zu-System-Registrierung: im User Guide nur erwähnt, nicht beschrieben.
🟡 ESPR-Artikel habe ich nicht direkt auf EUR-Lex lesen können (Seite lieferte keinen Text); Verweise stammen aus JRC-Studie, Normen-Anhang ZA und Engineering-Seite. Legal sollte bindende Auslegungen bestätigen.
🟡 Aufbewahrungsdauer: JRC nennt mindestens 10 Jahre, sofern der Rechtsakt nichts anderes regelt; nicht gegen ESPR-Text geprüft.
## Quellen
Projektdateien (DPP Navigator): DIN EN 18216, 18219, 18220, 18221, 18222, 18223 (alle 2026-09, Download 07.10.2026); JRC „Study on DPP content for textile apparel products under ESPR“ (13.05.2026), Kap. 2, 7, 9.
Anhänge: Emidat – Benchmark, Marktkontext EPD/DPP (06.11.2026), Abschn. C; Narravero „Digitalen Produktpass im Unternehmen einführen“ (11/2026), Kap. 3–5, 9.
Primärquellen web (abgerufen 24.11.2026):
Kommission: Digital Product Passport
Kommission: Textile Apparel and the DPP
DVO (EU) 2026/1778 Registry
DB (EU) 2026/1736 harmonisierte Normen
DPP Registry User Guide for Economic Operators v1.03
Sekundärquellen (nur Hinweis): BSI-Katalog EN 18239; Kommissionsfolien Juni 2026 (Handelsministerium Türkei).
Interne Unterlagen: Engineering-Seite Digital Product Passport (16.11.2026); Product Compliance: PCF, PPWR, DPP (24.11.2026); PPWR Deliverable Product Passport; Slack #rd-62-dpp und #prod-5-changelog (bis 20.11.2026). Datenpunkt-Mapping Stand 09.11.2026.
