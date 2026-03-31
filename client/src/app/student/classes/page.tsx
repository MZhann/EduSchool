"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { getStudentClasses, joinClass } from "@/services/class.service";
import { ClassItem } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Plus, Users, CalendarDays } from "lucide-react";
import { toast } from "sonner";

const cardGradients = [
  "from-blue-500 to-cyan-500",
  "from-violet-500 to-purple-600",
  "from-emerald-500 to-teal-500",
  "from-amber-500 to-orange-500",
  "from-rose-500 to-pink-500",
  "from-indigo-500 to-blue-600",
];

export default function StudentClassesPage() {
  const { user, isLoading: authLoading } = useAuth("student");
  const searchParams = useSearchParams();
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [joinPassword, setJoinPassword] = useState("");
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    const codeFromUrl = searchParams.get("joinCode");
    if (codeFromUrl) {
      setJoinCode(codeFromUrl);
      setDialogOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!user) return;
    fetchClasses();
  }, [user]);

  async function fetchClasses() {
    try {
      const data = await getStudentClasses();
      setClasses(data);
    } catch {
      setError("Сыныптарды жүктеу сәтсіз аяқталды");
    } finally {
      setLoading(false);
    }
  }

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    if (!joinCode.trim() || !joinPassword.trim()) {
      toast.error("Барлық өрістерді толтырыңыз");
      return;
    }

    setJoining(true);
    try {
      await joinClass({ joinCode: joinCode.trim(), joinPassword: joinPassword.trim() });
      toast.success("Сыныпқа сәтті қосылдыңыз!");
      setDialogOpen(false);
      setJoinCode("");
      setJoinPassword("");
      setLoading(true);
      await fetchClasses();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Сыныпқа қосылу сәтсіз аяқталды";
      toast.error(message);
    } finally {
      setJoining(false);
    }
  }

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between animate-fade-in-down">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Менің сыныптарым</h1>
          <p className="text-muted-foreground mt-1">
            Сіз қосылған сыныптар
          </p>
        </div>

        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Сыныпқа қосылу
        </Button>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Сыныпқа қосылу</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleJoin} className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="joinCode">Қосылу коды</Label>
                <Input
                  id="joinCode"
                  placeholder="Сыныптың қосылу кодын енгізіңіз"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="joinPassword">Құпия сөз</Label>
                <Input
                  id="joinPassword"
                  type="password"
                  placeholder="Сынып құпия сөзін енгізіңіз"
                  value={joinPassword}
                  onChange={(e) => setJoinPassword(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Бас тарту
                </Button>
                <Button type="submit" disabled={joining}>
                  {joining && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Қосылу
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

      </div>

      {classes.length === 0 ? (
        <Card className="animate-fade-in-up">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Users className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-lg font-medium">Әлі сыныптар жоқ</p>
            <p className="text-sm text-muted-foreground mt-1">
              Мұғаліміңізден алған код арқылы сыныпқа қосылыңыз
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {classes.map((cls, i) => {
            const teacherName =
              typeof cls.teacher === "object" ? cls.teacher.name : "—";

            return (
              <Card
                key={cls._id}
                className={`animate-fade-in-up stagger-${(i % 8) + 1} overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300`}
              >
                <div className={`h-2 bg-linear-to-r ${cardGradients[i % cardGradients.length]}`} />
                <CardContent className="p-5 space-y-3">
                  <div>
                    <h3 className="font-semibold text-base">{cls.name}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Мұғалім: {teacherName}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {cls.students.length} оқушы
                    </span>
                    <span className="flex items-center gap-1">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {new Date(cls.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
