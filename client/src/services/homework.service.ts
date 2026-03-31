import api from "@/lib/api";
import { HomeworkItem, StudentHomework, MonitoringData } from "@/types";

export async function createHomework(data: {
  title: string;
  topic: string;
  classId: string;
  theoryContent?: string;
  dueDate?: string;
}): Promise<HomeworkItem> {
  const res = await api.post("/homework", data);
  return res.data;
}

export async function getTeacherHomeworks(
  classId?: string
): Promise<HomeworkItem[]> {
  const params = classId ? { classId } : {};
  const res = await api.get("/homework/teacher", { params });
  return res.data;
}

export async function getStudentHomeworks(): Promise<StudentHomework[]> {
  const res = await api.get("/homework/student");
  return res.data;
}

export async function getHomeworkById(
  homeworkId: string
): Promise<HomeworkItem> {
  const res = await api.get(`/homework/${homeworkId}`);
  return res.data;
}

export async function getHomeworkMonitoring(
  homeworkId: string
): Promise<MonitoringData> {
  const res = await api.get(`/homework/${homeworkId}/monitoring`);
  return res.data;
}

export async function closeHomework(
  homeworkId: string
): Promise<HomeworkItem> {
  const res = await api.patch(`/homework/${homeworkId}/close`);
  return res.data;
}

export async function getTopics(): Promise<string[]> {
  const res = await api.get("/homework/topics");
  return res.data;
}
