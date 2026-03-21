import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Configuration
const AUTH_API_URL = process.env.AUTHORISATION_URL;
const CLIENT_ID = process.env.AUTHORISATION_ID;
const API_KEY = process.env.AUTHORISATION_KEY;

// Paths that are always accessible (static assets, api routes, maintenance page)
const PUBLIC_PATHS = [
  "/service-unavailable",
  "/_next",
  "/api", // Keep internal APIs accessible? Or block them too? Usually wise to block if site is "down"
  "/favicon.ico",
  "/images", // Public images
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

  // 2. Check for manual bypass via ENV variable
  if (process.env.API_CHECK === "bypass") {
    return NextResponse.next();
  }

  if (!AUTH_API_URL || !CLIENT_ID || !API_KEY) {
    return NextResponse.redirect(new URL("/service-unavailable", request.url));
  }

  try {
    // 2. Call external authorization API
    const response = await fetch(`${AUTH_API_URL}?clientId=${CLIENT_ID}`, {
      method: "GET",
      headers: {
        "x-api-key": API_KEY,
        "Content-Type": "application/json",
      },
      // Set a short timeout to avoid blocking page loads for too long if auth service is slow
      // Note: Next.js middleware fetch signal is a bit tricky, but basic fetch works.
      // There isn't a native timeout option in standard Fetch API without AbortController
      // but Vercel edge runtime handles it.
    });

    if (!response.ok) {
      // If API fails (500, etc), default to maintenance? Or fail open?
      // User requested "maintenance page", so let's assume fail closed safe.
      throw new Error("Auth service failed");
    }

    const data = await response.json();

    // 3. Check authorization status
    if (data.success && data.authorized) {
      return NextResponse.next();
    } else {
      // 4. Redirect to service unavailable if not authorized
      return NextResponse.redirect(
        new URL("/service-unavailable", request.url),
      );
    }
  } catch (error) {
    console.error("Middleware Auth Error:", error);
    // On error (e.g. timeout, network issue), redirect to service unavailable
    return NextResponse.redirect(new URL("/service-unavailable", request.url));
  }
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
