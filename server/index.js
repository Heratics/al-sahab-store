import "dotenv/config";
import express from "express";
import cors from "cors";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { runQuery } from "./db.js";

const app = express();
const PORT = Number(process.env.PORT || 3000);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MAX_IMAGES = 10;

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JWT_SECRET environment variable is required");

const imageInputSchema = z.string().max(5_000_000).refine(
  (value) => value.startsWith("https://") || value.startsWith("http://") || value.startsWith("data:image/"),
  "Each image must be a valid URL or an uploaded image data URL"
);

const productSchema = z.object({
  nameEn: z.string().min(2).max(120),
  nameAr: z.string().min(2).max(120),
  category: z.string().min(2).max(80),
  descEn: z.string().min(10).max(1000),
  descAr: z.string().min(10).max(1000),
  imageUrls: z.array(imageInputSchema).min(1).max(MAX_IMAGES),
  price: z.number().positive().max(99999999.99),
  onSale: z.boolean().optional().default(false),
  soldOut: z.boolean().optional().default(false),
  salePrice: z.number().positive().max(99999999.99).nullable().optional(),
  isFeatured: z.boolean().optional().default(true),
  status: z.enum(["draft", "published"]).optional().default("published"),
}).superRefine((data, ctx) => {
  if (data.onSale) {
    if (typeof data.salePrice !== "number") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["salePrice"],
        message: "salePrice is required when onSale is true",
      });
      return;
    }

    if (data.salePrice >= data.price) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["salePrice"],
        message: "salePrice must be lower than price",
      });
    }
  }
});

const corsOrigin = process.env.CORS_ORIGIN?.split(",").map((v) => v.trim()).filter(Boolean) || "*";
app.use(cors({ origin: corsOrigin }));
app.use(express.json({ limit: "25mb" }));

function parseImageUrls(imageUrlsJson, fallbackImageUrl) {
  try {
    const parsed = typeof imageUrlsJson === "string" ? JSON.parse(imageUrlsJson) : null;
    if (Array.isArray(parsed)) {
      const cleaned = parsed.filter((value) => typeof value === "string" && value.length > 0);
      if (cleaned.length > 0) return cleaned.slice(0, MAX_IMAGES);
    }
  } catch {
    // Fall through to legacy image_url fallback
  }

  if (typeof fallbackImageUrl === "string" && fallbackImageUrl.length > 0) {
    return [fallbackImageUrl];
  }

  return [];
}

// ── Auth middleware ────────────────────────────────────────────────────────────
function requireAuth(req, res, next) {
  const header = req.header("Authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.adminUser = payload;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired session" });
  }
}

function normalizeItem(item) {
  const imageUrls = parseImageUrls(item.imageUrlsJson, item.imageUrl);

  return {
    ...item,
    imageUrl: imageUrls[0] || item.imageUrl,
    imageUrls,
    price: Number(item.price),
    salePrice: item.salePrice == null ? null : Number(item.salePrice),
    onSale: Boolean(item.onSale),
    soldOut: Boolean(item.soldOut),
    isFeatured: Boolean(item.isFeatured),
  };
}

// ── Public routes ──────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.status(200).json({ ok: true, service: "al-sahab-store-api" });
});

app.get("/api/items", async (_req, res) => {
  try {
    const items = await runQuery(
      `SELECT id, name_en AS nameEn, name_ar AS nameAr, category, desc_en AS descEn, desc_ar AS descAr, image_url AS imageUrl, image_urls_json AS imageUrlsJson,
              price, on_sale AS onSale, sold_out AS soldOut, sale_price AS salePrice, is_featured AS isFeatured, status, created_at AS createdAt
       FROM items
       WHERE status = 'published'
       ORDER BY is_featured DESC, created_at DESC`
    );
    res.json({ items: items.map(normalizeItem) });
  } catch (error) {
    console.error("Failed to fetch items", error);
    res.status(500).json({ error: "Failed to fetch items" });
  }
});

app.get("/api/items/:id", async (req, res) => {
  const itemId = Number(req.params.id);
  if (!Number.isInteger(itemId) || itemId <= 0) {
    res.status(400).json({ error: "Invalid item id" });
    return;
  }

  try {
    const [item] = await runQuery(
      `SELECT id, name_en AS nameEn, name_ar AS nameAr, category, desc_en AS descEn, desc_ar AS descAr, image_url AS imageUrl, image_urls_json AS imageUrlsJson,
              price, on_sale AS onSale, sold_out AS soldOut, sale_price AS salePrice, is_featured AS isFeatured, status, created_at AS createdAt
       FROM items
       WHERE id = ?
       LIMIT 1`,
      [itemId]
    );

    if (!item || item.status !== "published") {
      res.status(410).json({ error: "Item no longer sold." });
      return;
    }

    res.json({ item: normalizeItem(item) });
  } catch (error) {
    console.error("Failed to fetch item", error);
    res.status(500).json({ error: "Failed to fetch item" });
  }
});

