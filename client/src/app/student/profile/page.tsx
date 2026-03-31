"use client";

import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import ProfilePage from "@/components/profile/ProfilePage";

export default function StudentProfilePage() {
  const { isLoading } = useAuth("student");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return <ProfilePage />;
}
