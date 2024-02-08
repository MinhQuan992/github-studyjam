import * as jose from "jose";

export const isValidJwt = async (token: string) => {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);
  const { payload } = await jose.jwtVerify(token, secret);
  const { sub, iat, exp } = payload;

  if (!sub || !iat || !exp) {
    return false;
  }

  if (new Date(1000 * exp) < new Date()) {
    return false;
  }

  return true;
};
