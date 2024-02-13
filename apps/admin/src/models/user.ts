import { USER_ROLES } from "@lib/constants";
import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
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
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.ADMIN,
    },
  },
  {
    timestamps: true,
    collection: "users",
  }
);

export const User =
  mongoose.models.User || mongoose.model<IUser>("User", UserModel);
