"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import {
  createHomework,
  getTeacherHomeworks,
  getTopics,
} from "@/services/homework.service";
import { getTeacherClasses } from "@/services/class.service";
import { HomeworkItem, ClassItem } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";


import {
  Plus,
  Clock,
  Users,
  BookOpen,
  Loader2,
  AlertCircle,
  Search,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

export default function TeacherHomeworkPage() {
  const { user, isLoading: authLoading } = useAuth("teacher");
  const [homeworks, setHomeworks] = useState<HomeworkItem[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [formData, setFormData] = useState({
    title: "",
    topic: "",
    classId: "",
    theoryContent: "",
    dueDate: "",
  });

  useEffect(() => {
    if (!user) return;

    async function fetchData() {
      try {
        const [hwData, classData, topicData] = await Promise.all([
          getTeacherHomeworks(),
          getTeacherClasses(),
          getTopics(),
        ]);
        setHomeworks(hwData);
        setClasses(classData);
        setTopics(topicData);
      } catch {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user]);

  async function handleCreate() {
    if (!formData.title.trim() || !formData.topic || !formData.classId) {
      toast.error("Please fill in title, topic, and class");
      return;
    }

    setCreating(true);
    try {
      const payload: {
        title: string;
        topic: string;
        classId: string;
        theoryContent?: string;
        dueDate?: string;
      } = {
        title: formData.title,
        topic: formData.topic,
        classId: formData.classId,
      };

      if (formData.theoryContent.trim()) {
        payload.theoryContent = formData.theoryContent;
      }
      if (formData.dueDate) {
        payload.dueDate = new Date(formData.dueDate).toISOString();
      }

      const newHomework = await createHomework(payload);
      setHomeworks((prev) => [newHomework, ...prev]);
      setFormData({
        title: "",
        topic: "",
        classId: "",
        theoryContent: "",
        dueDate: "",
      });
      setDialogOpen(false);
      toast.success("Homework created successfully");
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Failed to create homework";
      toast.error(message);
    } finally {
      setCreating(false);
    }
  }

  const filteredHomeworks = homeworks.filter((hw) => {
    const matchesSearch = hw.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || hw.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  function getClassName(hw: HomeworkItem): string {
    if (typeof hw.classId === "object" && hw.classId !== null) {
      return hw.classId.name;
    }
    const cls = classes.find((c) => c._id === hw.classId);
    return cls?.name || "Unknown Class";
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
          <h1 className="text-3xl font-bold tracking-tight">Homework</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage assignments
          </p>
        </div>

        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Homework
        </Button>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Create New Homework</DialogTitle>
              <DialogDescription>
                Assign a new homework to a class. Tasks will be automatically
                distributed to students.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
              <div className="space-y-2">
                <Label htmlFor="hwTitle">Title</Label>
                <Input
                  id="hwTitle"
                  placeholder="e.g. HTML Lists Practice"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hwTopic">Topic</Label>
                <select
                  id="hwTopic"
                  value={formData.topic}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, topic: e.target.value }))
                  }
                  className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Select a topic</option>
                  {topics.map((topic) => (
                    <option key={topic} value={topic}>
                      {topic}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hwClass">Class</Label>
                <select
                  id="hwClass"
                  value={formData.classId}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, classId: e.target.value }))
                  }
                  className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Select a class</option>
                  {classes.map((cls) => (
                    <option key={cls._id} value={cls._id}>
                      {cls.name} ({cls.students?.length || 0} students)
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="theory">Theory Content (optional)</Label>
                <Textarea
                  id="theory"
                  placeholder="Provide theory or instructions for students..."
                  value={formData.theoryContent}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      theoryContent: e.target.value,
                    }))
                  }
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date (optional)</Label>
                <Input
                  id="dueDate"
                  type="datetime-local"
                  value={formData.dueDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      dueDate: e.target.value,
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

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search homework..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="flex h-9 w-full sm:w-[180px] rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {filteredHomeworks.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-1">
              {homeworks.length === 0
                ? "No homework yet"
                : "No matching homework"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {homeworks.length === 0
                ? "Create your first homework assignment"
                : "Try adjusting your search or filter"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredHomeworks.map((hw) => (
            <Link key={hw._id} href={`/teacher/homework/${hw._id}`}>
              <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base line-clamp-2">
                      {hw.title}
                    </CardTitle>
                    <Badge
                      variant={
                        hw.status === "active" ? "default" : "secondary"
                      }
                      className="shrink-0"
                    >
                      {hw.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{hw.topic}</Badge>
                  </div>
                  <div className="space-y-1.5 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5" />
                      {getClassName(hw)}
                    </div>
                    {hw.dueDate && (
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        Due: {new Date(hw.dueDate).toLocaleDateString()}
                      </div>
                    )}
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="h-3.5 w-3.5" />
                      {hw.assignedTasks?.length || 0} task
                      {(hw.assignedTasks?.length || 0) !== 1 ? "s" : ""}{" "}
                      assigned
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-primary font-medium pt-1">
                    View Details
                    <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
