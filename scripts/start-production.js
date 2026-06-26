/**
 * Runs DB migrate + seed before Next.js starts (Railway production).
 * Skips when DATABASE_URL is not set (local dev without Postgres).
 */

const { execSync } = require("child_process");

function run(cmd) {
  console.log(`> ${cmd}`);
  execSync(cmd, { stdio: "inherit" });
}

function isDatabaseConfigured() {
  const url = (process.env.DATABASE_URL || "").trim();
  if (!url) return false;
  if (url.includes("PASSWORD@HOST") || url.includes("@HOST:")) return false;
  if (url.includes("postgres.railway.internal")) return false;
  return url.startsWith("postgresql://") || url.startsWith("postgres://");
}

if (isDatabaseConfigured()) {
  run("npx prisma migrate deploy");
  run("npm run db:seed");
} else {
  console.log("DATABASE_URL not configured — skipping migrate and seed.");
}

run("npx next start");
