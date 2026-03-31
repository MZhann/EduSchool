"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getTeacherClasses } from "@/services/class.service";
import { getTeacherGrades } from "@/services/submission.service";
import { ClassItem, TeacherGradeRow, SubmissionStatus } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  Download,
  Search,
  Award,
  Users,
  BookOpen,
  TrendingUp,
} from "lucide-react";
import * as XLSX from "xlsx";

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

export default function TeacherGradesPage() {
  const { user, isLoading: authLoading } = useAuth("teacher");
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [grades, setGrades] = useState<TeacherGradeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!user) return;

    async function fetchClasses() {
      try {
        const data = await getTeacherClasses();
        setClasses(data);
      } catch {
        setError("Failed to load classes");
      }
    }

    fetchClasses();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    fetchGrades();
  }, [user, selectedClassId]);

  async function fetchGrades() {
    setLoading(true);
    try {
      const data = await getTeacherGrades(
        selectedClassId || undefined
      );
      setGrades(data);
    } catch {
      setError("Failed to load grades");
    } finally {
      setLoading(false);
    }
  }

  const filteredGrades = useMemo(() => {
    if (!searchQuery) return grades;
    const q = searchQuery.toLowerCase();
    return grades.filter(
      (g) =>
        g.studentName.toLowerCase().includes(q) ||
        g.studentEmail.toLowerCase().includes(q) ||
        g.homeworkTitle.toLowerCase().includes(q)
    );
  }, [grades, searchQuery]);

  const stats = useMemo(() => {
    const graded = grades.filter((g) => g.grade !== null);
    const avg =
      graded.length > 0
        ? Math.round(
            graded.reduce((sum, g) => sum + (g.grade ?? 0), 0) / graded.length
          )
        : null;
    const uniqueStudents = new Set(grades.map((g) => g.studentEmail)).size;
    return {
      total: grades.length,
      gradedCount: graded.length,
      average: avg,
      uniqueStudents,
    };
  }, [grades]);

  function exportToExcel() {
    const rows = filteredGrades.map((g, i) => ({
      "#": i + 1,
      Student: g.studentName,
      Email: g.studentEmail,
      Class: g.className,
      Homework: g.homeworkTitle,
      Topic: g.homeworkTopic,
      Status: statusConfig[g.status]?.label || g.status,
      Grade: g.grade ?? "—",
      "Submitted At": g.submittedAt
        ? new Date(g.submittedAt).toLocaleString()
        : "—",
      "Graded At": g.gradedAt
        ? new Date(g.gradedAt).toLocaleString()
        : "—",
      Feedback: g.feedback || "",
    }));

    const ws = XLSX.utils.json_to_sheet(rows);

    const colWidths = [
      { wch: 4 },
      { wch: 20 },
      { wch: 25 },
      { wch: 20 },
      { wch: 25 },
      { wch: 15 },
      { wch: 12 },
      { wch: 8 },
      { wch: 20 },
      { wch: 20 },
      { wch: 30 },
    ];
    ws["!cols"] = colWidths;

    const wb = XLSX.utils.book_new();
    const classLabel = selectedClassId
      ? classes.find((c) => c._id === selectedClassId)?.name || "Class"
      : "All Classes";
    XLSX.utils.book_append_sheet(wb, ws, classLabel.slice(0, 31));
    XLSX.writeFile(
      wb,
      `Grades_${classLabel.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  }

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error && grades.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between animate-fade-in-down">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Grades</h1>
          <p className="text-muted-foreground mt-1">
            View and export student grades
          </p>
        </div>
        <Button onClick={exportToExcel} disabled={filteredGrades.length === 0}>
          <Download className="h-4 w-4 mr-2" />
          Export Excel
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total Submissions",
            value: stats.total,
            icon: BookOpen,
            gradient: "from-blue-500 to-cyan-500",
            iconBg: "bg-blue-500/10",
            iconColor: "text-blue-500",
          },
          {
            label: "Students",
            value: stats.uniqueStudents,
            icon: Users,
            gradient: "from-violet-500 to-purple-600",
            iconBg: "bg-violet-500/10",
            iconColor: "text-violet-500",
          },
          {
            label: "Graded",
            value: stats.gradedCount,
            icon: TrendingUp,
            gradient: "from-emerald-500 to-teal-500",
            iconBg: "bg-emerald-500/10",
            iconColor: "text-emerald-500",
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

      <div className="flex flex-col sm:flex-row gap-3 animate-fade-in-up stagger-5">
        <select
          value={selectedClassId}
          onChange={(e) => setSelectedClassId(e.target.value)}
          className="flex h-9 w-full sm:w-[260px] rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">All Classes</option>
          {classes.map((cls) => (
            <option key={cls._id} value={cls._id}>
              {cls.name}
            </option>
          ))}
        </select>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by student, email, or homework..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredGrades.length === 0 ? (
        <Card className="animate-fade-in-up">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Award className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-1">No grades yet</h3>
            <p className="text-sm text-muted-foreground">
              {grades.length === 0
                ? "Grades will appear here once students submit homework"
                : "No results match your search"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="animate-fade-in-up stagger-6 overflow-hidden border-0 shadow-md">
          <div className="h-1.5 bg-linear-to-r from-indigo-500 to-blue-500" />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Homework</TableHead>
                <TableHead>Topic</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Grade</TableHead>
                <TableHead>Submitted</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGrades.map((g, i) => {
                const cfg = statusConfig[g.status];
                return (
                  <TableRow key={g._id}>
                    <TableCell className="text-muted-foreground">
                      {i + 1}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{g.studentName}</p>
                        <p className="text-xs text-muted-foreground">
                          {g.studentEmail}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{g.className}</TableCell>
                    <TableCell className="text-sm max-w-[200px] truncate">
                      {g.homeworkTitle}
                    </TableCell>
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
