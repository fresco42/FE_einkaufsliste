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
