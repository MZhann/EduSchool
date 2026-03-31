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

  const statCards = [
    {
      label: "Total Classes",
      value: classes.length,
      subtitle: `${totalStudents} student${totalStudents !== 1 ? "s" : ""} enrolled`,
      icon: Users,
      gradient: "from-blue-500 to-blue-600",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-500",
    },
    {
      label: "Total Homeworks",
      value: homeworks.length,
      subtitle: "Across all classes",
      icon: ClipboardList,
      gradient: "from-amber-500 to-orange-500",
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-500",
    },
    {
      label: "Active Assignments",
      value: activeHomeworks.length,
      subtitle: "Currently in progress",
      icon: BookOpen,
      gradient: "from-emerald-500 to-teal-500",
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-500",
    },
    {
      label: "Total Students",
      value: totalStudents,
      subtitle: `Across ${classes.length} class${classes.length !== 1 ? "es" : ""}`,
      icon: Users,
      gradient: "from-violet-500 to-purple-600",
      iconBg: "bg-violet-500/10",
      iconColor: "text-violet-500",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="animate-fade-in-down">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {user?.name}
        </h1>
        <p className="text-muted-foreground mt-1">
          Here&apos;s an overview of your teaching activity
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => (
          <Card
            key={stat.label}
            className={`animate-fade-in-up stagger-${i + 1} overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow duration-300`}
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
              <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.subtitle}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="animate-fade-in-up stagger-5 overflow-hidden border-0 shadow-md">
          <div className="h-1.5 bg-linear-to-r from-indigo-500 to-blue-500" />
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
                {recentHomeworks.map((hw, i) => (
                  <Link
                    key={hw._id}
                    href={`/teacher/homework/${hw._id}`}
                    className={`animate-fade-in-up stagger-${i + 1} flex items-center justify-between p-3 rounded-xl border hover:bg-muted/50 hover:border-primary/20 transition-all duration-200`}
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

        <Card className="animate-fade-in-up stagger-6 overflow-hidden border-0 shadow-md">
          <div className="h-1.5 bg-linear-to-r from-emerald-500 to-green-500" />
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
                {classes.map((cls, i) => (
                  <Link
                    key={cls._id}
                    href={`/teacher/classes/${cls._id}`}
                    className={`animate-fade-in-up stagger-${i + 1} flex items-center justify-between p-3 rounded-xl border hover:bg-muted/50 hover:border-primary/20 transition-all duration-200`}
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
