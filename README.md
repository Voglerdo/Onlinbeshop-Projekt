
# Blubber Baron - REST Architecture Edition

Dieser Shop ist vollständig von Firebase entkoppelt und nutzt eine **REST-API Architektur** mit MySQL.

## Umzug auf eigenes Backend

### 1. MySQL Datenbank
- Nutze das Script in `docs/mysql-schema.sql`, um die Struktur anzulegen.
- Eine detaillierte Anleitung findest du in `docs/database-setup.md`.

### 2. Spring Boot Backend
- Nutze den Prompt in `docs/spring-boot-prompt.md`, um dein Backend mit Gemini/ChatGPT generieren zu lassen.
- Stelle sicher, dass dein Backend auf Port 8080 läuft.

### 3. Frontend Konfiguration
- Ändere die `NEXT_PUBLIC_API_URL` in deiner `.env` Datei auf die URL deines Backends (z.B. `http://localhost:8080/api`).

## Entwicklung
1. `npm install`
2. `npm run dev`

Die App nutzt nun den `AuthContext` (`src/context/AuthContext.tsx`) zur lokalen Sitzungsverwaltung, bis dein Backend die Authentifizierung übernimmt.
