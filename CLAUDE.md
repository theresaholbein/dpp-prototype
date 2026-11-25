# CLAUDE.md – DPP-Prototyp Code Gaia

Lies diese Datei und SPEC.md zu Beginn jeder Session.

## Worum es geht

Ein klickbarer MVP des Digitalen Produktpasses (DPP) für die Code-Gaia-App. Er soll zeigen, wie schnell so etwas mit KI entsteht, und dem Engineering-Team als Vorlage dienen (Datenmodell, API, UI). Gebaut wird **nur das DPP-Feature**. Alles Weitere steht in SPEC.md.

## Regeln

1. **Ein SPEC-Schritt pro Session.** Die Schritte stehen in SPEC.md §11. Erst planen, auf OK warten, dann bauen.
2. **Nur DPP bauen.** Alle anderen Module sind sichtbar wie in der echten App (Sidebar, Kopfzeile, Platzhalterseite), haben aber keine Inhalte, Daten oder Logik.
3. **Design ausschließlich nach**
   - `docs/design-bible/DESIGN-BIBLE.md` (Code Gaia Design Bible; falls der Skill `code-gaia-design-bible` geladen ist, gilt er gleichermaßen)
   - `docs/design-system/` (Tokens, Schrift DM Sans, Komponenten)
   - `docs/reference/` (Screenshots der echten App) für Aufbau, Abstände und Muster.
   Keine eigenen Farben, Schriften, Radien oder Schatten. Kein Wert, der nicht aus `tokens.css` kommt. Bei Widerspruch: Design Bible vor Design System vor Mockup.
4. **Das Mockup in `docs/prototype/` zeigt Inhalte und Abläufe**, nicht das verbindliche Aussehen. Wo es von den Screenshots oder der Design Bible abweicht, gelten diese.
5. **Keine Rechtsaussagen erfinden.** Artikel, Normabschnitte, Fristen und Pflichtfelder nur aus SPEC.md übernehmen. Neue rechtliche Aussagen nicht ergänzen, sondern als offene Frage notieren.
6. **Nur Demo-Daten.** Keine echten Kunden, Firmen, Kennzahlen oder Personen. Keine Secrets im Code oder Chat; `.env.local` pflegt die Nutzerin selbst.
7. **UI-Sprache Deutsch**, Satzanfang groß, keine Großbuchstaben-Labels (Design Bible K).
8. **Nach jedem Schritt:** `npm run lint` und `npm run build` grün, dann committen mit aussagekräftiger Nachricht.
9. **Komponenten-Leiter (Design Bible L):** Braucht es das? Gibt es das im Design System? Kann eine installierte Abhängigkeit es? Erst dann selbst bauen, minimal.
10. **Fragen statt raten.** Wenn SPEC.md etwas offen lässt, frag nach, statt eine Annahme still einzubauen.
