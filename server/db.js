import mysql from "mysql2/promise";

const requiredEnv = ["DB_HOST", "DB_PORT", "DB_USER", "DB_PASSWORD", "DB_NAME"];

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
