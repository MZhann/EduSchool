import api from "@/lib/api";
import { ClassItem } from "@/types";

export async function createClass(data: {
  name: string;
  joinPassword: string;
}): Promise<ClassItem> {
  const res = await api.post("/classes", data);
  return res.data;
}

export async function getTeacherClasses(): Promise<ClassItem[]> {
  const res = await api.get("/classes/teacher");
  return res.data;
}

export async function getClassById(classId: string): Promise<ClassItem> {
  const res = await api.get(`/classes/teacher/${classId}`);
  return res.data;
}

export async function joinClass(data: {
  joinCode: string;
  joinPassword: string;
}): Promise<{ message: string; class: ClassItem }> {
  const res = await api.post("/classes/join", data);
  return res.data;
}

export async function getStudentClasses(): Promise<ClassItem[]> {
  const res = await api.get("/classes/student");
  return res.data;
}

export async function removeStudent(
  classId: string,
  studentId: string
): Promise<ClassItem> {
  const res = await api.delete(`/classes/${classId}/students/${studentId}`);
  return res.data;
}
