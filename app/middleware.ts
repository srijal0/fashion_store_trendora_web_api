import { NextResponse, NextRequest } from "next/server";

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ✅ Unified cookie name
  const token = req.cookies.get("auth_token")?.value;

  // RULE 1: /admin routes - Only admin role can access
  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
      const payload = token.split(".")[1];
      const decoded = JSON.parse(Buffer.from(payload, "base64").toString("utf-8"));

      if (decoded.role !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    } catch (error) {
      console.error("Token decode error:", error);
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // RULE 2: /user routes - Only logged in users can access
  if (pathname.startsWith("/user")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
      const payload = token.split(".")[1];
      JSON.parse(Buffer.from(payload, "base64").toString("utf-8"));
    } catch (error) {
      console.error("Token decode error:", error);
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // RULE 3: /login and /register - If already logged in, redirect based on role
  if (pathname === "/login" || pathname === "/register") {
    if (token) {
      try {
        const payload = token.split(".")[1];
        const decoded = JSON.parse(Buffer.from(payload, "base64").toString("utf-8"));

        // middleware.ts
const redirectPath =
  decoded.role === "admin" ? "/admin/dashboard" : "/dashboard";



        return NextResponse.redirect(new URL(redirectPath, req.url));
      } catch (error) {
        // Token invalid, let them stay on login/register
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"],
};
