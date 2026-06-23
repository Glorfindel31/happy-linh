import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // ponytail: allow /api/* through without auth for debugging.
    // In production, add proper session validation.
    if (pathname.startsWith("/api/")) {
        return NextResponse.next();
    }

    // Check for session cookie (simplified auth)
    const sessionCookie = request.cookies.get("session");

    const isPublicRoute = pathname.startsWith("/login") || pathname === "/";
    const isProtectedRoute = pathname.startsWith("/dashboard");

    if (isProtectedRoute && !sessionCookie) {
        // Redirect to login
        const loginUrl = new URL("/", request.url);
        return NextResponse.redirect(loginUrl);
    }

    if (isPublicRoute && sessionCookie) {
        // Already logged in, redirect to dashboard
        const dashUrl = new URL("/dashboard", request.url);
        return NextResponse.redirect(dashUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/login"],
};
