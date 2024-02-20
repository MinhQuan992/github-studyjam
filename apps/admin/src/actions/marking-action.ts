"use server";

import type {
  GoogleSheetsApiResponseError,
  GoogleSheetsApiResponseSuccess,
} from "@lib/definitions";
import type { WeeklyScoreInterface } from "@models/weekly-score";
import { WeeklyScore } from "@models/weekly-score";
import connectDB from "@lib/mongodb";
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
  // TODO: implement this function
  await connectDB();
  return {
    success: true,
    data: activeWeek,
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