// ── Admin login ────────────────────────────────────────────────────────────────
app.post("/api/admin/login", async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    res.status(400).json({ error: "username and password are required" });
    return;
  }

  try {
    const [user] = await runQuery(
      "SELECT id, username, password_hash FROM admin_users WHERE username = ? LIMIT 1",
      [username]
    );

    const hasValidHash = user && typeof user.password_hash === "string" && user.password_hash.startsWith("$2");

    if (!hasValidHash || !(await bcrypt.compare(password, user.password_hash))) {
      // Same message for both cases — don't reveal which part was wrong
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const token = jwt.sign(
      { sub: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({ token });
  } catch (error) {
    console.error("Login error", error);
    res.status(500).json({ error: "Login failed" });
  }
});

// ── Protected admin routes ─────────────────────────────────────────────────────
app.get("/api/admin/items", requireAuth, async (_req, res) => {
  try {
    const items = await runQuery(
      `SELECT id, name_en AS nameEn, name_ar AS nameAr, category, desc_en AS descEn, desc_ar AS descAr, image_url AS imageUrl, image_urls_json AS imageUrlsJson,
              price, on_sale AS onSale, sold_out AS soldOut, sale_price AS salePrice, is_featured AS isFeatured, status, created_at AS createdAt
       FROM items
       ORDER BY created_at DESC`
    );
    res.json({ items: items.map(normalizeItem) });
  } catch (error) {
    console.error("Failed to fetch admin items", error);
    res.status(500).json({ error: "Failed to fetch admin items" });
  }
});

app.post("/api/admin/items", requireAuth, async (req, res) => {
  const parsed = productSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ error: "Invalid payload", issues: parsed.error.issues });
    return;
  }

  const payload = parsed.data;

  try {
    const result = await runQuery(
      `INSERT INTO items (name_en, name_ar, category, desc_en, desc_ar, image_url, image_urls_json, price, on_sale, sold_out, sale_price, is_featured, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        payload.nameEn,
        payload.nameAr,
        payload.category,
        payload.descEn,
        payload.descAr,
        payload.imageUrls[0],
        JSON.stringify(payload.imageUrls),
        payload.price,
        payload.onSale,
        payload.soldOut,
        payload.onSale ? payload.salePrice : null,
        payload.isFeatured,
        payload.status,
      ]
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    console.error("Failed to create item", error);
    res.status(500).json({ error: "Failed to create item" });
  }
});

app.put("/api/admin/items/:id", requireAuth, async (req, res) => {
  const itemId = Number(req.params.id);
  if (!Number.isInteger(itemId) || itemId <= 0) {
    res.status(400).json({ error: "Invalid item id" });
    return;
  }

  const parsed = productSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ error: "Invalid payload", issues: parsed.error.issues });
    return;
  }

  const payload = parsed.data;

  try {
    const result = await runQuery(
      `UPDATE items
       SET name_en = ?, name_ar = ?, category = ?, desc_en = ?, desc_ar = ?, image_url = ?, image_urls_json = ?,
           price = ?, on_sale = ?, sold_out = ?, sale_price = ?, is_featured = ?, status = ?
       WHERE id = ?`,
      [
        payload.nameEn,
        payload.nameAr,
        payload.category,
        payload.descEn,
        payload.descAr,
        payload.imageUrls[0],
        JSON.stringify(payload.imageUrls),
        payload.price,
        payload.onSale,
        payload.soldOut,
        payload.onSale ? payload.salePrice : null,
        payload.isFeatured,
        payload.status,
        itemId,
      ]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Item not found" });
      return;
    }

    res.status(200).json({ id: itemId });
  } catch (error) {
    console.error("Failed to update item", error);
    res.status(500).json({ error: "Failed to update item" });
  }
});

app.delete("/api/admin/items/:id", requireAuth, async (req, res) => {
  const itemId = Number(req.params.id);
  if (!Number.isInteger(itemId) || itemId <= 0) {
    res.status(400).json({ error: "Invalid item id" });
    return;
  }

  try {
    const result = await runQuery("DELETE FROM items WHERE id = ?", [itemId]);
    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Item not found" });
      return;
    }

    res.status(200).json({ id: itemId });
  } catch (error) {
    console.error("Failed to delete item", error);
    res.status(500).json({ error: "Failed to delete item" });
  }
});

const staticDir = path.join(__dirname, "..", "dist", "public");

if (fs.existsSync(staticDir)) {
  const appMode = process.env.APP_MODE || "all";
  app.use(express.static(staticDir));

  if (appMode === "admin") {
    app.get("/", (_req, res) => {
      res.sendFile(path.join(staticDir, "admin.html"));
    });
  } else if (appMode === "storefront") {
    app.get("/", (_req, res) => {
      res.sendFile(path.join(staticDir, "index.html"));
    });
  } else {
    app.get(["/", "/admin"], (req, res) => {
      const fileName = req.path === "/admin" ? "admin.html" : "index.html";
      res.sendFile(path.join(staticDir, fileName));
    });
  }

  app.get("*", (req, res, next) => {
    const acceptsHtml = req.accepts(["html", "json", "text"]) === "html";
    const hasFileExtension = path.extname(req.path) !== "";

    if (req.path.startsWith("/api") || req.path === "/health") {
      next();
      return;
    }

    if (!acceptsHtml || hasFileExtension) {
      next();
      return;
    }

    if (appMode === "admin") {
      res.sendFile(path.join(staticDir, "admin.html"));
      return;
    }

    if (appMode === "storefront") {
      res.sendFile(path.join(staticDir, "index.html"));
      return;
    }

    if (req.path.startsWith("/admin")) {
      res.sendFile(path.join(staticDir, "admin.html"));
      return;
    }

    res.sendFile(path.join(staticDir, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
