import mongoose, { Schema, Document, Types } from "mongoose";
import { SubmissionStatus, HtmlBlock, FeedbackAnnotation } from "../types";

export interface ISubmission extends Document {
  _id: Types.ObjectId;
  homework: Types.ObjectId;
  task: Types.ObjectId;
  student: Types.ObjectId;
  blocks: HtmlBlock[];
  generatedHtml: string;
  status: SubmissionStatus;
  grade?: number;
  feedback?: string;
  feedbackAnnotations: FeedbackAnnotation[];
  submittedAt?: Date;
  gradedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const htmlBlockSchema = new Schema(
  {
    id: { type: String, required: true },
    tag: { type: String, required: true },
    content: { type: String, default: "" },
    children: { type: [Schema.Types.Mixed], default: [] },
    attributes: { type: Map, of: String, default: {} },
  },
  { _id: false }
);

const feedbackAnnotationSchema = new Schema(
  {
    blockId: { type: String, required: true },
    comment: { type: String, required: true },
  },
  { _id: false }
);

const submissionSchema = new Schema<ISubmission>(
  {
    homework: {
      type: Schema.Types.ObjectId,
      ref: "Homework",
      required: true,
    },
    task: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    student: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    blocks: {
      type: [htmlBlockSchema],
      default: [],
    },
    generatedHtml: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["in_progress", "submitted", "graded", "returned"],
      default: "in_progress",
    },
    grade: {
      type: Number,
      min: 0,
      max: 100,
    },
    feedback: {
      type: String,
      default: "",
    },
    feedbackAnnotations: {
      type: [feedbackAnnotationSchema],
      default: [],
    },
    submittedAt: Date,
    gradedAt: Date,
  },
  { timestamps: true }
);

submissionSchema.index({ homework: 1, student: 1 }, { unique: true });
submissionSchema.index({ student: 1 });
submissionSchema.index({ homework: 1 });

export const Submission = mongoose.model<ISubmission>(
  "Submission",
  submissionSchema
);
