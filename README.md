# Blubber Baron - Imperialer Shisha Shop

Dieses Projekt ist ein High-End E-Commerce Prototyp für Luxus-Shishas, gebaut mit Next.js, Firebase und Google Genkit.

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

### 3. Künstliche Intelligenz (Genkit)
Die App nutzt Google Genkit für generative Features:
- **Imagen 4:** Erstellung von Premium-Produktfotografien.
- **Gemini 2.5:** Generierung von Verkaufs-Narrativen und Text-to-Speech (TTS) für die Marken-Philosophie.
- **Flows:** Server-Side Logik für KI-Workflows in `src/ai/flows/`.

### 4. Datenmodell (Relationaler Entwurf)
Die App ist darauf vorbereitet, auf ein SQL-Schema (MySQL) umgestellt zu werden:
- `users`: Barone und Personal.
- `products`: Der Luxuskatalog inkl. `product_images` Galerie.
- `orders` & `order_items`: Transaktionshistorie.
- `reviews`: Das Konsens-Archiv der Kunden.
- `jobs` & `applications`: Das Karriereportal.

## Entwicklung

Um den Entwicklungsserver zu starten:
```bash
npm run dev
```

Um die Genkit UI für KI-Tests zu starten:
```bash
npm run genkit:dev
```
