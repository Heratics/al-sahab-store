# Deploy on Render (MySQL + Storefront + Admin)

## 1) Create MySQL database
1. Create a Render MySQL instance.
2. Connect with a MySQL client and run `database/schema.sql`.

## 2) Deploy API/Frontend service (single service mode)
Use `render.yaml` or create a Web Service manually with:
- Build Command: `npm install; npm run build`
- Start Command: `npm run start`

Environment variables:
- `NODE_ENV=production`
- `APP_MODE=all`
- `PORT=10000`
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- `CORS_ORIGIN=https://your-store-url.onrender.com,https://your-admin-url.onrender.com`
- `ADMIN_TOKEN=<strong-secret>`

With `APP_MODE=all`:
- Storefront URL: `https://your-service.onrender.com/`
- Admin URL: `https://your-service.onrender.com/admin`

## 3) Optional: deploy storefront and admin as two distinct Render URLs
Create two Render Web Services from the same repo, both using the same DB variables:

- Storefront service:
  - `APP_MODE=storefront`
  - URL root `/` serves the customer storefront.

- Admin service:
  - `APP_MODE=admin`
  - URL root `/` serves manager admin page.

In both services set `VITE_API_BASE_URL` at build time only if API is hosted on another domain.
If API and frontend are in the same service/domain, you can leave `VITE_API_BASE_URL` empty.

## 4) Local run
1. Copy `.env.example` to `.env` and fill values.
2. Terminal 1: `npm run dev:server`
3. Terminal 2: `npm run dev`
4. Open:
- Storefront: `http://localhost:5173/`
- Admin page (dev): `http://localhost:5173/admin.html`
