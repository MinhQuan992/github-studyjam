"use server";

import {
  MUST_PROVIDE_PASSWORD_MESSAGE,
  USERNAME_ALREADY_EXISTS_MESSAGE,
} from "@lib/constants";
import { UserFormSchema, UserFormSchemaType } from "@lib/definitions";
import connectDB from "@lib/mongodb";
import { User } from "@models/user";
import * as bcrypt from "bcryptjs";
import { ServerActionResponse } from "./base-action";

export const getAllUsers = async (): Promise<ServerActionResponse> => {
  await connectDB();

  const users = await User.find({
    role: {
      $ne: "SUPER_ADMIN",
    },
  }).exec();

  return {
    success: true,
    data: users,
  };
};

export const addUser = async (
  data: UserFormSchemaType
): Promise<ServerActionResponse> => {
  await connectDB();
  try {
    const validatedFields = await UserFormSchema.validate(data);

    if (!validatedFields.password) {
      return {
        success: false,
        fieldError: "password",
        message: MUST_PROVIDE_PASSWORD_MESSAGE,
      };
    }

    const existingUserWithTheSameUsername = await User.find({
      username: validatedFields.username,
    }).exec();

    if (existingUserWithTheSameUsername.length > 0) {
      return {
        success: false,
        fieldError: "username",
        message: USERNAME_ALREADY_EXISTS_MESSAGE,
      };
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(validatedFields.password, salt);
    const user = new User({ ...validatedFields, password: hashedPassword });
    await user.save();

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

export const deleteUsers = async (
  usernames: string[]
): Promise<ServerActionResponse> => {
  await connectDB();
  User.deleteMany({
    username: {
      $in: usernames,
    },
  }).exec();
  return {
    success: true,
  };
};

export const editUser = async (
  data: UserFormSchemaType,
  id: string
): Promise<ServerActionResponse> => {
  await connectDB();
  const user = await User.findById(id).exec();

  try {
    const validatedFields = await UserFormSchema.validate(data);

    if (user.username !== data.username) {
      const userWithNewUserName = await User.find({
        username: data.username,
      }).exec();
      if (
        userWithNewUserName.length == 1 &&
        userWithNewUserName[0]._id !== user._id
      ) {
        return {
          success: false,
          fieldError: "username",
          message: USERNAME_ALREADY_EXISTS_MESSAGE,
        };
      }
    }

    let updateObject;

    if (validatedFields.newPassword && validatedFields.password) {
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(validatedFields.password, salt);
      updateObject = {
        fullName: validatedFields.fullName,
        username: validatedFields.username,
        password: hashedPassword,
      };
    } else {
      updateObject = {
        fullName: validatedFields.fullName,
        username: validatedFields.username,
      };
    }

    await User.updateOne({ _id: id }, { ...updateObject });

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
