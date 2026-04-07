
# Blubber Baron - Imperialer Shisha Shop

Dieses Projekt ist ein High-End E-Commerce Prototyp für Luxus-Shishas, gebaut mit Next.js, Firebase und einem dualen REST-Backend-Ansatz.

## Systemarchitektur

### 1. Frontend & UI
- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS mit einem "Onyx & Antique Gold" Theme.
- **Komponenten:** ShadCN UI für konsistente, luxuriöse interaktive Elemente.
- **Warenkorb:** Ein React-Context basierter Provider verwaltet die Auswahl des Kunden.

### 2. Daten & Backend
- **Primär-Datenbank:** Firebase Firestore für Echtzeit-Synchronisation.
- **REST-API Schicht:** Ein dedizierter Service (`src/services/api-client.ts`) ermöglicht die parallele Anbindung an ein externes REST-Backend (z.B. Spring Boot).
- **Authentifizierung:** Firebase Auth für anonyme Barone und administratives Personal.

### 3. Datenbank-Verwaltung (Firebase Console)
Um deine Daten (Produkte, Bestellungen, Reviews) live zu sehen oder zu bearbeiten, besuche die Firebase Console:

- **Projekt-URL:** [https://console.firebase.google.com/project/studio-5861391911-8fffa/firestore](https://console.firebase.google.com/project/studio-5861391911-8fffa/firestore)
- **Struktur:**
  - `products`: Der Luxuskatalog.
  - `users/{uid}/orders`: Bestellhistorie der Kunden.
  - `jobs`: Aktuelle Stellenausschreibungen.
  - `roles_admin`: Verwaltung der Admin-Berechtigungen.

## Entwicklung

Um den Entwicklungsserver zu starten:
```bash
npm run dev
```
