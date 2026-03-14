USE alshaebstore;

CREATE TABLE IF NOT EXISTS admin_users (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  username VARCHAR(60) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS items (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name_en VARCHAR(120) NOT NULL,
  name_ar VARCHAR(120) NOT NULL,
  category VARCHAR(80) NOT NULL,
  desc_en TEXT NOT NULL,
  desc_ar TEXT NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  image_urls_json LONGTEXT NULL,
  price DECIMAL(10,2) NOT NULL,
  on_sale TINYINT(1) NOT NULL DEFAULT 0,
  sold_out TINYINT(1) NOT NULL DEFAULT 0,
  quantity INT UNSIGNED NOT NULL DEFAULT 1,
  sale_price DECIMAL(10,2) NULL,
  is_featured TINYINT(1) NOT NULL DEFAULT 1,
  status ENUM('draft', 'published') NOT NULL DEFAULT 'published',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_items_status_featured_created (status, is_featured, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Run this on existing databases that already have the items table:
ALTER TABLE items
  ADD COLUMN IF NOT EXISTS image_urls_json LONGTEXT NULL,
  ADD COLUMN IF NOT EXISTS price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  ADD COLUMN IF NOT EXISTS on_sale TINYINT(1) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS sold_out TINYINT(1) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS quantity INT UNSIGNED NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS sale_price DECIMAL(10,2) NULL;

UPDATE items
SET image_urls_json = JSON_ARRAY(image_url)
WHERE image_urls_json IS NULL OR image_urls_json = '';

UPDATE items
SET quantity = CASE
  WHEN sold_out = 1 THEN 0
  WHEN quantity = 0 THEN 1
  ELSE quantity
END
WHERE id > 0;

UPDATE items
SET sold_out = CASE WHEN quantity = 0 THEN 1 ELSE 0 END
WHERE id > 0;
