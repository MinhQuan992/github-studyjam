import { JWT } from "google-auth-library";
import dotenv from "dotenv";
import { google } from "googleapis";

export const fetcher = async (sheetId: string, range: string) => {
  dotenv.config();
  const scopes = ["https://www.googleapis.com/auth/spreadsheets.readonly"];

  const jwt = new JWT(
    process.env.GOOGLE_SHEETS_API_CLIENT_EMAIL,
    undefined,
    process.env.GOOGLE_SHEETS_API_PRIVATE_KEY!.split(String.raw`\n`).join("\n"),
    scopes
  );

  const sheets = google.sheets({ version: "v4", auth: jwt });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: range,
  });

  return response.data;
};
