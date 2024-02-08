import mongoose from "mongoose";

const UserModel = new mongoose.Schema(
  {
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

export const User = mongoose.models.User || mongoose.model("User", UserModel);
