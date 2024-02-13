import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJwt } from "@lib/utils";
import { SESSION_COOKIE_NAME } from "@lib/constants";

export const middleware = async (request: NextRequest) => {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    const decodedToken = await verifyJwt(token);

    if (decodedToken) {
      return request.nextUrl.pathname === "/"
        ? NextResponse.redirect(new URL("/dashboard", request.url))
        : NextResponse.next();
    }

    return performRedirect(request);
  }

  return performRedirect(request);
};

const performRedirect = (request: NextRequest) => {
  if (request.nextUrl.pathname !== "/") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
