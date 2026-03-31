import { Request } from "express";
import { Types } from "mongoose";

export type Role = "teacher" | "student";

export type TaskDifficulty = "easy" | "medium" | "hard";

export type SubmissionStatus =
  | "in_progress"
  | "submitted"
  | "graded"
  | "returned";

export type HomeworkStatus = "active" | "closed";

export interface JwtPayload {
  userId: string;
  role: Role;
}

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: Role;
  };
}

export interface HtmlBlock {
  id: string;
  tag: string;
  content: string;
  children: HtmlBlock[];
  attributes?: Record<string, string>;
}

export interface TaskExpectedBlock {
  tag: string;
  content?: string;
  children?: TaskExpectedBlock[];
  attributes?: Record<string, string>;
}

export interface AssignedTask {
  student: Types.ObjectId;
  task: Types.ObjectId;
}

export interface FeedbackAnnotation {
  blockId: string;
  comment: string;
}
