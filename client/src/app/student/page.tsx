"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { getStudentClasses } from "@/services/class.service";
import { getStudentHomeworks } from "@/services/homework.service";
import { ClassItem, StudentHomework } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderOpen, BookOpen, CheckCircle, Loader2, Clock, ArrowRight } from "lucide-react";

export default function StudentDashboardPage() {
  const { user, isLoading: authLoading } = useAuth("student");
  const router = useRouter();
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [homeworks, setHomeworks] = useState<StudentHomework[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    async function fetchData() {
      try {
        const [classData, hwData] = await Promise.all([
          getStudentClasses(),
          getStudentHomeworks(),
        ]);
        setClasses(classData);
        setHomeworks(hwData);
      } catch {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
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

  const completedCount = homeworks.filter(
    (hw) => hw.submissionStatus === "graded"
  ).length;
  const pendingCount = homeworks.filter(
    (hw) => hw.submissionStatus === "in_progress"
  ).length;

  const stats = [
    {
      label: "Joined Classes",
      value: classes.length,
      icon: FolderOpen,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      borderColor: "border-l-blue-500",
    },
    {
      label: "Assigned Homework",
      value: homeworks.length,
      icon: BookOpen,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      borderColor: "border-l-amber-500",
    },
    {
      label: "Completed",
      value: completedCount,
      icon: CheckCircle,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      borderColor: "border-l-emerald-500",
    },
    {
      label: "In Progress",
      value: pendingCount,
      icon: Clock,
      color: "text-violet-500",
      bg: "bg-violet-500/10",
      borderColor: "border-l-violet-500",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, {user?.name}
        </h1>
        <p className="text-muted-foreground mt-1">
          Here&apos;s an overview of your progress
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className={`border-l-4 ${stat.borderColor}`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {homeworks.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Homework</h2>
            <button
              onClick={() => router.push("/student/homework")}
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="grid gap-3">
            {homeworks.slice(0, 5).map((hw) => (
              <Card
                key={hw._id}
                className="cursor-pointer hover:border-primary/30 hover:shadow-sm transition-all"
                onClick={() => router.push(`/student/homework/${hw._id}`)}
              >
                <CardContent className="flex items-center justify-between p-4">
                  <div className="space-y-1 min-w-0 flex-1">
                    <p className="font-medium">{hw.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {hw.classId?.name ?? hw.classId} &middot; {hw.topic}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusDot status={hw.submissionStatus} />
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatusDot({ status }: { status: string }) {
  const config: Record<string, { color: string; label: string }> = {
    in_progress: { color: "bg-amber-500", label: "In Progress" },
    submitted: { color: "bg-blue-500", label: "Submitted" },
    graded: { color: "bg-emerald-500", label: "Graded" },
    returned: { color: "bg-orange-500", label: "Returned" },
  };

  const { color, label } = config[status] ?? {
    color: "bg-gray-400",
    label: status,
  };

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <div className={`h-2 w-2 rounded-full ${color}`} />
      {label}
    </div>
  );
}
