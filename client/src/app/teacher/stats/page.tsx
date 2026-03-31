"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getTeacherClasses } from "@/services/class.service";
import { getClassStats } from "@/services/submission.service";
import { ClassItem, ClassStats } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  RadialBarChart,
  RadialBar,
} from "recharts";

const CHART_COLORS = [
  "#6366f1",
  "#06b6d4",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
];

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

function GradeBarChart({ studentStats }: { studentStats: ClassStats["studentStats"] }) {
  const data = studentStats
    .filter((s) => s.averageGrade !== null)
    .map((s) => ({
      name: s.name.length > 12 ? s.name.slice(0, 12) + "…" : s.name,
      fullName: s.name,
      grade: Math.round(s.averageGrade!),
    }))
    .sort((a, b) => b.grade - a.grade);

  if (data.length === 0) return null;

  return (
    <Card className="animate-fade-in-up stagger-5 overflow-hidden border-0 shadow-md">
      <div className="h-1.5 bg-linear-to-r from-indigo-500 to-violet-500" />
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-indigo-500" />
          Оқушылардың орташа бағалары
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                interval={0}
                angle={data.length > 6 ? -30 : 0}
                textAnchor={data.length > 6 ? "end" : "middle"}
                height={data.length > 6 ? 60 : 30}
              />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0].payload;
                  return (
                    <div className="bg-card border rounded-lg shadow-lg px-3 py-2 text-sm">
                      <p className="font-medium">{d.fullName}</p>
                      <p className="text-muted-foreground">
                        Баға: <span className="font-semibold text-foreground">{d.grade}%</span>
                      </p>
                    </div>
                  );
                }}
              />
              <Bar dataKey="grade" radius={[6, 6, 0, 0]} maxBarSize={50}>
                {data.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function SubmissionPieChart({ studentStats }: { studentStats: ClassStats["studentStats"] }) {
  const totalAssignments = studentStats.reduce((s, st) => s + st.totalAssignments, 0);
  const totalSubmitted = studentStats.reduce((s, st) => s + st.submittedCount, 0);
  const totalGraded = studentStats.reduce((s, st) => s + st.gradedCount, 0);
  const notSubmitted = totalAssignments - totalSubmitted;
  const submittedPending = totalSubmitted - totalGraded;

  const data = [
    { name: "Бағаланды", value: totalGraded, color: "#10b981" },
    { name: "Тексеруді күтуде", value: submittedPending, color: "#3b82f6" },
    { name: "Жіберілмеген", value: notSubmitted, color: "#94a3b8" },
  ].filter((d) => d.value > 0);

  if (data.length === 0) return null;

  return (
    <Card className="animate-fade-in-up stagger-6 overflow-hidden border-0 shadow-md">
      <div className="h-1.5 bg-linear-to-r from-emerald-500 to-teal-500" />
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-emerald-500" />
          Жұмыстар шолуы
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={100}
                paddingAngle={4}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0].payload;
                  return (
                    <div className="bg-card border rounded-lg shadow-lg px-3 py-2 text-sm">
                      <p className="font-medium">{d.name}</p>
                      <p className="text-muted-foreground">
                        Саны: <span className="font-semibold text-foreground">{d.value}</span>
                      </p>
                    </div>
                  );
                }}
              />
              <Legend
                verticalAlign="bottom"
                formatter={(value: string) => (
                  <span className="text-sm text-foreground">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function GradeDistributionChart({ studentStats }: { studentStats: ClassStats["studentStats"] }) {
  const graded = studentStats.filter((s) => s.averageGrade !== null);

  const buckets = [
    { range: "90-100", min: 90, max: 100, color: "#10b981" },
    { range: "80-89", min: 80, max: 89, color: "#06b6d4" },
    { range: "70-79", min: 70, max: 79, color: "#6366f1" },
    { range: "60-69", min: 60, max: 69, color: "#f59e0b" },
    { range: "< 60", min: 0, max: 59, color: "#ef4444" },
  ];

  const data = buckets.map((b) => ({
    range: b.range,
    count: graded.filter(
      (s) => s.averageGrade! >= b.min && s.averageGrade! <= b.max
    ).length,
    color: b.color,
  }));

  if (graded.length === 0) return null;

  return (
    <Card className="animate-fade-in-up stagger-7 overflow-hidden border-0 shadow-md">
      <div className="h-1.5 bg-linear-to-r from-amber-500 to-orange-500" />
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-amber-500" />
          Бағалар бөлінісі
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" horizontal={false} />
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
              <YAxis
                dataKey="range"
                type="category"
                width={55}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0].payload;
                  return (
                    <div className="bg-card border rounded-lg shadow-lg px-3 py-2 text-sm">
                      <p className="font-medium">{d.range}%</p>
                      <p className="text-muted-foreground">
                        Оқушылар: <span className="font-semibold text-foreground">{d.count}</span>
                      </p>
                    </div>
                  );
                }}
              />
              <Bar dataKey="count" radius={[0, 6, 6, 0]} maxBarSize={32}>
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function CompletionRadialChart({ studentStats }: { studentStats: ClassStats["studentStats"] }) {
  const totalAssignments = studentStats.reduce((s, st) => s + st.totalAssignments, 0);
  const totalSubmitted = studentStats.reduce((s, st) => s + st.submittedCount, 0);
  const totalGraded = studentStats.reduce((s, st) => s + st.gradedCount, 0);

  const completionRate = totalAssignments > 0 ? Math.round((totalSubmitted / totalAssignments) * 100) : 0;
  const gradingRate = totalSubmitted > 0 ? Math.round((totalGraded / totalSubmitted) * 100) : 0;

  const data = [
    { name: "Бағалау көрсеткіші", value: gradingRate, fill: "#8b5cf6" },
    { name: "Аяқтау көрсеткіші", value: completionRate, fill: "#06b6d4" },
  ];

  return (
    <Card className="animate-fade-in-up stagger-8 overflow-hidden border-0 shadow-md">
      <div className="h-1.5 bg-linear-to-r from-cyan-500 to-blue-500" />
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-cyan-500" />
          Көрсеткіштер шолуы
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="30%"
              outerRadius="90%"
              data={data}
              startAngle={180}
              endAngle={0}
            >
              <RadialBar
                background={{ fill: "hsl(var(--muted))" }}
                dataKey="value"
                cornerRadius={8}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0].payload;
                  return (
                    <div className="bg-card border rounded-lg shadow-lg px-3 py-2 text-sm">
                      <p className="font-medium">{d.name}</p>
                      <p className="text-muted-foreground">
                        <span className="font-semibold text-foreground">{d.value}%</span>
                      </p>
                    </div>
                  );
                }}
              />
              <Legend
                verticalAlign="bottom"
                formatter={(value: string) => (
                  <span className="text-sm text-foreground">{value}</span>
                )}
              />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-8 -mt-2 text-center">
          <div>
            <p className="text-2xl font-bold text-cyan-500">{completionRate}%</p>
            <p className="text-xs text-muted-foreground">Аяқтау</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-violet-500">{gradingRate}%</p>
            <p className="text-xs text-muted-foreground">Бағалау</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

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
        setError("Сыныптарды жүктеу сәтсіз аяқталды");
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
        setError("Статистиканы жүктеу сәтсіз аяқталды");
      } finally {
        setLoadingStats(false);
      }
    }

    fetchStats();
  }, [selectedClassId]);

  const overallAvg = useMemo(() => {
    if (!stats || stats.studentStats.length === 0) return null;
    const graded = stats.studentStats.filter((s) => s.averageGrade !== null);
    if (graded.length === 0) return null;
    return graded.reduce((sum, s) => sum + (s.averageGrade || 0), 0) / graded.length;
  }, [stats]);

  const totalSubmitted = useMemo(
    () => stats?.studentStats.reduce((sum, s) => sum + s.submittedCount, 0) || 0,
    [stats]
  );
  const totalGraded = useMemo(
    () => stats?.studentStats.reduce((sum, s) => sum + s.gradedCount, 0) || 0,
    [stats]
  );

  const statCards = [
    {
      label: "Оқушылар",
      value: stats?.studentStats.length || 0,
      subtitle: null,
      icon: Users,
      gradient: "from-blue-500 to-cyan-500",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-500",
    },
    {
      label: "Барлық тапсырмалар",
      value: stats?.totalHomeworks || 0,
      subtitle: null,
      icon: BookOpen,
      gradient: "from-amber-500 to-orange-500",
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-500",
    },
    {
      label: "Жұмыстар",
      value: totalSubmitted,
      subtitle: `${totalGraded} бағаланды`,
      icon: TrendingUp,
      gradient: "from-emerald-500 to-teal-500",
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-500",
    },
    {
      label: "Сынып орташа бағасы",
      value: overallAvg !== null ? `${Math.round(overallAvg)}%` : "—",
      subtitle: null,
      icon: Award,
      gradient: "from-violet-500 to-purple-600",
      iconBg: "bg-violet-500/10",
      iconColor: "text-violet-500",
      valueColor: getGradeColor(overallAvg),
    },
  ];

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

  return (
    <div className="space-y-6">
      <div className="animate-fade-in-down">
        <h1 className="text-3xl font-bold tracking-tight">Статистика</h1>
        <p className="text-muted-foreground mt-1">
          Сынып бойынша оқушылар үлгерімін көру
        </p>
      </div>

      <div className="flex items-center gap-3 animate-fade-in-up stagger-1">
        <label className="text-sm font-medium">Сынып:</label>
        <select
          value={selectedClassId}
          onChange={(e) => setSelectedClassId(e.target.value)}
          className="flex h-9 w-full sm:w-[300px] rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">Сынып таңдаңыз</option>
          {classes.map((cls) => (
            <option key={cls._id} value={cls._id}>
              {cls.name} ({cls.students?.length || 0} оқушы)
            </option>
          ))}
        </select>
      </div>

      {classes.length === 0 ? (
        <Card className="animate-fade-in-up">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-1">Әлі сыныптар жоқ</h3>
            <p className="text-sm text-muted-foreground">
              Статистиканы көру үшін алдымен сынып жасаңыз
            </p>
          </CardContent>
        </Card>
      ) : loadingStats ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : stats ? (
        <>
          {/* Stat Cards */}
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
                  <div className={`text-2xl font-bold tracking-tight ${"valueColor" in stat ? stat.valueColor : ""}`}>
                    {stat.value}
                  </div>
                  {stat.subtitle && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {stat.subtitle}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {stats.studentStats.length === 0 ? (
            <Card className="animate-fade-in-up stagger-5">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="h-10 w-10 text-muted-foreground mb-3" />
                <p className="text-muted-foreground text-sm">
                  Бұл сынып үшін оқушы деректері жоқ
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Charts Row 1: Bar + Pie */}
              <div className="grid gap-6 lg:grid-cols-2">
                <GradeBarChart studentStats={stats.studentStats} />
                <SubmissionPieChart studentStats={stats.studentStats} />
              </div>

              {/* Charts Row 2: Distribution + Radial */}
              <div className="grid gap-6 lg:grid-cols-2">
                <GradeDistributionChart studentStats={stats.studentStats} />
                <CompletionRadialChart studentStats={stats.studentStats} />
              </div>

              {/* Student Performance Table */}
              <Card className="animate-fade-in-up overflow-hidden border-0 shadow-md">
                <div className="h-1.5 bg-linear-to-r from-indigo-500 to-blue-500" />
                <CardHeader>
                  <CardTitle>Оқушылар үлгерімі</CardTitle>
                </CardHeader>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>Аты</TableHead>
                      <TableHead>Электрондық пошта</TableHead>
                      <TableHead className="text-center">Тапсырмалар</TableHead>
                      <TableHead className="text-center">Жіберілді</TableHead>
                      <TableHead className="text-center">Бағаланды</TableHead>
                      <TableHead className="text-center">Аяқтау</TableHead>
                      <TableHead className="text-center">Орташа баға</TableHead>
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
            </>
          )}
        </>
      ) : null}
    </div>
  );
}
