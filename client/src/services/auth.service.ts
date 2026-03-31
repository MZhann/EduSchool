import api from "@/lib/api";
import { AuthResponse, User } from "@/types";

export async function register(data: {
  name: string;
  email: string;
  password: string;
  role: "teacher" | "student";
}): Promise<AuthResponse> {
  const res = await api.post("/auth/register", data);
  return res.data;
}

export async function login(data: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const res = await api.post("/auth/login", data);
  return res.data;
}

export async function getProfile(): Promise<User> {
  const res = await api.get("/auth/profile");
  return res.data;
}

export async function updateProfile(data: {
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}): Promise<User> {
  const res = await api.put("/auth/profile", data);
  return res.data;
}
