import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJwt } from "@lib/utils";
import { SESSION_COOKIE_NAME, USER_ROLES } from "@lib/constants";

export const middleware = async (request: NextRequest) => {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    const decodedToken = await verifyJwt(token);

    if (decodedToken) {
      const pathname = request.nextUrl.pathname;
      if (
        pathname === "/" ||
        (pathname.startsWith("/dashboard/users") &&
          decodedToken.role === USER_ROLES.ADMIN) ||
        (pathname.startsWith("/dashboard/marking") &&
          decodedToken.role === USER_ROLES.SUPER_ADMIN)
      ) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      } else {
        return NextResponse.next();
      }
    }

    return forceLogin(request);
  }

  return forceLogin(request);
};

const forceLogin = (request: NextRequest) => {
  if (request.nextUrl.pathname !== "/") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
