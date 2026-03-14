/**
 * One-time script to create an admin user.
 * Run: node scripts/create-admin.js <username> <password>
 */
import "dotenv/config";
import bcrypt from "bcryptjs";
import { runQuery } from "../server/db.js";

const [username, password] = process.argv.slice(2);

if (!username || !password) {
  console.error("Usage: node scripts/create-admin.js <username> <password>");
  process.exit(1);
}

if (password.length < 8) {
  console.error("Password must be at least 8 characters.");
  process.exit(1);
}

const hash = await bcrypt.hash(password, 12);

try {
  await runQuery(
    "INSERT INTO admin_users (username, password_hash) VALUES (?, ?)",
    [username, hash]
  );
  console.log(`Admin user "${username}" created successfully.`);
} catch (error) {
  if (error.code === "ER_DUP_ENTRY") {
    console.error(`Username "${username}" already exists.`);
  } else {
    console.error("Failed to create admin user:", error.message);
  }
} finally {
  process.exit(0);
}
