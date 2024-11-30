import { NextResponse } from "next/server";

export function middleware(req) {
  const authToken = req.cookies.get("authToken");
  const url = req.nextUrl.clone();

  // Allow public assets like static files and images
  const PUBLIC_FILE = /\.(.*)$/;
  const ALLOWED_PATHS = ["/Auth", "/_next", "/favicon.ico", "/images", "/public"];

  // Skip middleware for static files or paths explicitly allowed
  if (PUBLIC_FILE.test(url.pathname) || ALLOWED_PATHS.some(path => url.pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // If no cookie token is found, check if we're redirecting from Auth page
  const referer = req.headers.get("referer") || "";
  const isAuthRedirect = referer.includes("/Auth");
  
  // Allow the first request after authentication
  if (isAuthRedirect && url.pathname === "/Matches") {
    return NextResponse.next();
  }

  // Redirect unauthenticated users
  if (!authToken && url.pathname !== "/Auth") {
    url.pathname = "/Auth";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Matcher configuration
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|Auth).*)"],
};
