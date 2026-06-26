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
  try {
    return Boolean(require("./resolve-db-url").getDatabaseUrl());
  } catch {
    const url = (process.env.DATABASE_URL || "").trim();
    return Boolean(url) && !url.includes("postgres.railway.internal");
  }
}

if (isDatabaseConfigured()) {
  run("npx prisma migrate deploy");
  run("npm run db:seed");
} else {
  console.log("DATABASE_URL not configured — skipping migrate and seed.");
}

run("npx next start");
