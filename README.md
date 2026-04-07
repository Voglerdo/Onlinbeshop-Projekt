
# Blubber Baron - Imperialer Shisha Shop

Dieses Projekt ist ein High-End E-Commerce Prototyp für Luxus-Shishas, gebaut mit Next.js 15. Die Anwendung ist vollständig auf eine **REST-API Architektur** vorbereitet.

## Systemarchitektur

### 1. Frontend & UI
- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS mit einem "Onyx & Antique Gold" Theme.
- **Komponenten:** ShadCN UI für konsistente, luxuriöse interaktive Elemente.
- **Warenkorb:** React-Context basierter Provider.

### 2. Backend-Anbindung (REST API)
Die App kommuniziert über den `externalApiService` (`src/services/api-client.ts`) mit einem externen Backend.
- **Umgebungsvariable:** Setze `NEXT_PUBLIC_API_URL` in deiner `.env` auf dein Backend (z.B. `http://localhost:8080/api`).
- **Backend-Generator:** Ein Prompt für Gemini/ChatGPT zur Erstellung des Spring Boot Backends liegt in `docs/spring-boot-prompt.md`.

### 3. Datenbank (MySQL)
Für den produktiven Einsatz ist ein MySQL-Schema vorbereitet:
- **Schema-Datei:** `docs/mysql-schema.sql`
- **Setup-Anleitung:** `docs/database-setup.md`

## Entwicklung

1. Klone das Repository.
2. Installiere die Abhängigkeiten: `npm install`.
3. Starte den Entwicklungsserver: `npm run dev`.
4. (Optional) Starte dein Spring Boot Backend und verbinde es über die `.env`.

## Features
- **Luxuskatalog:** Durchstöbere kuratierte Wasserpfeifen und Zubehör.
- **Karriereportal:** Bewirb dich für den Rat des Barons.
- **Admin-Konsole:** Verwalte das Inventar und die Bewerbungen (Login via Profil-Seite simulieren).
