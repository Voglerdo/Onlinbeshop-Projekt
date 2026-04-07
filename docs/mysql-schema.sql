
-- Blubber Baron - Imperiales Datenbank-Schema (MySQL)
-- Dieses Script erstellt die notwendigen Tabellen für den Luxus-Shop.

CREATE DATABASE IF NOT EXISTS blubber_baron;
USE blubber_baron;

-- 1. Tabelle: Nutzer (Das Register)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(255) PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255) UNIQUE NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Tabelle: Produkte (Die Schatzkammer)
CREATE TABLE IF NOT EXISTS products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50),
    brand VARCHAR(100) DEFAULT 'Blubber Baron',
    stock_quantity INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. Tabelle: Produkt-Bilder (Galerie)
CREATE TABLE IF NOT EXISTS product_images (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT,
    image_url TEXT NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- 4. Tabelle: Produkt-Features (Besonderheiten)
CREATE TABLE IF NOT EXISTS product_features (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT,
    feature_text VARCHAR(255) NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- 5. Tabelle: Bewertungen (Der Konsens)
CREATE TABLE IF NOT EXISTS reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT,
    user_id VARCHAR(255),
    user_name VARCHAR(255),
    rating TINYINT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 6. Tabelle: Stellenangebote (Karriere-Register)
CREATE TABLE IF NOT EXISTS job_offers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    department VARCHAR(100),
    location VARCHAR(100),
    type ENUM('Full-time', 'Part-time', 'Contract') DEFAULT 'Full-time',
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 7. Tabelle: Job-Anforderungen
CREATE TABLE IF NOT EXISTS job_requirements (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    job_offer_id BIGINT,
    requirement VARCHAR(255) NOT NULL,
    FOREIGN KEY (job_offer_id) REFERENCES job_offers(id) ON DELETE CASCADE
);

-- 8. Tabelle: Bewerbungen
CREATE TABLE IF NOT EXISTS job_applications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    job_id BIGINT,
    job_title VARCHAR(255),
    applicant_name VARCHAR(255) NOT NULL,
    applicant_email VARCHAR(255) NOT NULL,
    message TEXT,
    resume_data LONGTEXT, -- Base64 encoded file
    status ENUM('Pending', 'Reviewed', 'Accepted', 'Rejected') DEFAULT 'Pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES job_offers(id) ON DELETE SET NULL
);

-- 9. Tabelle: Bestellungen (Transaktions-Chronik)
CREATE TABLE IF NOT EXISTS orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(255),
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Ausstehend',
    shipping_address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 10. Tabelle: Bestell-Posten
CREATE TABLE IF NOT EXISTS order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT,
    product_id BIGINT,
    product_name VARCHAR(255),
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);
