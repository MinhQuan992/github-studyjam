"use server";

import type {
  GoogleSheetsApiResponseError,
  GoogleSheetsApiResponseSuccess,
} from "@lib/definitions";
import type { ServerActionResponse } from "./base-action";
import { WeeklyScore } from "@models/weekly-score";
import connectDB from "@lib/mongodb";

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
      numberOfACs: numberOfACs,
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
  return {
    success: true,
    data: activeWeek,
  };
};
