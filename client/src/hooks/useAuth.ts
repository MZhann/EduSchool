"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { Role } from "@/types";

export function useAuth(requiredRole?: Role) {
  const router = useRouter();
  const { user, isLoading, loadFromStorage } = useAuthStore();

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    if (requiredRole && user.role !== requiredRole) {
      router.push(user.role === "teacher" ? "/teacher" : "/student");
    }
  }, [user, isLoading, requiredRole, router]);

  return { user, isLoading };
}
