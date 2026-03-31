"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { getTeacherClasses } from "@/services/class.service";
import { getTeacherHomeworks } from "@/services/homework.service";
import { ClassItem, HomeworkItem } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  ClipboardList,
  Clock,
  ArrowRight,
  BookOpen,
  Loader2,
  AlertCircle,
} from "lucide-react";

export default function TeacherDashboardPage() {
  const { user, isLoading: authLoading } = useAuth("teacher");
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [homeworks, setHomeworks] = useState<HomeworkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    async function fetchData() {
      try {
        const [classData, hwData] = await Promise.all([
          getTeacherClasses(),
          getTeacherHomeworks(),
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
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  const activeHomeworks = homeworks.filter((hw) => hw.status === "active");
  const recentHomeworks = homeworks.slice(0, 5);
  const totalStudents = classes.reduce(
    (sum, cls) => sum + (cls.students?.length || 0),
    0
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {user?.name}
        </h1>
        <p className="text-muted-foreground mt-1">
          Here&apos;s an overview of your teaching activity
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Classes
            </CardTitle>
            <div className="p-2 rounded-lg bg-primary/10">
              <Users className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{classes.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalStudents} student{totalStudents !== 1 ? "s" : ""} enrolled
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Homeworks
            </CardTitle>
            <div className="p-2 rounded-lg bg-amber-500/10">
              <ClipboardList className="h-4 w-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{homeworks.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all classes
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Assignments
            </CardTitle>
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <BookOpen className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeHomeworks.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Currently in progress
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-violet-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Students
            </CardTitle>
            <div className="p-2 rounded-lg bg-violet-500/10">
              <Users className="h-4 w-4 text-violet-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across {classes.length} class{classes.length !== 1 ? "es" : ""}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Homeworks</CardTitle>
            <Link href="/teacher/homework">
              <Button variant="ghost" size="sm">
                View all <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentHomeworks.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No homeworks created yet
              </p>
            ) : (
              <div className="space-y-3">
                {recentHomeworks.map((hw) => (
                  <Link
                    key={hw._id}
                    href={`/teacher/homework/${hw._id}`}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">
                        {hw.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">
                          {hw.topic}
                        </span>
                        {hw.dueDate && (
                          <>
                            <span className="text-xs text-muted-foreground">
                              ·
                            </span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(hw.dueDate).toLocaleDateString()}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <Badge
                      variant={
                        hw.status === "active" ? "default" : "secondary"
                      }
                    >
                      {hw.status}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Your Classes</CardTitle>
            <Link href="/teacher/classes">
              <Button variant="ghost" size="sm">
                View all <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {classes.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No classes created yet
              </p>
            ) : (
              <div className="space-y-3">
                {classes.map((cls) => (
                  <Link
                    key={cls._id}
                    href={`/teacher/classes/${cls._id}`}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium">{cls.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {cls.students?.length || 0} student
                        {(cls.students?.length || 0) !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
