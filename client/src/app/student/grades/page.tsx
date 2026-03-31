"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getStudentGrades } from "@/services/submission.service";
import { StudentGradeRow, SubmissionStatus } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Loader2,
  AlertCircle,
  Award,
  BookOpen,
  CheckCircle,
  TrendingUp,
  CalendarDays,
} from "lucide-react";

const statusConfig: Record<
  SubmissionStatus,
  { label: string; className: string }
> = {
  in_progress: {
    label: "In Progress",
    className: "border-amber-500/50 text-amber-600 bg-amber-500/10",
  },
  submitted: {
    label: "Submitted",
    className: "border-blue-500/50 text-blue-600 bg-blue-500/10",
  },
  graded: {
    label: "Graded",
    className: "border-emerald-500/50 text-emerald-600 bg-emerald-500/10",
  },
  returned: {
    label: "Returned",
    className: "border-orange-500/50 text-orange-600 bg-orange-500/10",
  },
};

function getGradeColor(grade: number | null): string {
  if (grade === null) return "text-muted-foreground";
  if (grade >= 80) return "text-emerald-600";
  if (grade >= 60) return "text-amber-600";
  return "text-red-600";
}

export default function StudentGradesPage() {
  const { user, isLoading: authLoading } = useAuth("student");
  const [grades, setGrades] = useState<StudentGradeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    async function fetchGrades() {
      try {
        const data = await getStudentGrades();
        setGrades(data);
      } catch {
        setError("Failed to load grades");
      } finally {
        setLoading(false);
      }
    }

    fetchGrades();
  }, [user]);

  const stats = useMemo(() => {
    const graded = grades.filter((g) => g.grade !== null);
    const avg =
      graded.length > 0
        ? Math.round(
            graded.reduce((sum, g) => sum + (g.grade ?? 0), 0) / graded.length
          )
        : null;
    const completed = grades.filter((g) => g.status === "graded").length;
    return {
      total: grades.length,
      completed,
      gradedCount: graded.length,
      average: avg,
    };
  }, [grades]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="animate-fade-in-down">
        <h1 className="text-2xl font-bold tracking-tight">My Grades</h1>
        <p className="text-muted-foreground mt-1">
          Track your performance across all homework
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total Homework",
            value: stats.total,
            icon: BookOpen,
            gradient: "from-blue-500 to-cyan-500",
            iconBg: "bg-blue-500/10",
            iconColor: "text-blue-500",
          },
          {
            label: "Completed",
            value: stats.completed,
            icon: CheckCircle,
            gradient: "from-emerald-500 to-teal-500",
            iconBg: "bg-emerald-500/10",
            iconColor: "text-emerald-500",
          },
          {
            label: "Graded",
            value: stats.gradedCount,
            icon: TrendingUp,
            gradient: "from-violet-500 to-purple-600",
            iconBg: "bg-violet-500/10",
            iconColor: "text-violet-500",
          },
          {
            label: "Average Grade",
            value: stats.average !== null ? `${stats.average}%` : "—",
            icon: Award,
            gradient: "from-amber-500 to-orange-500",
            iconBg: "bg-amber-500/10",
            iconColor: "text-amber-500",
          },
        ].map((stat, i) => (
          <Card
            key={stat.label}
            className={`animate-fade-in-up stagger-${i + 1} overflow-hidden border-0 shadow-md`}
          >
            <div className={`h-1.5 bg-linear-to-r ${stat.gradient}`} />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <div className={`p-2.5 rounded-xl ${stat.iconBg}`}>
                <stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight">
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {grades.length === 0 ? (
        <Card className="animate-fade-in-up stagger-5">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Award className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-1">No grades yet</h3>
            <p className="text-sm text-muted-foreground">
              Your grades will appear here once teachers grade your submissions
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="animate-fade-in-up stagger-5 overflow-hidden border-0 shadow-md">
          <div className="h-1.5 bg-linear-to-r from-indigo-500 to-blue-500" />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Homework</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Topic</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Grade</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Submitted</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {grades.map((g, i) => {
                const cfg = statusConfig[g.status];
                return (
                  <TableRow key={g._id}>
                    <TableCell className="text-muted-foreground">
                      {i + 1}
                    </TableCell>
                    <TableCell className="font-medium text-sm max-w-[200px] truncate">
                      {g.homeworkTitle}
                    </TableCell>
                    <TableCell className="text-sm">{g.className}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {g.homeworkTopic}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className={cfg.className}>
                        {cfg.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <span
                        className={`font-semibold ${getGradeColor(g.grade)}`}
                      >
                        {g.grade !== null ? `${g.grade}%` : "—"}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {g.dueDate ? (
                        <span className="flex items-center gap-1">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {new Date(g.dueDate).toLocaleDateString()}
                        </span>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {g.submittedAt
                        ? new Date(g.submittedAt).toLocaleDateString()
                        : "—"}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
