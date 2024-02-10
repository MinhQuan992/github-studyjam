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
      enum: ["SUPER_ADMIN", "ADMIN"],
      default: ["ADMIN"],
    },
  },
  {
    timestamps: true,
    collection: "users",
  }
);

export const User =
  mongoose.models.User || mongoose.model<IUser>("User", UserModel);
