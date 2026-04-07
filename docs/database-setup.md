
# Anleitung: Datenbank-Einrichtung für Blubber Baron

Diese Anleitung führt Sie durch die Erstellung der MySQL-Datenbank, die für den Betrieb des Shops mit einem eigenen Backend erforderlich ist.

## 1. MySQL installieren & starten
Stellen Sie sicher, dass MySQL auf Ihrem System installiert ist (z.B. via XAMPP, Docker oder direkte Installation).

## 2. Datenbank erstellen
Nutzen Sie ein Tool Ihrer Wahl (MySQL Workbench, phpMyAdmin oder das Terminal), um das Schema zu importieren.

### Via Terminal:
```bash
mysql -u root -p < docs/mysql-schema.sql
```

## 3. Struktur-Übersicht (Relational)
Um die Arrays aus der ursprünglichen Firebase-Struktur abzubilden, nutzen wir Fremdschlüssel:
- **Bilder:** Ein Produkt hat mehrere Einträge in `product_images`.
- **Besonderheiten:** Merkmale werden in `product_features` gespeichert.
- **Anforderungen:** Job-Anforderungen liegen in `job_requirements`.

## 4. Verbindung zum Spring Boot Backend
Stellen Sie in Ihrer `application.properties` (oder `application.yml`) des Backends sicher, dass die Zugangsdaten korrekt sind:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/blubber_baron?serverTimezone=UTC
spring.datasource.username=DEIN_NUTZERNAME
spring.datasource.password=DEIN_PASSWORT
spring.jpa.hibernate.ddl-auto=validate
```

## 5. Wichtiger Hinweis zum Datenformat
Das Frontend sendet Bilder und Lebensläufe als **Base64-Strings**. 
- Das Feld `resume_data` in `job_applications` ist als `LONGTEXT` definiert, um diese Datenmengen aufzunehmen.
- Bilder in `product_images` werden ebenfalls als TEXT (Base64) oder URLs gespeichert.
