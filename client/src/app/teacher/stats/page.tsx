"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getTeacherClasses } from "@/services/class.service";
import { getClassStats } from "@/services/submission.service";
import { ClassItem, ClassStats, StudentStats } from "@/types";
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
  BarChart3,
  Users,
  BookOpen,
  Award,
  Loader2,
  AlertCircle,
  TrendingUp,
} from "lucide-react";

export default function TeacherStatsPage() {
  const { user, isLoading: authLoading } = useAuth("teacher");
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [stats, setStats] = useState<ClassStats | null>(null);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [loadingStats, setLoadingStats] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    async function fetchClasses() {
      try {
        const data = await getTeacherClasses();
        setClasses(data);
        if (data.length > 0) {
          setSelectedClassId(data[0]._id);
        }
      } catch {
        setError("Failed to load classes");
      } finally {
        setLoadingClasses(false);
      }
    }

    fetchClasses();
  }, [user]);

  useEffect(() => {
    if (!selectedClassId) return;

    async function fetchStats() {
      setLoadingStats(true);
      setStats(null);
      try {
        const data = await getClassStats(selectedClassId);
        setStats(data);
      } catch {
        setError("Failed to load statistics");
      } finally {
        setLoadingStats(false);
      }
    }

    fetchStats();
  }, [selectedClassId]);

  function getGradeColor(avg: number | null): string {
    if (avg === null) return "text-muted-foreground";
    if (avg >= 80) return "text-green-500";
    if (avg >= 60) return "text-yellow-500";
    return "text-red-500";
  }

  function getProgressPercentage(submitted: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((submitted / total) * 100);
  }

  if (authLoading || loadingClasses) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error && classes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  const overallAvg =
    stats && stats.studentStats.length > 0
      ? stats.studentStats
          .filter((s) => s.averageGrade !== null)
          .reduce((sum, s) => sum + (s.averageGrade || 0), 0) /
          (stats.studentStats.filter((s) => s.averageGrade !== null).length || 1)
      : null;

  const totalSubmitted =
    stats?.studentStats.reduce((sum, s) => sum + s.submittedCount, 0) || 0;
  const totalGraded =
    stats?.studentStats.reduce((sum, s) => sum + s.gradedCount, 0) || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Statistics</h1>
        <p className="text-muted-foreground mt-1">
          View student performance by class
        </p>
      </div>

      <div className="flex items-center gap-3">
        <label className="text-sm font-medium">Class:</label>
        <select
          value={selectedClassId}
          onChange={(e) => setSelectedClassId(e.target.value)}
          className="flex h-9 w-full sm:w-[300px] rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">Select a class</option>
          {classes.map((cls) => (
            <option key={cls._id} value={cls._id}>
              {cls.name} ({cls.students?.length || 0} students)
            </option>
          ))}
        </select>
      </div>

      {classes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-1">No classes yet</h3>
            <p className="text-sm text-muted-foreground">
              Create a class first to view statistics
            </p>
          </CardContent>
        </Card>
      ) : loadingStats ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : stats ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Students
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.studentStats.length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Homeworks
                </CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.totalHomeworks}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Submissions
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalSubmitted}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {totalGraded} graded
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Class Average
                </CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div
                  className={`text-2xl font-bold ${getGradeColor(overallAvg)}`}
                >
                  {overallAvg !== null ? `${Math.round(overallAvg)}%` : "—"}
                </div>
              </CardContent>
            </Card>
          </div>

          {stats.studentStats.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="h-10 w-10 text-muted-foreground mb-3" />
                <p className="text-muted-foreground text-sm">
                  No student data available for this class
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Student Performance</CardTitle>
              </CardHeader>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-center">Assignments</TableHead>
                    <TableHead className="text-center">Submitted</TableHead>
                    <TableHead className="text-center">Graded</TableHead>
                    <TableHead className="text-center">Completion</TableHead>
                    <TableHead className="text-center">Average Grade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.studentStats.map((student, index) => (
                    <TableRow key={student.studentId}>
                      <TableCell className="text-muted-foreground">
                        {index + 1}
                      </TableCell>
                      <TableCell className="font-medium">
                        {student.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {student.email}
                      </TableCell>
                      <TableCell className="text-center">
                        {student.totalAssignments}
                      </TableCell>
                      <TableCell className="text-center">
                        {student.submittedCount}
                      </TableCell>
                      <TableCell className="text-center">
                        {student.gradedCount}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-16 h-2 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full rounded-full bg-primary transition-all"
                              style={{
                                width: `${getProgressPercentage(
                                  student.submittedCount,
                                  student.totalAssignments
                                )}%`,
                              }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground w-10">
                            {getProgressPercentage(
                              student.submittedCount,
                              student.totalAssignments
                            )}
                            %
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <span
                          className={`font-semibold ${getGradeColor(
                            student.averageGrade
                          )}`}
                        >
                          {student.averageGrade !== null
                            ? `${Math.round(student.averageGrade)}%`
                            : "—"}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </>
      ) : null}
    </div>
  );
}
