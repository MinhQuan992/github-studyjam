"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import * as jose from "jose";
import * as bcrypt from "bcryptjs";
import {
  SESSION_COOKIE_NAME,
  WRONG_USERNAME_OR_PASSWORD_MESSAGE,
} from "@lib/constants";
import type { CredentialSchemaType } from "@lib/definitions";
import connectDB from "@lib/mongodb";
import { User } from "@models/user";
import type { UserInterface } from "@models/user";
import type { ServerActionResponse } from "./base-action";

export const authenticate = async (
  data: CredentialSchemaType
): Promise<ServerActionResponse> => {
  console.log("Started connecting to DB...");
  await connectDB();
  console.log(`Authenticating for user ${data.username}`);
  const user = await User.findOne<UserInterface>({
    username: data.username,
  }).exec();
  console.log("After querying database...");
  if (!user) {
    return {
      success: false,
      message: WRONG_USERNAME_OR_PASSWORD_MESSAGE,
    };
  }

  console.log("Comparing passwords...");
  if (!bcrypt.compareSync(data.password, user.password)) {
    return {
      success: false,
      message: WRONG_USERNAME_OR_PASSWORD_MESSAGE,
    };
  }

  const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);
  const alg = "HS256";

  console.log("Generating token...");
  const token = await new jose.SignJWT({ role: user.role })
    .setProtectedHeader({ alg })
    .setSubject(user.username)
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(secret);

  console.log("Setting cookies...");
  cookies().set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 2,
    path: "/",
  });

  redirect("/dashboard");
};
