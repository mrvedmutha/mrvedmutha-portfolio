import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
  });
  const { pathname } = request.nextUrl;

  // If user is not logged in and tries to access /admin, redirect to /auth
  if (!token && pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  // If user is logged in and tries to access /auth, redirect to /admin
  if (token && pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // Allow all other requests
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/auth/:path*"],
};
