import mongoose from "mongoose";

export interface GroupScoreInterface extends mongoose.Document {
  groupName: string;
  score: number;
  achieveGifts: boolean;
}

const GroupScoreModel = new mongoose.Schema(
  {
    groupName: String,
    score: Number,
    achieveGifts: Boolean,
  },
  {
    timestamps: true,
    collection: "group_scores",
  }
);

export const GroupScore =
  mongoose.models.GroupScore ||
  mongoose.model<GroupScoreInterface>("GroupScore", GroupScoreModel);
