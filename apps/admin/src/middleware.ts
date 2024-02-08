import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isValidJwt } from "@lib/utils";

export const middleware = async (request: NextRequest) => {
  const token = request.cookies.get("session")?.value;

  if (token) {
    const tokenValid = await isValidJwt(token);

    if (tokenValid) {
      return NextResponse.next();
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
