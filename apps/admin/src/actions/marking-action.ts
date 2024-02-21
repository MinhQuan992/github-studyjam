"use server";

import type {
  GoogleSheetsApiResponseError,
  GoogleSheetsApiResponseSuccess,
} from "@lib/definitions";
import type { WeeklyScoreInterface } from "@models/weekly-score";
import { WeeklyScore } from "@models/weekly-score";
import connectDB from "@lib/mongodb";
import type { GroupScoreInterface } from "@models/group-score";
import { GroupScore } from "@models/group-score";
import type { ServerActionResponse } from "./base-action";

export const fetchFormSubmissions = async (
  sheetId: string,
  range: string,
  activeWeek: number,
  numberOfACs: number
): Promise<
  ServerActionResponse<
    GoogleSheetsApiResponseSuccess | GoogleSheetsApiResponseError
  >
> => {
  const response = await fetch(
    `${process.env.GOOGLE_SHEETS_SERVER_URL}/sheet?sheetId=${sheetId}&range=${range}`
  );

  const body = await response.json();

  if (response.status !== 200) {
    return {
      success: false,
      message: (body as GoogleSheetsApiResponseError).error,
    };
  }

  await generateNewWeeklyScoreDoc(body, activeWeek, numberOfACs);

  return {
    success: true,
  };
};

const generateNewWeeklyScoreDoc = async (
  data: GoogleSheetsApiResponseSuccess,
  activeWeek: number,
  numberOfACs: number
) => {
  const scoreArray = data.data.values.slice(1).map((row: string[]) => ({
    time: row[0],
    groupName: row[1],
    submission: row[2],
    acs: new Array(numberOfACs).fill(false),
    rankingBonus: 0,
    accept: true,
  }));

  await WeeklyScore.updateOne(
    {
      week: activeWeek,
    },
    {
      week: activeWeek,
      numberOfACs,
      groups: scoreArray,
    },
    {
      upsert: true,
    }
  );
};

export const finalizeWeeklyMarking = async (
  activeWeek: number
): Promise<ServerActionResponse> => {
  await connectDB();
  const weekScores = await WeeklyScore.findOne<WeeklyScoreInterface>({
    week: activeWeek,
  }).exec();

  if (!weekScores) {
    return {
      success: false,
    };
  }

  const groupsHaveBonus = weekScores.groups
    .filter(
      (group) =>
        group.accept &&
        isEligibleForRankingBonus(group.acs, weekScores.numberOfACs)
    )
    .slice(0, 3);
  let bonusPoint = 3;
  groupsHaveBonus.forEach((group) => {
    group.rankingBonus = bonusPoint;
    bonusPoint--;
  });

  weekScores.groups = weekScores.groups.map((group) => {
    const updatedGroup = groupsHaveBonus.find(
      (bonusGroup) => bonusGroup.groupName === group.groupName
    );

    if (updatedGroup) {
      return { ...group, rankingBonus: updatedGroup.rankingBonus };
    }

    return group;
  });

  await weekScores.save();

  weekScores.groups.forEach(async (group) => {
    const increasedScore = group.accept
      ? group.acs.filter((ac) => ac).length + group.rankingBonus
      : 0;

    const groupScore = await GroupScore.findOne<GroupScoreInterface>({
      groupName: group.groupName,
    });

    if (groupScore) {
      groupScore.score += increasedScore;
      groupScore.achieveGifts = groupScore.achieveGifts && increasedScore > 0;
      await groupScore.save();
    }
  });

  return {
    success: true,
  };
};

const isEligibleForRankingBonus = (acs: boolean[], numberOfACs: number) => {
  return acs.filter((ac) => ac).length / numberOfACs > 0.5;
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

export const updateResults = async (
  week: number,
  groupIndex: number,
  isGivingMark: boolean,
  acs?: boolean[]
): Promise<ServerActionResponse> => {
  await connectDB();
  const weekScores = await WeeklyScore.findOne<WeeklyScoreInterface>({
    week,
  }).exec();

  if (!weekScores || groupIndex < 0 || groupIndex >= weekScores.groups.length) {
    return {
      success: false,
    };
  }

  const updatedGroup = weekScores.groups[groupIndex];

  if (isGivingMark) {
    updatedGroup.acs = acs ?? updatedGroup.acs;
  } else {
    updatedGroup.accept = !updatedGroup.accept;
  }

  weekScores.groups[groupIndex] = updatedGroup;

  await weekScores.save();

  return {
    success: true,
  };
};
