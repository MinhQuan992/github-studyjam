"use server";

import connectDB from "@lib/mongodb";
import { User } from "@models/user";

export const getAllUsers = async () => {
  await connectDB();
  // TODO: consider to secure this server action
  return await User.find({
    role: {
      $ne: "SUPER_ADMIN",
    },
  }).exec();
};
