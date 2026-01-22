CLAUDE.md
Projekt-Übersicht
Dieses Projekt ist ein Frontend-Client, der mit Astro und Svelte entwickelt wird. Das Ziel ist eine vollständige Abdeckung aller Backend-Routen und Antwort-Szenarien bei gleichzeitigem Verzicht auf komplexes Design.

Build und Entwicklung
Entwicklungsserver: npm run dev

Produktions-Build: npm run build

Vorschau: npm run preview

Linting: npm run lint

Technologie-Stack
Framework: Astro (Routing und statische Komponenten)

Interaktivität: Svelte (Zustandsmanagement und dynamische UI)

Styling: Natives CSS (CSS Variablen, Flexbox, Grid)

Design-Richtlinien
Farbpalette
Die folgenden Farben sind als CSS-Variablen in der globalen CSS-Datei zu definieren:

Hintergrund: #F8FAFC (Hellgrau)

Text: #1E293B (Dunkles Schieferblau)

Primär: #334155 (Gedecktes Blau-Grau)

Sekundär: #94A3B8 (Mittleres Grau)

Akzent: #020617 (Tiefschwarz für Kontraste)

Layout-Prinzipien
Kein Einsatz von KI-generierten CSS-Frameworks oder komplexen Utility-Klassen.

Einfache, semantische HTML-Struktur.

Responsive Layouts via Flexbox und CSS Grid.

Keine Emojis in der Benutzeroberfläche oder Dokumentation.

Routing- und Backend-Logik
Szenario-Abdeckung
Jede Route des Backends muss im Frontend repräsentiert sein. Für jede API-Antwort muss ein entsprechender Zustand existieren:

Erfolg (200 OK): Vollständige Datenanzeige.

Ladevorgang: Explizite Ladeansicht während des Fetch-Vorgangs.

Fehler (4xx, 5xx): Klare Fehlermeldungen pro Szenario (z.B. Nicht gefunden, Serverfehler).

Leere Daten: Ansicht für den Fall, dass die Liste oder das Objekt leer ist.

Struktur
Astro-Files (.astro) für statische Routen und das Grundgerüst.

Svelte-Komponenten (.svelte) für alle Bereiche, die Daten vom Backend laden oder Interaktionen erfordern.

Code-Standards
Verwendung von TypeScript für Typsicherheit bei API-Antworten.

Komponenten-Logik strikt von der Darstellung trennen.

CSS wird lokal in der Komponente oder in einer zentralen Datei ohne komplexe Schachtelung geschrieben.