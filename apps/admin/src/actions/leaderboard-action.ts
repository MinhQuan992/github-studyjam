import connectDB from "@lib/mongodb";
import type { GroupScoreInterface } from "@models/group-score";
import { GroupScore } from "@models/group-score";
import type { ServerActionResponse } from "./base-action";

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
