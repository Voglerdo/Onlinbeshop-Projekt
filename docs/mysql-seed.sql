USE blubber_baron;

INSERT INTO products (name, description, price, category, image_url, image_hint, brand, stock_quantity, created_at, updated_at)
SELECT * FROM (
    SELECT
        'Crimson Premium Hookah',
        'A masterpiece of design and performance, featuring high-grade stainless steel and a crimson-tinted crystal base.',
        249.99,
        'hookah',
        'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=900&q=80',
        'premium hookah',
        'Blubber Baron',
        12,
        NOW(),
        NOW()
) AS seed
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Crimson Premium Hookah');

INSERT INTO products (name, description, price, category, image_url, image_hint, brand, stock_quantity, created_at, updated_at)
SELECT * FROM (
    SELECT
        'Golden Ember Coal',
        'Long-lasting, low-ash coconut charcoal for the purest smoking experience.',
        19.99,
        'coal',
        'https://images.unsplash.com/photo-1515442261605-65987783cb6a?auto=format&fit=crop&w=900&q=80',
        'shisha charcoal',
        'Blubber Baron',
        64,
        NOW(),
        NOW()
) AS seed
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Golden Ember Coal');

INSERT INTO products (name, description, price, category, image_url, image_hint, brand, stock_quantity, created_at, updated_at)
SELECT * FROM (
    SELECT
        'Ruby Mist Tobacco',
        'A sophisticated blend of dark berries and a hint of cooling menthol.',
        24.50,
        'flavor',
        'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=900&q=80',
        'shisha flavor',
        'Blubber Baron',
        48,
        NOW(),
        NOW()
) AS seed
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Ruby Mist Tobacco');

INSERT INTO products (name, description, price, category, image_url, image_hint, brand, stock_quantity, created_at, updated_at)
SELECT * FROM (
    SELECT
        'Obsidian Glass Base',
        'A stunning replacement base crafted from thick obsidian-style glass with gold accents.',
        85.00,
        'accessory',
        'https://images.unsplash.com/photo-1507915135761-41a0a222c709?auto=format&fit=crop&w=900&q=80',
        'hookah glass',
        'Blubber Baron',
        20,
        NOW(),
        NOW()
) AS seed
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Obsidian Glass Base');

INSERT INTO product_images (product_id, display_order, image_url)
SELECT p.id, 0, p.image_url
FROM products p
WHERE NOT EXISTS (
    SELECT 1 FROM product_images pi WHERE pi.product_id = p.id AND pi.display_order = 0
);

INSERT INTO product_images (product_id, display_order, image_url)
SELECT p.id, 1, 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=900&q=80'
FROM products p
WHERE p.name = 'Crimson Premium Hookah'
  AND NOT EXISTS (
      SELECT 1 FROM product_images pi WHERE pi.product_id = p.id AND pi.display_order = 1
  );

INSERT INTO product_features (product_id, display_order, feature_text)
SELECT p.id, 0, 'Stainless Steel Construction'
FROM products p
WHERE p.name = 'Crimson Premium Hookah'
  AND NOT EXISTS (
      SELECT 1 FROM product_features pf WHERE pf.product_id = p.id AND pf.display_order = 0
  );

INSERT INTO product_features (product_id, display_order, feature_text)
SELECT p.id, 1, 'Crystal Base'
FROM products p
WHERE p.name = 'Crimson Premium Hookah'
  AND NOT EXISTS (
      SELECT 1 FROM product_features pf WHERE pf.product_id = p.id AND pf.display_order = 1
  );

INSERT INTO product_features (product_id, display_order, feature_text)
SELECT p.id, 2, 'Quiet Diffuser'
FROM products p
WHERE p.name = 'Crimson Premium Hookah'
  AND NOT EXISTS (
      SELECT 1 FROM product_features pf WHERE pf.product_id = p.id AND pf.display_order = 2
  );

INSERT INTO product_features (product_id, display_order, feature_text)
SELECT p.id, 0, '100% Coconut'
FROM products p
WHERE p.name = 'Golden Ember Coal'
  AND NOT EXISTS (
      SELECT 1 FROM product_features pf WHERE pf.product_id = p.id AND pf.display_order = 0
  );

INSERT INTO product_features (product_id, display_order, feature_text)
SELECT p.id, 1, '90 Min Burn Time'
FROM products p
WHERE p.name = 'Golden Ember Coal'
  AND NOT EXISTS (
      SELECT 1 FROM product_features pf WHERE pf.product_id = p.id AND pf.display_order = 1
  );

INSERT INTO product_features (product_id, display_order, feature_text)
SELECT p.id, 2, 'Low Ash Content'
FROM products p
WHERE p.name = 'Golden Ember Coal'
  AND NOT EXISTS (
      SELECT 1 FROM product_features pf WHERE pf.product_id = p.id AND pf.display_order = 2
  );

