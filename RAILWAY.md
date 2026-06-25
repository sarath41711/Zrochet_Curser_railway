# Railway deployment guide — Zrochet

## Your live site
https://zrochetcurserrailway-production.up.railway.app

## Railway variables (Web service)

Set these in **Railway → your Next.js service → Variables**:

| Variable | Value |
|----------|--------|
| `DATABASE_URL` | Reference from PostgreSQL service (internal URL is fine on Railway) |
| `ADMIN_PASSWORD` | Choose a strong password for `/admin/login` |
| `NEXT_PUBLIC_SITE_URL` | `https://zrochetcurserrailway-production.up.railway.app` |

## First-time database setup

After deploying, run the seed **once** to import products from `catalog.json`:

### Option A — Railway CLI
```bash
railway login
railway link
railway run npm run db:seed
```

### Option B — One-off deploy command
In Railway → Service → Settings → add a one-time command or use the shell:
```
npm run db:seed
```

This creates:
- 5 collections (mini-bags, party-bags, oreo-bags, side-bags, handle-bags)
- All products from `data/catalog.json`
- Default site settings (email, phone, address)

## Admin portal

| URL | Purpose |
|-----|---------|
| `/admin/login` | Sign in with `ADMIN_PASSWORD` |
| `/admin` | Dashboard |
| `/admin/products` | Edit stock, prices, descriptions |
| `/admin/products/new` | Add new product |
| `/admin/settings` | Change phone, email, address, hero image |
| `/admin/orders` | View customer orders |

## Local development

1. Copy `.env.example` to `.env.local`
2. Use Railway **public** database URL (not `postgres.railway.internal`)
3. Run:
   ```bash
   npm install
   npm run db:migrate
   npm run db:seed
   npm run dev
   ```

## Build process

`npm run build` runs on Railway during the **build** phase (no database access):
1. Generates Prisma client
2. Generates catalog JSON (fallback)
3. Builds Next.js

**Pre-deploy** (via `railway.toml`) runs when the database is reachable:
1. `npx prisma migrate deploy` — creates tables
2. `npm run db:seed` — imports products (skips if DB already has products)

You can also run `npm run db:seed` manually in Railway **Console**.

## Security notes

- Never commit `.env` or `.env.local` to Git
- Change `ADMIN_PASSWORD` from the default immediately
- Rotate database password if it was shared publicly
