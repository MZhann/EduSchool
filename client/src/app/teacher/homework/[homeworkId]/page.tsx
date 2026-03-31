"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import {
  getHomeworkMonitoring,
  closeHomework,
} from "@/services/homework.service";
import {
  MonitoringData,
  SubmissionItem,
  SubmissionStatus,
  HomeworkItem,
} from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Clock,
  Users,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Lock,
  Eye,
  BookOpen,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

const statusConfig: Record<
  SubmissionStatus,
  { label: string; variant: "default" | "secondary" | "outline" | "destructive"; className: string }
> = {
  in_progress: {
    label: "In Progress",
    variant: "outline",
    className: "border-yellow-500/50 text-yellow-500 bg-yellow-500/10",
  },
  submitted: {
    label: "Submitted",
    variant: "outline",
    className: "border-blue-500/50 text-blue-500 bg-blue-500/10",
  },
  graded: {
    label: "Graded",
    variant: "outline",
    className: "border-green-500/50 text-green-500 bg-green-500/10",
  },
  returned: {
    label: "Returned",
    variant: "outline",
    className: "border-orange-500/50 text-orange-500 bg-orange-500/10",
  },
};

export default function HomeworkMonitoringPage() {
  const { user, isLoading: authLoading } = useAuth("teacher");
  const params = useParams();
  const router = useRouter();
  const homeworkId = params.homeworkId as string;

  const [monitoringData, setMonitoringData] = useState<MonitoringData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMonitoring = useCallback(async () => {
    try {
      const data = await getHomeworkMonitoring(homeworkId);
      setMonitoringData(data);
    } catch {
      setError("Failed to load monitoring data");
    } finally {
      setLoading(false);
    }
  }, [homeworkId]);

  useEffect(() => {
    if (!user || !homeworkId) return;
    fetchMonitoring();
  }, [user, homeworkId, fetchMonitoring]);

  async function handleRefresh() {
    setRefreshing(true);
    try {
      const data = await getHomeworkMonitoring(homeworkId);
      setMonitoringData(data);
      toast.success("Data refreshed");
    } catch {
      toast.error("Failed to refresh");
    } finally {
      setRefreshing(false);
    }
  }

  async function handleClose() {
    setClosing(true);
    try {
      await closeHomework(homeworkId);
      setMonitoringData((prev) =>
        prev
          ? {
              ...prev,
              homework: { ...prev.homework, status: "closed" },
            }
          : null
      );
      setCloseDialogOpen(false);
      toast.success("Homework closed");
    } catch {
      toast.error("Failed to close homework");
    } finally {
      setClosing(false);
    }
  }

  function getStudentName(submission: SubmissionItem): string {
    if (typeof submission.student === "object" && submission.student !== null) {
      return submission.student.name;
    }
    return "Unknown Student";
  }

  function getStudentEmail(submission: SubmissionItem): string {
    if (typeof submission.student === "object" && submission.student !== null) {
      return submission.student.email;
    }
    return "";
  }

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !monitoringData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <p className="text-muted-foreground">
          {error || "Homework not found"}
        </p>
        <Button
          variant="outline"
          onClick={() => router.push("/teacher/homework")}
        >
          Back to Homework
        </Button>
      </div>
    );
  }

  const { homework, submissions } = monitoringData;
  const statusCounts = submissions.reduce(
    (acc, sub) => {
      acc[sub.status] = (acc[sub.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4 animate-fade-in-down">
        <Link href="/teacher/homework">
          <Button variant="ghost" size="icon" className="mt-1">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-bold tracking-tight">
              {homework.title}
            </h1>
            <Badge
              variant={homework.status === "active" ? "default" : "secondary"}
            >
              {homework.status}
            </Badge>
          </div>
          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5" />
              {homework.topic}
            </span>
            {homework.dueDate && (
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                Due: {new Date(homework.dueDate).toLocaleString()}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw
              className={`h-4 w-4 mr-1 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          {homework.status === "active" && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setCloseDialogOpen(true)}
            >
              <Lock className="h-4 w-4 mr-1" />
              Close
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="animate-fade-in-up stagger-1 overflow-hidden border-0 shadow-md">
          <div className="h-1.5 bg-linear-to-r from-slate-500 to-gray-600" />
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{submissions.length}</div>
          </CardContent>
        </Card>
        <Card className="animate-fade-in-up stagger-2 overflow-hidden border-0 shadow-md">
          <div className="h-1.5 bg-linear-to-r from-amber-400 to-yellow-500" />
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-500">
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statusCounts["in_progress"] || 0}
            </div>
          </CardContent>
        </Card>
        <Card className="animate-fade-in-up stagger-3 overflow-hidden border-0 shadow-md">
          <div className="h-1.5 bg-linear-to-r from-blue-500 to-indigo-500" />
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-500">
              Submitted
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statusCounts["submitted"] || 0}
            </div>
          </CardContent>
        </Card>
        <Card className="animate-fade-in-up stagger-4 overflow-hidden border-0 shadow-md">
          <div className="h-1.5 bg-linear-to-r from-emerald-500 to-green-500" />
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-500">
              Graded
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statusCounts["graded"] || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {homework.theoryContent && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Theory Content</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {homework.theoryContent}
            </p>
          </CardContent>
        </Card>
      )}

      <Separator />

      <div>
        <h2 className="text-xl font-semibold mb-4">Student Submissions</h2>
        {submissions.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-muted-foreground text-sm">
                No submissions yet
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="w-20 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((sub, index) => {
                  const config = statusConfig[sub.status];
                  return (
                    <TableRow key={sub._id}>
                      <TableCell className="text-muted-foreground">
                        {index + 1}
                      </TableCell>
                      <TableCell className="font-medium">
                        {getStudentName(sub)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {getStudentEmail(sub)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={config.variant} className={config.className}>
                          {config.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {sub.grade != null ? (
                          <span className="font-medium">{sub.grade}/100</span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {sub.submittedAt
                          ? new Date(sub.submittedAt).toLocaleString()
                          : "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        {(sub.status === "submitted" ||
                          sub.status === "graded" ||
                          sub.status === "returned") && (
                          <Link
                            href={`/teacher/homework/${homeworkId}/submission/${sub._id}`}
                          >
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>

      <Dialog open={closeDialogOpen} onOpenChange={setCloseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Close Homework</DialogTitle>
            <DialogDescription>
              Are you sure you want to close this homework? Students will no
              longer be able to submit or edit their work.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCloseDialogOpen(false)}
              disabled={closing}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleClose}
              disabled={closing}
            >
              {closing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Close Homework
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
