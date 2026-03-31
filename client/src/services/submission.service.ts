import api from "@/lib/api";
import {
  SubmissionItem,
  HtmlBlock,
  ClassStats,
  HomeworkItem,
  TeacherGradeRow,
  StudentGradeRow,
} from "@/types";

export async function getStudentSubmission(homeworkId: string): Promise<{
  submission: SubmissionItem;
  homework: HomeworkItem;
}> {
  const res = await api.get(`/submissions/homework/${homeworkId}`);
  return res.data;
}

export async function saveProgress(
  homeworkId: string,
  data: { blocks: HtmlBlock[]; generatedHtml: string }
): Promise<SubmissionItem> {
  const res = await api.put(`/submissions/homework/${homeworkId}/save`, data);
  return res.data;
}

export async function submitWork(
  homeworkId: string,
  data: { blocks: HtmlBlock[]; generatedHtml: string }
): Promise<SubmissionItem> {
  const res = await api.post(`/submissions/homework/${homeworkId}/submit`, data);
  return res.data;
}

export async function getSubmissionById(
  submissionId: string
): Promise<SubmissionItem> {
  const res = await api.get(`/submissions/${submissionId}`);
  return res.data;
}

export async function gradeSubmission(
  submissionId: string,
  data: {
    grade: number;
    feedback?: string;
    feedbackAnnotations?: { blockId: string; comment: string }[];
  }
): Promise<SubmissionItem> {
  const res = await api.post(`/submissions/${submissionId}/grade`, data);
  return res.data;
}

export async function returnSubmission(
  submissionId: string,
  data: {
    feedback: string;
    feedbackAnnotations?: { blockId: string; comment: string }[];
  }
): Promise<SubmissionItem> {
  const res = await api.post(`/submissions/${submissionId}/return`, data);
  return res.data;
}

export async function getClassStats(classId: string): Promise<ClassStats> {
  const res = await api.get(`/submissions/stats/class/${classId}`);
  return res.data;
}

export async function getTeacherGrades(
  classId?: string
): Promise<TeacherGradeRow[]> {
  const params = classId ? { classId } : {};
  const res = await api.get("/submissions/grades/teacher", { params });
  return res.data;
}

export async function getStudentGrades(): Promise<StudentGradeRow[]> {
  const res = await api.get("/submissions/grades/student");
  return res.data;
}
