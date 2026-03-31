"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import {
  getSubmissionById,
  gradeSubmission,
  returnSubmission,
} from "@/services/submission.service";
import {
  SubmissionItem,
  HtmlBlock,
  FeedbackAnnotation,
  TaskItem,
} from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  CheckCircle2,
  RotateCcw,
  Loader2,
  AlertCircle,
  MessageSquare,
  Star,
  Code2,
  Eye,
} from "lucide-react";
import { toast } from "sonner";

export default function GradeSubmissionPage() {
  const { user, isLoading: authLoading } = useAuth("teacher");
  const params = useParams();
  const router = useRouter();
  const homeworkId = params.homeworkId as string;
  const submissionId = params.submissionId as string;

  const [submission, setSubmission] = useState<SubmissionItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [grading, setGrading] = useState(false);
  const [returning, setReturning] = useState(false);

  const [grade, setGrade] = useState<string>("");
  const [feedback, setFeedback] = useState("");
  const [annotations, setAnnotations] = useState<FeedbackAnnotation[]>([]);

  useEffect(() => {
    if (!user || !submissionId) return;

    async function fetchSubmission() {
      try {
        const data = await getSubmissionById(submissionId);
        setSubmission(data);
        if (data.grade != null) setGrade(String(data.grade));
        if (data.feedback) setFeedback(data.feedback);
        if (data.feedbackAnnotations?.length) {
          setAnnotations(data.feedbackAnnotations);
        }
      } catch {
        setError("Жұмысты жүктеу сәтсіз аяқталды");
      } finally {
        setLoading(false);
      }
    }

    fetchSubmission();
  }, [user, submissionId]);

  async function handleGrade() {
    const gradeNum = Number(grade);
    if (isNaN(gradeNum) || gradeNum < 0 || gradeNum > 100) {
      toast.error("Баға 0 мен 100 аралығында болуы керек");
      return;
    }

    setGrading(true);
    try {
      const updated = await gradeSubmission(submissionId, {
        grade: gradeNum,
        feedback: feedback || undefined,
        feedbackAnnotations: annotations.length > 0 ? annotations : undefined,
      });
      setSubmission(updated);
      toast.success("Жұмыс сәтті бағаланды");
    } catch {
      toast.error("Жұмысты бағалау сәтсіз аяқталды");
    } finally {
      setGrading(false);
    }
  }

  async function handleReturn() {
    if (!feedback.trim()) {
      toast.error("Қайтарар алдында кері байланыс жазыңыз");
      return;
    }

    setReturning(true);
    try {
      const updated = await returnSubmission(submissionId, {
        feedback,
        feedbackAnnotations: annotations.length > 0 ? annotations : undefined,
      });
      setSubmission(updated);
      toast.success("Жұмыс түзетуге қайтарылды");
    } catch {
      toast.error("Жұмысты қайтару сәтсіз аяқталды");
    } finally {
      setReturning(false);
    }
  }

  function addAnnotation(blockId: string) {
    if (annotations.find((a) => a.blockId === blockId)) return;
    setAnnotations((prev) => [...prev, { blockId, comment: "" }]);
  }

  function updateAnnotation(blockId: string, comment: string) {
    setAnnotations((prev) =>
      prev.map((a) => (a.blockId === blockId ? { ...a, comment } : a))
    );
  }

  function removeAnnotation(blockId: string) {
    setAnnotations((prev) => prev.filter((a) => a.blockId !== blockId));
  }

  function getStudentName(): string {
    if (
      submission &&
      typeof submission.student === "object" &&
      submission.student !== null
    ) {
      return submission.student.name;
    }
    return "Белгісіз оқушы";
  }

  function getTaskInfo(): TaskItem | null {
    if (
      submission &&
      typeof submission.task === "object" &&
      submission.task !== null
    ) {
      return submission.task as TaskItem;
    }
    return null;
  }

  function renderBlockTree(blocks: HtmlBlock[], depth: number = 0): React.ReactNode {
    return blocks.map((block) => {
      const annotation = annotations.find((a) => a.blockId === block.id);
      const hasAnnotation = !!annotation;

      return (
        <div key={block.id} style={{ marginLeft: depth * 16 }} className="group">
          <div
            className={`flex items-start gap-2 p-2 rounded-md border text-sm my-1 transition-colors ${
              hasAnnotation
                ? "border-orange-500/50 bg-orange-500/5"
                : "border-border hover:border-muted-foreground/30"
            }`}
          >
            <Badge variant="outline" className="shrink-0 font-mono text-xs">
              &lt;{block.tag}&gt;
            </Badge>
            <span className="flex-1 min-w-0 break-words">
              {block.content || <span className="text-muted-foreground italic">бос</span>}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() =>
                hasAnnotation
                  ? removeAnnotation(block.id)
                  : addAnnotation(block.id)
              }
            >
              <MessageSquare
                className={`h-3.5 w-3.5 ${hasAnnotation ? "text-orange-500" : ""}`}
              />
            </Button>
          </div>
          {hasAnnotation && (
            <div className="ml-4 mb-2">
              <Textarea
                placeholder="Осы блокқа пікір қосыңыз..."
                value={annotation.comment}
                onChange={(e) => updateAnnotation(block.id, e.target.value)}
                rows={2}
                className="text-sm"
              />
            </div>
          )}
          {block.children?.length > 0 && renderBlockTree(block.children, depth + 1)}
        </div>
      );
    });
  }

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <p className="text-muted-foreground">
          {error || "Жұмыс табылмады"}
        </p>
        <Button
          variant="outline"
          onClick={() => router.push(`/teacher/homework/${homeworkId}`)}
        >
          Тапсырмаға оралу
        </Button>
      </div>
    );
  }

  const task = getTaskInfo();
  const isAlreadyGraded = submission.status === "graded";

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <Link href={`/teacher/homework/${homeworkId}`}>
          <Button variant="ghost" size="icon" className="mt-1">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">
            Жұмысты тексеру
          </h1>
          <p className="text-muted-foreground mt-1">
            Оқушы: <span className="font-medium text-foreground">{getStudentName()}</span>
          </p>
        </div>
        <Badge
          variant="outline"
          className={
            submission.status === "graded"
              ? "border-green-500/50 text-green-500 bg-green-500/10"
              : submission.status === "submitted"
                ? "border-blue-500/50 text-blue-500 bg-blue-500/10"
                : submission.status === "returned"
                  ? "border-orange-500/50 text-orange-500 bg-orange-500/10"
                  : ""
          }
        >
          {submission.status}
        </Badge>
      </div>

      {task && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Тапсырма мәліметтері</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{task.title}</span>
              <Badge variant="outline">{task.difficulty}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{task.instruction}</p>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="preview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="preview" className="gap-1.5">
            <Eye className="h-3.5 w-3.5" />
            HTML алдын ала көрініс
          </TabsTrigger>
          <TabsTrigger value="blocks" className="gap-1.5">
            <Code2 className="h-3.5 w-3.5" />
            Блок құрылымы
          </TabsTrigger>
        </TabsList>

        <TabsContent value="preview">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Нәтиже</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="border rounded-lg p-4 bg-white text-black min-h-[200px] prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{
                  __html: submission.generatedHtml || "<p>Мазмұн жоқ</p>",
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blocks">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">
                  Блок құрылымы
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Блокқа пікір қалдыру үшін пікір белгішесін басыңыз
                </p>
              </div>
            </CardHeader>
            <CardContent>
              {submission.blocks?.length > 0 ? (
                renderBlockTree(submission.blocks)
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Бұл жұмыста блоктар жоқ
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Star className="h-4 w-4" />
            Бағалау
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="grade">Баға (0 – 100)</Label>
              <Input
                id="grade"
                type="number"
                min={0}
                max={100}
                placeholder="Бағаны енгізіңіз..."
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
              />
            </div>
            {isAlreadyGraded && submission.gradedAt && (
              <div className="flex items-center text-sm text-muted-foreground">
                Бағаланған күні {new Date(submission.gradedAt).toLocaleString()}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="feedback">Кері байланыс</Label>
            <Textarea
              id="feedback"
              placeholder="Оқушыға жалпы кері байланыс жазыңыз..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
            />
          </div>

          {annotations.length > 0 && (
            <div className="text-sm text-muted-foreground">
              {annotations.filter((a) => a.comment.trim()).length} блок
              пікірлері қосылады
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <Button
              onClick={handleGrade}
              disabled={grading || returning}
            >
              {grading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4 mr-2" />
              )}
              {isAlreadyGraded ? "Бағаны жаңарту" : "Бағалау"}
            </Button>
            <Button
              variant="outline"
              onClick={handleReturn}
              disabled={grading || returning}
            >
              {returning ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RotateCcw className="h-4 w-4 mr-2" />
              )}
              Түзетуге қайтару
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
