"use server";

import {
  FORBIDDEN_MESSAGE,
  SESSION_COOKIE_NAME,
  USER_ROLES,
} from "@lib/constants";
import { isRole } from "@lib/utils";
import { cookies } from "next/headers";

export type ServerActionResponse = {
  success: boolean;
  data?: any;
  fieldError?: string;
  message?: string;
};

export const actionWithRole = async (
  role: USER_ROLES,
  action: (...args: any[]) => Promise<ServerActionResponse>,
  ...args: any[]
): Promise<ServerActionResponse> => {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;
  const isSuitableRole = await isRole(role, token);

  if (isSuitableRole) {
    return args.length === 0 ? action() : action(...args);
  }

  return {
    success: false,
    message: FORBIDDEN_MESSAGE,
  };
};
