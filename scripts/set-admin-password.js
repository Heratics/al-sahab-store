/**
 * Set or reset an admin user's password.
 * Run: node scripts/set-admin-password.js <username> <password>
 */
import "dotenv/config";
import bcrypt from "bcryptjs";
import { runQuery } from "../server/db.js";

const [username, password] = process.argv.slice(2);

if (!username || !password) {
  console.error("Usage: node scripts/set-admin-password.js <username> <password>");
  process.exit(1);
}

if (password.length < 8) {
  console.error("Password must be at least 8 characters.");
  process.exit(1);
}

const hash = await bcrypt.hash(password, 12);

try {
  const result = await runQuery(
    "UPDATE admin_users SET password_hash = ? WHERE username = ?",
    [hash, username]
  );

  if (result.affectedRows === 0) {
    await runQuery(
      "INSERT INTO admin_users (username, password_hash) VALUES (?, ?)",
      [username, hash]
    );
    console.log(`Admin user \"${username}\" created and password set.`);
  } else {
    console.log(`Password updated for admin user \"${username}\".`);
  }
} catch (error) {
  console.error("Failed to set admin password:", error.message);
  process.exit(1);
}
