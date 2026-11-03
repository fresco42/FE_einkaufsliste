# Einkaufsliste Frontend

Web-Oberfläche für die Einkaufsliste, gebaut mit Astro und Svelte 5. Sie spricht mit der Einkaufsliste API (Express + MySQL) und deckt Registrierung, Login, Listen und Items ab.

## Setup

Voraussetzungen: Node.js 20 oder neuer und ein laufendes Backend.

```bash
npm install
cp .env.example .env   # PUBLIC_API_URL auf das Backend zeigen lassen
npm run dev
```

Die App läuft dann auf `http://localhost:4321`.

## Umgebungsvariablen

| Datei | Wird genutzt von | Inhalt |
| --- | --- | --- |
| `.env` | `npm run build`, `npm run preview` | `PUBLIC_API_URL` des deployten Backends |
| `.env.development` | `npm run dev` | `PUBLIC_API_URL=http://localhost:3000` (lokales Backend) |

Im Dev-Modus überschreibt `.env.development` die Werte aus `.env`. Beide Dateien sind nicht im Git. Nach einer Änderung muss der Dev-Server neu gestartet werden.

## Lokal mit Backend starten

Die Datenbank läuft im Backend-Projekt als MySQL-Container. Die Daten liegen im Docker-Volume `einkaufsliste-db`.

1. Datenbank starten (im Backend-Ordner): `docker compose up -d`
2. Backend starten (im Backend-Ordner): `npm start`, läuft auf `http://localhost:3000`
3. Frontend starten (hier): `npm run dev`

Die Daten bleiben beim Stoppen erhalten. Nur `docker compose down -v` löscht das Volume und damit alle Daten.

## Skripte

| Befehl | Beschreibung |
| --- | --- |
| `npm run dev` | Entwicklungsserver |
| `npm run build` | Produktions-Build nach `dist/` (Node-Adapter, standalone) |
| `npm run preview` | Build lokal ansehen |
| `npm run lint` | Typprüfung mit `astro check` |

## Seiten

| Pfad | Inhalt |
| --- | --- |
| `/` | Login |
| `/register` | Registrierung |
| `/lists` | Übersicht der eigenen Listen |
| `/lists/:id` | Items einer Liste |

## Projektstruktur

```
src/
  components/   Svelte-Komponenten (Formulare, Listen, Navigation)
  layouts/      Astro-Layout
  lib/          API-Client und Auth-Store
  pages/        Routen
  styles/       Globales CSS
  types/        API-Typen
```
