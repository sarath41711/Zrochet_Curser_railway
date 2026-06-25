import { createHmac } from "crypto";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_COOKIE = "zrochet_admin";

function getExpectedToken(): string {
  const secret = process.env.ADMIN_PASSWORD || "zrochet-admin-change-me";
  return createHmac("sha256", secret).update("zrochet-admin-session").digest("hex");
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const expected = getExpectedToken();
  const token = request.cookies.get(ADMIN_COOKIE)?.value;

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (token !== expected) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (pathname === "/admin/login" && token === expected) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
