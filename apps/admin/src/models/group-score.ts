import mongoose from "mongoose";

export interface GroupScoreInterface extends mongoose.Document {
  groupName: string;
  scores: number[];
  achieveGift: boolean;
}

const GroupScoreModel = new mongoose.Schema(
  {
    groupName: String,
    scores: [Number],
    achieveGift: Boolean,
  },
  {
    timestamps: true,
    collection: "group_scores",
  }
);

export const GroupScore =
  mongoose.models.GroupScore ||
  mongoose.model<GroupScoreInterface>("GroupScore", GroupScoreModel);
