import { ServerActionResponse } from "@lib/definitions";
import connectDB from "@lib/mongodb";
import { GroupScoreInterface, GroupScore } from "@models/group-score";
import { TaskInterface, Task } from "@models/task";
import { WeeklyScoreInterface, WeeklyScore } from "@models/weekly-score";

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

export const getScoresOfWeek = async (
  week: number
): Promise<ServerActionResponse<WeeklyScoreInterface>> => {
  await connectDB();
  const result = await WeeklyScore.findOne<WeeklyScoreInterface>({
    week,
  }).exec();
  return result !== null
    ? {
        success: true,
        data: result,
      }
    : {
        success: false,
      };
};

export const getLeaderboard = async (): Promise<
  ServerActionResponse<GroupScoreInterface[]>
> => {
  await connectDB();
  const groupScores = await GroupScore.find<GroupScoreInterface>().exec();
  return {
    success: true,
    data: groupScores.sort((groupA, groupB) => groupB.score - groupA.score),
  };
};
