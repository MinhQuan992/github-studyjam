import * as jose from "jose";
import { USER_ROLES } from "./constants";

export const verifyJwt = async (token?: string) => {
  if (!token) {
    return null;
  }

  const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

  try {
    const { payload } = await jose.jwtVerify(token, secret);
    return payload;
  } catch (error) {
    return null;
  }
};

export const isRole = async (role: USER_ROLES, token?: string) => {
  const decodedToken = await verifyJwt(token);

  if (!decodedToken) {
    return false;
  }

  return decodedToken.role === role;
};
