"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { createClass, getTeacherClasses } from "@/services/class.service";
import { ClassItem } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Users,
  Plus,
  Copy,
  Key,
  Calendar,
  Loader2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

export default function TeacherClassesPage() {
  const { user, isLoading: authLoading } = useAuth("teacher");
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({ name: "", joinPassword: "" });

  useEffect(() => {
    if (!user) return;
    fetchClasses();
  }, [user]);

  async function fetchClasses() {
    try {
      const data = await getTeacherClasses();
      setClasses(data);
    } catch {
      setError("Failed to load classes");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate() {
    if (!formData.name.trim() || !formData.joinPassword.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setCreating(true);
    try {
      const newClass = await createClass(formData);
      setClasses((prev) => [newClass, ...prev]);
      setFormData({ name: "", joinPassword: "" });
      setDialogOpen(false);
      toast.success("Class created successfully");
    } catch {
      toast.error("Failed to create class");
    } finally {
      setCreating(false);
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

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Classes</h1>
          <p className="text-muted-foreground mt-1">
            Manage your classes and students
          </p>
        </div>

        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Class
        </Button>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Class</DialogTitle>
              <DialogDescription>
                Students will use the join code and password to enter this class.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="className">Class Name</Label>
                <Input
                  id="className"
                  placeholder="e.g. Web Development 101"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Join Password</Label>
                <Input
                  id="password"
                  type="text"
                  placeholder="Password for students to join"
                  value={formData.joinPassword}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      joinPassword: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={creating}
              >
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={creating}>
                {creating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {classes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-1">No classes yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create your first class to get started
            </p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Class
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {classes.map((cls) => (
            <Card key={cls._id} className="group hover:border-primary/50 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{cls.name}</CardTitle>
                  <Badge variant="secondary">
                    {cls.students?.length || 0} student
                    {(cls.students?.length || 0) !== 1 ? "s" : ""}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Copy className="h-3.5 w-3.5" />
                      Join Code
                    </span>
                    <button
                      onClick={() => copyToClipboard(cls.joinCode, "Join code")}
                      className="font-mono font-medium hover:text-primary transition-colors"
                    >
                      {cls.joinCode}
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Key className="h-3.5 w-3.5" />
                      Password
                    </span>
                    <button
                      onClick={() =>
                        copyToClipboard(cls.joinPassword, "Password")
                      }
                      className="font-mono font-medium hover:text-primary transition-colors"
                    >
                      {cls.joinPassword}
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      Created
                    </span>
                    <span className="text-muted-foreground">
                      {new Date(cls.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <Link href={`/teacher/classes/${cls._id}`}>
                  <Button
                    variant="outline"
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  >
                    View Details
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
