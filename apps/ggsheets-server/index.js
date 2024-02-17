import cors from "cors";
import express from "express";
import { fetcher } from "./fetcher.js";
import dotenv from "dotenv";

const app = express();
const port = 5000;
dotenv.config();

app.use(cors({ origin: process.env.ALLOWED_ORIGIN }));

app.get("/sheet", async (req, res) => {
  const sheetId = req.query.sheetId;
  const range = req.query.range;

  if (!sheetId || !range) {
    return res.status(400).json({ error: "Missing sheetId or range." });
  }

  try {
    const data = await fetcher(sheetId, range);
    return res.json({ data: data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => console.log(`Listening on port ${port}`));
