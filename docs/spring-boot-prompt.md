# Spring Boot Backend Prompt für Blubber Baron

Kopiere den folgenden Text in Gemini oder ChatGPT, um das passende Backend für dieses Frontend zu generieren.

---

## Der Prompt

**Rolle:** Handle als Senior Java Entwickler.
**Aufgabe:** Generiere ein Spring Boot 3.x Backend mit Java 17 und MySQL für einen Luxus-E-Commerce-Shop namens "Blubber Baron".

**Technische Anforderungen:**
1. **Architektur:** Controller-Service-Repository Pattern.
2. **Datenbank:** MySQL (Nutze JPA/Hibernate).
3. **CORS:** Aktiviere CORS für `http://localhost:9002` (Frontend-Port).

**Entitäten & Datenstrukturen (basierend auf dem TypeScript Frontend):**

- **Product:** 
  - Felder: id (Long/UUID), name (String), description (Text), price (BigDecimal), category (String), brand (String), stockQuantity (Integer).
  - Beziehungen: 
    - List<ProductImage> (image_url)
    - List<ProductFeature> (feature_text)

- **User / Profile:**
  - Felder: id (String/UUID), firstName (String), lastName (String), email (String), isAdmin (Boolean).

- **Order:**
  - Felder: id (Long/UUID), totalAmount (BigDecimal), status (String), shippingAddress (Text), createdAt (Timestamp).
  - Beziehungen: 
    - ManyToOne zu User
    - OneToMany zu OrderItem (productId, name, quantity, price)

- **JobOffer:**
  - Felder: id (Long/UUID), title (String), department (String), location (String), type (Enum: Full-time, Part-time, Contract), description (Text).
  - Beziehungen: 
    - List<String> requirements

- **JobApplication:**
  - Felder: id (Long/UUID), jobId (Long), applicantName (String), applicantEmail (String), message (Text), resumeData (LongText/Base64), status (Enum), createdAt.

- **Review:**
  - Felder: id (Long/UUID), rating (Integer 1-5), comment (Text), createdAt.
  - Beziehungen: ManyToOne zu Product, ManyToOne zu User.

**Benötigte Endpunkte (API_BASE: /api):**

- **Produkte:** `GET /products`, `GET /products/{id}`, `POST /products`, `DELETE /products/{id}`
- **Bestellungen:** `POST /orders`, `GET /users/{userId}/orders`
- **Karriere:** `GET /jobs`, `POST /jobs`, `DELETE /jobs/{id}`, `POST /applications`
- **Bewertungen:** `GET /products/{productId}/reviews`, `POST /reviews`
- **Profil:** `GET /users/{id}`, `PUT /users/{id}`

**Ausgabe-Format:**
Bitte gib mir den Code für die Haupt-Entitäten, die Repositories, die Controller und eine `application.properties` Konfiguration für MySQL. Nutze Lombok für Getter/Setter.