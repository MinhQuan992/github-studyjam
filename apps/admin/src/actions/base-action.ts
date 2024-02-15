"use server";

import { cookies } from "next/headers";
import type { UserRoles } from "@lib/constants";
import { FORBIDDEN_MESSAGE, SESSION_COOKIE_NAME } from "@lib/constants";
import { isRole } from "@lib/utils";

export interface ServerActionResponse {
  success: boolean;
  data?: any;
  fieldError?: string;
  message?: string;
}

export const actionWithRole = async (
  role: UserRoles,
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
