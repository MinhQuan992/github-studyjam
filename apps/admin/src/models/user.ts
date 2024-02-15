import mongoose from "mongoose";
import { UserRoles } from "@lib/constants";

export interface UserInterface extends mongoose.Document {
  fullName: string;
  username: string;
  password: string;
  role: string;
}

const UserModel = new mongoose.Schema(
  {
    fullName: String,
    username: String,
    password: String,
    role: {
      type: String,
      enum: Object.values(UserRoles),
      default: UserRoles.Admin,
    },
  },
  {
    timestamps: true,
    collection: "users",
  }
);

export const User =
  mongoose.models.User || mongoose.model<UserInterface>("User", UserModel);
