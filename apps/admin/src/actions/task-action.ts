"use server";

import connectDB from "@lib/mongodb";
import type { TaskInterface } from "@models/task";
import { Task } from "@models/task";
import type { ServerActionResponse } from "./base-action";

export const getActiveTask = async (): Promise<
  ServerActionResponse<TaskInterface>
> => {
  await connectDB();

  const activeTask = await Task.findOne<TaskInterface>({
    active: true,
  }).exec();

  return activeTask !== null
    ? {
        success: true,
        data: activeTask,
      }
    : {
        success: true,
      };
};

export const openNextTask = async (
  currentWeek: number
): Promise<ServerActionResponse> => {
  await connectDB();

  await Task.updateOne(
    {
      week: currentWeek,
    },
    {
      active: false,
    }
  );

  await Task.updateOne({ week: currentWeek + 1 }, { active: true });

  return {
    success: true,
  };
};
