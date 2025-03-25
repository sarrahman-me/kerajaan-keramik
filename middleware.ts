import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token");
  const { pathname, origin } = request.nextUrl;

  // Regular expression untuk format JWT
  const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/;

  if (pathname === "/favicon.ico" || pathname.startsWith("/_next/")) {
    return NextResponse.next();
  }

  if (!token) {
    if (pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(`${origin}/login`);
    }
  }

  if (token && !jwtRegex.test(token.value)) {
    const response = NextResponse.redirect(`${origin}/login`);
    response.cookies.set("token", "", { expires: new Date(0) });
    return response;
  }

  try {
    if (
      pathname === "/login" ||
      pathname === "/"
    ) {
      if (token) {
        return NextResponse.redirect(`${origin}/dashboard`);
      }
    }
    return NextResponse.next();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error)
    if (pathname !== "/login") {
      return NextResponse.redirect(`${origin}/login`);
    }
    return NextResponse.next();
  }
}
