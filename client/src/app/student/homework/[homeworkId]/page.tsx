"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  getStudentSubmission,
  saveProgress,
  submitWork,
} from "@/services/submission.service";
import {
  SubmissionItem,
  HomeworkItem,
  TaskItem,
  HtmlBlock,
  FeedbackAnnotation,
} from "@/types";
import HtmlBlockEditor from "@/components/editor/HtmlBlockEditor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Loader2,
  ArrowLeft,
  Save,
  Send,
  CheckCircle,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";

const AUTO_SAVE_DELAY = 5000;

export default function HomeworkWorkspacePage() {
  const { user, isLoading: authLoading } = useAuth("student");
  const params = useParams();
  const router = useRouter();
  const homeworkId = params.homeworkId as string;

  const [submission, setSubmission] = useState<SubmissionItem | null>(null);
  const [homework, setHomework] = useState<HomeworkItem | null>(null);
  const [blocks, setBlocks] = useState<HtmlBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const blocksRef = useRef<HtmlBlock[]>([]);

  const isReadOnly =
    submission?.status === "submitted" || submission?.status === "graded";

  useEffect(() => {
    if (!user || !homeworkId) return;

    async function fetchData() {
      try {
        const data = await getStudentSubmission(homeworkId);
        setSubmission(data.submission);
        setHomework(data.homework);
        setBlocks(data.submission.blocks ?? []);
        blocksRef.current = data.submission.blocks ?? [];
      } catch {
        setError("Failed to load homework data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user, homeworkId]);

  useEffect(() => {
    return () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    };
  }, []);

  const generateHtml = useCallback((htmlBlocks: HtmlBlock[]): string => {
    function renderBlock(block: HtmlBlock): string {
      const attrs = Object.entries(block.attributes || {})
        .map(([k, v]) => `${k}="${v}"`)
        .join(" ");
      const open = attrs ? `<${block.tag} ${attrs}>` : `<${block.tag}>`;
      const children = (block.children || []).map(renderBlock).join("");
      return `${open}${block.content || ""}${children}</${block.tag}>`;
    }
    return htmlBlocks.map(renderBlock).join("");
  }, []);

  const handleBlocksChange = useCallback(
    (newBlocks: HtmlBlock[]) => {
      setBlocks(newBlocks);
      blocksRef.current = newBlocks;

      if (isReadOnly) return;

      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
      autoSaveTimer.current = setTimeout(async () => {
        try {
          const html = generateHtml(newBlocks);
          await saveProgress(homeworkId, {
            blocks: newBlocks,
            generatedHtml: html,
          });
        } catch {
          // silent auto-save failure
        }
      }, AUTO_SAVE_DELAY);
    },
    [homeworkId, generateHtml, isReadOnly]
  );

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const html = generateHtml(blocksRef.current);
      const updated = await saveProgress(homeworkId, {
        blocks: blocksRef.current,
        generatedHtml: html,
      });
      setSubmission((prev) => (prev ? { ...prev, blocks: updated.blocks, generatedHtml: updated.generatedHtml } : prev));
      toast.success("Progress saved");
    } catch {
      toast.error("Failed to save progress");
    } finally {
      setSaving(false);
    }
  }, [homeworkId, generateHtml]);

  const handleSubmit = useCallback(async () => {
    setSubmitting(true);
    try {
      const html = generateHtml(blocksRef.current);
      const updated = await submitWork(homeworkId, {
        blocks: blocksRef.current,
        generatedHtml: html,
      });
      setSubmission((prev) => (prev ? { ...prev, ...updated, task: prev.task } : prev));
      setConfirmDialogOpen(false);
      toast.success("Work submitted successfully!");
    } catch {
      toast.error("Failed to submit work");
    } finally {
      setSubmitting(false);
    }
  }, [homeworkId, generateHtml]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !submission || !homework) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-destructive">{error ?? "Submission not found"}</p>
      </div>
    );
  }

  const task = submission.task as TaskItem;
  const feedback = submission.feedback;
  const feedbackAnnotations: FeedbackAnnotation[] =
    submission.feedbackAnnotations ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 animate-fade-in-down">
        <div className="flex items-center gap-3 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/student/homework")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="min-w-0">
            <h1 className="text-xl font-bold tracking-tight truncate">
              {homework.title}
            </h1>
            <p className="text-sm text-muted-foreground">{task.topic}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <StatusBadge status={submission.status} />

          {!isReadOnly && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save
              </Button>
              <Button
                size="sm"
                onClick={() => setConfirmDialogOpen(true)}
              >
                <Send className="h-4 w-4 mr-2" />
                Submit
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Grade & Feedback */}
      {(submission.status === "graded" || submission.status === "returned") && (
        <div className="grid gap-4 sm:grid-cols-2">
          {submission.grade != null && (
            <Card className="animate-fade-in-up stagger-1 border-emerald-500/30 overflow-hidden border-0 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  Grade
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-emerald-600">
                  {submission.grade}
                </p>
              </CardContent>
            </Card>
          )}
          {feedback && (
            <Card className="animate-fade-in-up stagger-2 border-blue-500/30 overflow-hidden border-0 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-blue-500" />
                  Teacher Feedback
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{feedback}</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Theory Content */}
      {homework.theoryContent && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Theory</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="prose prose-sm max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: homework.theoryContent }}
            />
          </CardContent>
        </Card>
      )}

      {/* Task Description */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Task</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="font-medium">{task.title}</p>
          {task.description && (
            <p className="text-sm text-muted-foreground">{task.description}</p>
          )}
          {task.instruction && (
            <div className="mt-3 p-3 rounded-lg bg-muted text-sm">
              {task.instruction}
            </div>
          )}
          {task.imageUrl && (
            <img
              src={task.imageUrl}
              alt="Task reference"
              className="mt-3 rounded-lg border max-h-64 object-contain"
            />
          )}
        </CardContent>
      </Card>

      {/* Editor */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Your Work</CardTitle>
        </CardHeader>
        <CardContent>
          <HtmlBlockEditor
            task={task}
            blocks={blocks}
            onBlocksChange={handleBlocksChange}
            onSave={handleSave}
            onSubmit={() => setConfirmDialogOpen(true)}
            readOnly={isReadOnly}
            feedback={feedback}
            feedbackAnnotations={feedbackAnnotations}
          />
        </CardContent>
      </Card>

      {/* Submit Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit your work?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Once submitted, you won&apos;t be able to make further changes
            unless the teacher returns it for revision.
          </p>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setConfirmDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Confirm Submit
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string }> = {
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

  const cfg = config[status] ?? { label: status, className: "" };

  return (
    <Badge variant="outline" className={cfg.className}>
      {cfg.label}
    </Badge>
  );
}
