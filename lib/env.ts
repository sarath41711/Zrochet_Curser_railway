/** Resolves a Postgres URL that works on your PC (rejects placeholders and Railway-internal hosts). */
export function getDatabaseUrl(): string | undefined {
  const url = (
    process.env.DATABASE_URL?.trim() ||
    process.env.DATABASE_PUBLIC_URL?.trim() ||
    ""
  );
  if (!url) return undefined;
  if (url.includes("PASSWORD@HOST") || url.includes("@HOST:")) return undefined;
  if (url.includes("postgres.railway.internal")) return undefined;
  if (!url.startsWith("postgresql://") && !url.startsWith("postgres://")) return undefined;
  return url;
}

export function isDatabaseConfigured(): boolean {
  return Boolean(getDatabaseUrl());
}

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";
}

/** Call before Prisma connects so DATABASE_PUBLIC_URL works in .env.local */
export function applyDatabaseUrlEnv(): void {
  const url = getDatabaseUrl();
  if (url) {
    process.env.DATABASE_URL = url;
  }
}
