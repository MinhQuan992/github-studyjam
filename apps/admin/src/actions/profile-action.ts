"use server";

import { cookies } from "next/headers";
import { ServerActionResponse } from "./base-action";
import { SESSION_COOKIE_NAME } from "@lib/constants";
import { verifyJwt } from "@lib/utils";
import connectDB from "@lib/mongodb";
import { User } from "@models/user";
import { ProfileFormSchema, ProfileFormSchemaType } from "@lib/definitions";
import * as bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export const getProfileInfo = async (): Promise<ServerActionResponse> => {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;
  const decodedToken = await verifyJwt(token);

  if (!decodedToken) {
    return {
      success: false,
      message: "An error has occurred.",
    };
  }

  await connectDB();
  const currentUser = await User.findOne({ username: decodedToken.sub }).exec();
  return {
    success: true,
    data: currentUser,
  };
};

export const changePassword = async (
  data: ProfileFormSchemaType
): Promise<ServerActionResponse> => {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;
  const decodedToken = await verifyJwt(token);

  if (!decodedToken) {
    return {
      success: false,
      message: "An error has occurred.",
    };
  }

  try {
    const validatedFields = await ProfileFormSchema.validate(data);
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(validatedFields.password, salt);
    await connectDB();
    await User.updateOne(
      { username: decodedToken.sub },
      { password: hashedPassword }
    );

    return {
      success: true,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const logout = () => {
  cookies().delete(SESSION_COOKIE_NAME);
  redirect("/");
};
