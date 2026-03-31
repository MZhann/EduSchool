"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { getClassById, removeStudent } from "@/services/class.service";
import { ClassItem } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Copy,
  Key,
  Users,
  UserMinus,
  Calendar,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

export default function ClassDetailPage() {
  const { user, isLoading: authLoading } = useAuth("teacher");
  const params = useParams();
  const router = useRouter();
  const classId = params.classId as string;

  const [classData, setClassData] = useState<ClassItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removeDialog, setRemoveDialog] = useState<{
    open: boolean;
    studentId: string;
    studentName: string;
  }>({ open: false, studentId: "", studentName: "" });
  const [removing, setRemoving] = useState(false);

  useEffect(() => {
    if (!user || !classId) return;

    async function fetchClass() {
      try {
        const data = await getClassById(classId);
        setClassData(data);
      } catch {
        setError("Failed to load class details");
      } finally {
        setLoading(false);
      }
    }

    fetchClass();
  }, [user, classId]);

  async function handleRemoveStudent() {
    if (!removeDialog.studentId) return;

    setRemoving(true);
    try {
      const updated = await removeStudent(classId, removeDialog.studentId);
      setClassData(updated);
      setRemoveDialog({ open: false, studentId: "", studentName: "" });
      toast.success("Student removed from class");
    } catch {
      toast.error("Failed to remove student");
    } finally {
      setRemoving(false);
    }
  }

  function copyToClipboard(text: string, label: string) {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  }

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !classData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <p className="text-muted-foreground">{error || "Class not found"}</p>
        <Button variant="outline" onClick={() => router.push("/teacher/classes")}>
          Back to Classes
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/teacher/classes">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {classData.name}
          </h1>
          <p className="text-muted-foreground mt-1">
            Created on {new Date(classData.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Copy className="h-4 w-4" />
              Join Code
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-mono font-bold">
                {classData.joinCode}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => copyToClipboard(classData.joinCode, "Join code")}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Key className="h-4 w-4" />
              Join Password
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-mono font-bold">
                {classData.joinPassword}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  copyToClipboard(classData.joinPassword, "Password")
                }
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">
              {classData.students?.length || 0}
            </span>
          </CardContent>
        </Card>
      </div>

      <Separator />

      <div>
        <h2 className="text-xl font-semibold mb-4">Student List</h2>
        {classData.students?.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-muted-foreground text-sm">
                No students have joined this class yet. Share the join code and
                password with your students.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="w-24 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classData.students.map((student, index) => (
                  <TableRow key={student._id}>
                    <TableCell className="text-muted-foreground">
                      {index + 1}
                    </TableCell>
                    <TableCell className="font-medium">
                      {student.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {student.email}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() =>
                          setRemoveDialog({
                            open: true,
                            studentId: student._id,
                            studentName: student.name,
                          })
                        }
                      >
                        <UserMinus className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>

      <Dialog
        open={removeDialog.open}
        onOpenChange={(open) =>
          setRemoveDialog((prev) => ({ ...prev, open }))
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Student</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove{" "}
              <span className="font-semibold text-foreground">
                {removeDialog.studentName}
              </span>{" "}
              from this class? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setRemoveDialog({ open: false, studentId: "", studentName: "" })
              }
              disabled={removing}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRemoveStudent}
              disabled={removing}
            >
              {removing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
