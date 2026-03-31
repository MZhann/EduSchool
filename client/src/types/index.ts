export type Role = "teacher" | "student";
export type SubmissionStatus = "in_progress" | "submitted" | "graded" | "returned";
export type HomeworkStatus = "active" | "closed";
export type TaskDifficulty = "easy" | "medium" | "hard";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ClassItem {
  _id: string;
  name: string;
  teacher: { _id: string; name: string; email: string } | string;
  joinCode: string;
  joinPassword: string;
  students: { _id: string; name: string; email: string }[];
  createdAt: string;
}

export interface TaskItem {
  _id: string;
  title: string;
  description: string;
  instruction: string;
  imageUrl?: string;
  topic: string;
  difficulty: TaskDifficulty;
  expectedBlocks: ExpectedBlock[];
  expectedHtml: string;
  availableTags: string[];
}

export interface ExpectedBlock {
  tag: string;
  content?: string;
  children?: ExpectedBlock[];
  attributes?: Record<string, string>;
}

export interface HtmlBlock {
  id: string;
  tag: string;
  content: string;
  children: HtmlBlock[];
  attributes: Record<string, string>;
}

export interface HomeworkItem {
  _id: string;
  title: string;
  topic: string;
  classId: { _id: string; name: string } | string;
  teacher: string;
  theoryContent: string;
  assignedTasks: {
    student: { _id: string; name: string; email: string } | string;
    task: TaskItem | string;
  }[];
  dueDate?: string;
  status: HomeworkStatus;
  createdAt: string;
}

export interface StudentHomework {
  _id: string;
  title: string;
  topic: string;
  classId: { _id: string; name: string };
  theoryContent: string;
  dueDate?: string;
  status: HomeworkStatus;
  taskId: string;
  submissionStatus: SubmissionStatus;
  grade?: number;
  createdAt: string;
}

export interface SubmissionItem {
  _id: string;
  homework: HomeworkItem | string;
  task: TaskItem | string;
  student: { _id: string; name: string; email: string } | string;
  blocks: HtmlBlock[];
  generatedHtml: string;
  status: SubmissionStatus;
  grade?: number;
  feedback?: string;
  feedbackAnnotations: FeedbackAnnotation[];
  submittedAt?: string;
  gradedAt?: string;
  createdAt: string;
}

export interface FeedbackAnnotation {
  blockId: string;
  comment: string;
}

export interface StudentStats {
  studentId: string;
  name: string;
  email: string;
  totalAssignments: number;
  submittedCount: number;
  gradedCount: number;
  averageGrade: number | null;
}

export interface ClassStats {
  totalHomeworks: number;
  studentStats: StudentStats[];
}

export interface MonitoringData {
  homework: HomeworkItem;
  submissions: SubmissionItem[];
}
