"use server";

import {
  SESSION_COOKIE_NAME,
  WRONG_USERNAME_OR_PASSWORD_MESSAGE,
} from "@lib/constants";
import { CredentialSchemaType } from "@lib/definitions";
import connectDB from "@lib/mongodb";
import { User } from "@models/user";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import * as jose from "jose";

export const authenticate = async (data: CredentialSchemaType) => {
  await connectDB();
  const user = await User.findOne({ username: data.username }).exec();
  if (!user) {
    return WRONG_USERNAME_OR_PASSWORD_MESSAGE;
  }

  // TODO: compare the raw password with the encrypted one
  if (user.password !== data.password) {
    return WRONG_USERNAME_OR_PASSWORD_MESSAGE;
  }

  const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);
  const alg = "HS256";

  const token = await new jose.SignJWT({ role: user.role })
    .setProtectedHeader({ alg })
    .setSubject(user.username)
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(secret);

  cookies().set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 2,
    path: "/",
  });

  redirect("/dashboard");
};
