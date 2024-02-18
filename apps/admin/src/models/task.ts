import mongoose from "mongoose";

export interface TaskInterface extends mongoose.Document {
  image: string;
  active: boolean;
  week: number;
  numberOfACs: number;
}

const TaskModel = new mongoose.Schema(
  {
    image: String,
    active: Boolean,
    week: Number,
    numberOfACs: Number,
  },
  {
    timestamps: true,
    collection: "tasks",
  }
);

export const Task =
  mongoose.models.Task || mongoose.model<TaskInterface>("Task", TaskModel);
