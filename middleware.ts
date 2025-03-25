import { jwtDecode } from "jwt-decode";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname, origin } = request.nextUrl;

  // Regular expression untuk format JWT
  const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/;

  if (pathname === "/favicon.ico" || pathname.startsWith("/_next/")) {
    return NextResponse.next();
  }

  if (!token) {
    if (pathname.startsWith("/dashboard") || pathname === "/") {
      return NextResponse.redirect(`${origin}/login`);
    }
    return NextResponse.next();
  }

  if (!jwtRegex.test(token)) {
    const response = NextResponse.redirect(`${origin}/login`);
    response.cookies.set("token", "", { expires: new Date(0) });
    return response;
  }

  try {
    // Decode token untuk mendapatkan informasi pengguna
    const decoded = jwtDecode(token) as { username: string };

    // Jika pengguna bukan "superadmin" dan mencoba mengakses /dashboard/pengguna, kembalikan ke /dashboard
    if (pathname.startsWith("/dashboard/pengguna") && decoded.username !== "superadmin") {
      return NextResponse.redirect(`${origin}/dashboard`);
    }

    if (pathname === "/login" || pathname === "/") {
      if (token) {
        return NextResponse.redirect(`${origin}/dashboard`);
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.log(error);
    return NextResponse.redirect(`${origin}/login`);
  }
}
