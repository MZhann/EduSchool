import mongoose, { Schema, Document, Types } from "mongoose";
import { TaskDifficulty, TaskExpectedBlock } from "../types";

export interface ITask extends Document {
  _id: Types.ObjectId;
  title: string;
  description: string;
  instruction: string;
  imageUrl?: string;
  topic: string;
  difficulty: TaskDifficulty;
  expectedBlocks: TaskExpectedBlock[];
  expectedHtml: string;
  availableTags: string[];
  createdAt: Date;
}

const expectedBlockSchema = new Schema(
  {
    tag: { type: String, required: true },
    content: { type: String, default: "" },
    children: { type: [Schema.Types.Mixed], default: [] },
    attributes: { type: Map, of: String, default: {} },
  },
  { _id: false }
);

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    instruction: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      default: "",
    },
    topic: {
      type: String,
      required: true,
      index: true,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },
    expectedBlocks: {
      type: [expectedBlockSchema],
      required: true,
    },
    expectedHtml: {
      type: String,
      required: true,
    },
    availableTags: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true }
);

taskSchema.index({ topic: 1, difficulty: 1 });

export const Task = mongoose.model<ITask>("Task", taskSchema);
