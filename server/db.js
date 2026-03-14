import mysql from "mysql2/promise";

const requiredEnv = ["DB_HOST", "DB_PORT", "DB_USER", "DB_PASSWORD", "DB_NAME"];
const tableColumnsCache = new Map();

const itemColumnDefinitions = {
  image_urls_json: "ADD COLUMN image_urls_json LONGTEXT NULL AFTER image_url",
  price: "ADD COLUMN price DECIMAL(10,2) NOT NULL DEFAULT 0.00 AFTER image_urls_json",
  on_sale: "ADD COLUMN on_sale TINYINT(1) NOT NULL DEFAULT 0 AFTER price",
  sold_out: "ADD COLUMN sold_out TINYINT(1) NOT NULL DEFAULT 0 AFTER on_sale",
  sale_price: "ADD COLUMN sale_price DECIMAL(10,2) NULL AFTER sold_out",
  is_featured: "ADD COLUMN is_featured TINYINT(1) NOT NULL DEFAULT 1 AFTER sale_price",
  status: "ADD COLUMN status ENUM('draft', 'published') NOT NULL DEFAULT 'published' AFTER is_featured",
  updated_at: "ADD COLUMN updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at",
};

function assertEnv() {
  const missing = requiredEnv.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required database environment variables: ${missing.join(", ")}`);
  }
}

assertEnv();

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: process.env.DB_SSL === "false" ? undefined : { rejectUnauthorized: false },
});

export async function runQuery(query, values = []) {
  const [rows] = await pool.execute(query, values);
  return rows;
}

export async function getTableColumns(tableName, { refresh = false } = {}) {
  if (!refresh && tableColumnsCache.has(tableName)) {
    return tableColumnsCache.get(tableName);
  }

  const columns = await runQuery(`SHOW COLUMNS FROM ${tableName}`);
  const columnSet = new Set(columns.map((column) => column.Field));
  tableColumnsCache.set(tableName, columnSet);
  return columnSet;
}

export async function ensureItemsSchema() {
  const existingColumns = await getTableColumns("items", { refresh: true });
  const missingDefinitions = Object.entries(itemColumnDefinitions)
    .filter(([columnName]) => !existingColumns.has(columnName))
    .map(([, definition]) => definition);

  if (missingDefinitions.length > 0) {
    await runQuery(`ALTER TABLE items ${missingDefinitions.join(", ")}`);
  }

  if (!existingColumns.has("image_urls_json") || missingDefinitions.length > 0) {
    await runQuery(
      `UPDATE items
       SET image_urls_json = JSON_ARRAY(image_url)
       WHERE image_url IS NOT NULL
         AND image_url <> ''
         AND (image_urls_json IS NULL OR image_urls_json = '')`
    );
  }

  if (missingDefinitions.length > 0) {
    await getTableColumns("items", { refresh: true });
  }
}
