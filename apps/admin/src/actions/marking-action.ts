"use server";

import type {
  GoogleSheetsApiResponseError,
  GoogleSheetsApiResponseSuccess,
} from "@lib/definitions";
import type { ServerActionResponse } from "./base-action";

export const fetchFormSubmissions = async (
  sheetId: string,
  range: string
): Promise<
  ServerActionResponse<
    GoogleSheetsApiResponseSuccess | GoogleSheetsApiResponseError
  >
> => {
  const response = await fetch(
    `${process.env.GOOGLE_SHEETS_SERVER_URL}/sheet?sheetId=${sheetId}&range=${range}`
  );

  const body =
    response.status === 200
      ? ((await response.json()) as GoogleSheetsApiResponseSuccess)
      : ((await response.json()) as GoogleSheetsApiResponseError);

  // TODO: process further
  return {
    success: response.status === 200,
    data: body,
  };
};
