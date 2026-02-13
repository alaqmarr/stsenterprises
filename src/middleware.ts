import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Configuration
const AUTH_API_URL = process.env.AUTHORISATION_URL;
const CLIENT_ID = process.env.AUTHORISATION_ID;
const API_KEY = process.env.AUTHORISATION_KEY;

// Paths that are always accessible
const PUBLIC_PATHS = [
  "/service-unavailable",
  "/_next",
  "/api",
  "/favicon.ico",
  "/images",
  "/logo.jpeg",
  "/globals.css",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Bypass check for public paths and static assets
  if (
    PUBLIC_PATHS.some((path) => pathname.startsWith(path)) ||
    pathname.match(/\.(png|jpg|jpeg|svg|gif|webp|css|js)$/)
  ) {
    return NextResponse.next();
  }

  // License Check Logic
  if (!AUTH_API_URL || !CLIENT_ID || !API_KEY) {
    // If config is missing, redirect to service unavailable
    // console.error("Missing Auth Config");
    return NextResponse.redirect(new URL("/service-unavailable", request.url));
  }

  try {
    const response = await fetch(`${AUTH_API_URL}?clientId=${CLIENT_ID}`, {
      method: "GET",
      headers: {
        "x-api-key": API_KEY,
        "Content-Type": "application/json",
      },
      cache: "no-store", // Ensure we don't cache the auth check
    });

    if (!response.ok) {
      // console.error("Auth API Error", response.status);
      throw new Error("Auth service failed");
    }

    const data = await response.json();

    if (!data.success || !data.authorized) {
      return NextResponse.redirect(
        new URL("/service-unavailable", request.url),
      );
    }
  } catch (error) {
    // console.error('Middleware Auth Error:', error);
    return NextResponse.redirect(new URL("/service-unavailable", request.url));
  }

  // 2. Admin Authentication Check (Replica of previous middleware)
  if (pathname.startsWith("/admin")) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // Check if user is authenticated and is an admin
    if (!token || token.role !== "ADMIN") {
      // If attempting to access admin and not authorized, redirect to home
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