INSERT INTO product_features (product_id, display_order, feature_text)
SELECT p.id, 0, 'Premium Virginia Leaf'
FROM products p
WHERE p.name = 'Ruby Mist Tobacco'
  AND NOT EXISTS (
      SELECT 1 FROM product_features pf WHERE pf.product_id = p.id AND pf.display_order = 0
  );

INSERT INTO product_features (product_id, display_order, feature_text)
SELECT p.id, 1, 'Natural Flavoring'
FROM products p
WHERE p.name = 'Ruby Mist Tobacco'
  AND NOT EXISTS (
      SELECT 1 FROM product_features pf WHERE pf.product_id = p.id AND pf.display_order = 1
  );

INSERT INTO product_features (product_id, display_order, feature_text)
SELECT p.id, 2, 'Dense Smoke'
FROM products p
WHERE p.name = 'Ruby Mist Tobacco'
  AND NOT EXISTS (
      SELECT 1 FROM product_features pf WHERE pf.product_id = p.id AND pf.display_order = 2
  );

INSERT INTO product_features (product_id, display_order, feature_text)
SELECT p.id, 0, 'Hand-blown'
FROM products p
WHERE p.name = 'Obsidian Glass Base'
  AND NOT EXISTS (
      SELECT 1 FROM product_features pf WHERE pf.product_id = p.id AND pf.display_order = 0
  );

INSERT INTO product_features (product_id, display_order, feature_text)
SELECT p.id, 1, 'Heavy Base'
FROM products p
WHERE p.name = 'Obsidian Glass Base'
  AND NOT EXISTS (
      SELECT 1 FROM product_features pf WHERE pf.product_id = p.id AND pf.display_order = 1
  );

INSERT INTO product_features (product_id, display_order, feature_text)
SELECT p.id, 2, 'Gold Rim Detail'
FROM products p
WHERE p.name = 'Obsidian Glass Base'
  AND NOT EXISTS (
      SELECT 1 FROM product_features pf WHERE pf.product_id = p.id AND pf.display_order = 2
  );

INSERT INTO job_offers (title, department, location, type, description, created_at)
SELECT * FROM (
    SELECT
        'Luxury Brand Manager',
        'Brand',
        'Berlin',
        'Full-time',
        'Lead premium campaigns, partnerships, and launch narratives for the Blubber Baron portfolio.',
        NOW()
) AS seed
WHERE NOT EXISTS (SELECT 1 FROM job_offers WHERE title = 'Luxury Brand Manager');

INSERT INTO job_offers (title, department, location, type, description, created_at)
SELECT * FROM (
    SELECT
        'Customer Experience Curator',
        'Operations',
        'Remote',
        'Part-time',
        'Shape the tone, retention, and service rituals for our premium customer journeys.',
        NOW()
) AS seed
WHERE NOT EXISTS (SELECT 1 FROM job_offers WHERE title = 'Customer Experience Curator');

INSERT INTO job_requirements (job_offer_id, display_order, requirement)
SELECT j.id, 0, '3+ years in luxury marketing'
FROM job_offers j
WHERE j.title = 'Luxury Brand Manager'
  AND NOT EXISTS (
      SELECT 1 FROM job_requirements r WHERE r.job_offer_id = j.id AND r.display_order = 0
  );

INSERT INTO job_requirements (job_offer_id, display_order, requirement)
SELECT j.id, 1, 'Strong campaign storytelling'
FROM job_offers j
WHERE j.title = 'Luxury Brand Manager'
  AND NOT EXISTS (
      SELECT 1 FROM job_requirements r WHERE r.job_offer_id = j.id AND r.display_order = 1
  );

INSERT INTO job_requirements (job_offer_id, display_order, requirement)
SELECT j.id, 2, 'Experience with ecommerce merchandising'
FROM job_offers j
WHERE j.title = 'Luxury Brand Manager'
  AND NOT EXISTS (
      SELECT 1 FROM job_requirements r WHERE r.job_offer_id = j.id AND r.display_order = 2
  );

INSERT INTO job_requirements (job_offer_id, display_order, requirement)
SELECT j.id, 0, 'Support or CX background'
FROM job_offers j
WHERE j.title = 'Customer Experience Curator'
  AND NOT EXISTS (
      SELECT 1 FROM job_requirements r WHERE r.job_offer_id = j.id AND r.display_order = 0
  );

INSERT INTO job_requirements (job_offer_id, display_order, requirement)
SELECT j.id, 1, 'Excellent written communication'
FROM job_offers j
WHERE j.title = 'Customer Experience Curator'
  AND NOT EXISTS (
      SELECT 1 FROM job_requirements r WHERE r.job_offer_id = j.id AND r.display_order = 1
  );

INSERT INTO job_requirements (job_offer_id, display_order, requirement)
SELECT j.id, 2, 'German and English preferred'
FROM job_offers j
WHERE j.title = 'Customer Experience Curator'
  AND NOT EXISTS (
      SELECT 1 FROM job_requirements r WHERE r.job_offer_id = j.id AND r.display_order = 2
  );
