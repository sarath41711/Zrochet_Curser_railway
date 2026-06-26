/** True when DATABASE_URL is set and usable (not a placeholder or Railway-internal URL). */
export function isDatabaseConfigured(): boolean {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) return false;
  if (url.includes("PASSWORD@HOST") || url.includes("@HOST:")) return false;
  // Railway internal hostname only works inside Railway, not on your PC
  if (url.includes("postgres.railway.internal")) return false;
  return url.startsWith("postgresql://") || url.startsWith("postgres://");
}

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";
}
