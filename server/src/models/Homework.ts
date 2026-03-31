import mongoose, { Schema, Document, Types } from "mongoose";
import { HomeworkStatus, AssignedTask } from "../types";

export interface IHomework extends Document {
  _id: Types.ObjectId;
  title: string;
  topic: string;
  classId: Types.ObjectId;
  teacher: Types.ObjectId;
  theoryContent: string;
  assignedTasks: AssignedTask[];
  dueDate?: Date;
  status: HomeworkStatus;
  createdAt: Date;
  updatedAt: Date;
}

const assignedTaskSchema = new Schema(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    task: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
  },
  { _id: false }
);

const homeworkSchema = new Schema<IHomework>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    topic: {
      type: String,
      required: true,
    },
    classId: {
      type: Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    teacher: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    theoryContent: {
      type: String,
      default: "",
    },
    assignedTasks: {
      type: [assignedTaskSchema],
      default: [],
    },
    dueDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["active", "closed"],
      default: "active",
    },
  },
  { timestamps: true }
);

homeworkSchema.index({ classId: 1 });
homeworkSchema.index({ teacher: 1 });

export const Homework = mongoose.model<IHomework>("Homework", homeworkSchema);
