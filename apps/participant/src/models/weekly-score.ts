import mongoose from "mongoose";

export interface WeeklyScoreInterface extends mongoose.Document {
  week: number;
  numberOfACs: number;
  groups: {
    time: string;
    groupName: string;
    submission: string;
    acs: boolean[];
    rankingBonus: number;
    accept: boolean;
  }[];
}

const WeeklyScoreModel = new mongoose.Schema(
  {
    week: Number,
    numberOfACs: Number,
    groups: [
      {
        time: String,
        groupName: String,
        submission: String,
        acs: [Boolean],
        rankingBonus: Number,
        accept: Boolean,
      },
    ],
  },
  {
    timestamps: true,
    collection: "weekly_scores",
  }
);

export const WeeklyScore =
  mongoose.models.WeeklyScore ||
  mongoose.model<WeeklyScoreInterface>("WeeklyScore", WeeklyScoreModel);
