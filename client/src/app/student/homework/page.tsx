"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { getStudentHomeworks } from "@/services/homework.service";
import { StudentHomework, SubmissionStatus } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, BookOpen, CalendarDays } from "lucide-react";

const statusConfig: Record<
  SubmissionStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline"; className: string }
> = {
  in_progress: {
    label: "In Progress",
    variant: "outline",
    className: "border-amber-500/50 text-amber-600 bg-amber-500/10",
  },
  submitted: {
    label: "Submitted",
    variant: "outline",
    className: "border-blue-500/50 text-blue-600 bg-blue-500/10",
  },
  graded: {
    label: "Graded",
    variant: "outline",
    className: "border-emerald-500/50 text-emerald-600 bg-emerald-500/10",
  },
  returned: {
    label: "Returned",
    variant: "outline",
    className: "border-orange-500/50 text-orange-600 bg-orange-500/10",
  },
};

export default function StudentHomeworkPage() {
  const { user, isLoading: authLoading } = useAuth("student");
  const router = useRouter();
  const [homeworks, setHomeworks] = useState<StudentHomework[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    async function fetchHomeworks() {
      try {
        const data = await getStudentHomeworks();
        setHomeworks(data);
      } catch {
        setError("Failed to load homework");
      } finally {
        setLoading(false);
      }
    }

    fetchHomeworks();
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Homework</h1>
        <p className="text-muted-foreground mt-1">
          All your assigned homework
        </p>
      </div>

      {homeworks.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-lg font-medium">No homework yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Homework assigned by your teachers will appear here
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {homeworks.map((hw) => {
            const cfg = statusConfig[hw.submissionStatus];
            return (
              <Card
                key={hw._id}
                className="cursor-pointer hover:border-primary/30 transition-colors"
                onClick={() => router.push(`/student/homework/${hw._id}`)}
              >
                <CardContent className="flex items-center justify-between p-4">
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium truncate">{hw.title}</h3>
                      <Badge variant={cfg.variant} className={cfg.className}>
                        {cfg.label}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>{hw.classId.name}</span>
                      <span>&middot;</span>
                      <span>{hw.topic}</span>
                      {hw.dueDate && (
                        <>
                          <span>&middot;</span>
                          <span className="flex items-center gap-1">
                            <CalendarDays className="h-3.5 w-3.5" />
                            {new Date(hw.dueDate).toLocaleDateString()}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {hw.submissionStatus === "graded" && hw.grade != null && (
                    <div className="text-right ml-4 shrink-0">
                      <p className="text-2xl font-bold text-emerald-600">
                        {hw.grade}
                      </p>
                      <p className="text-xs text-muted-foreground">Grade</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
