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
import ClassShareModal from "@/components/class/ClassShareModal";
import {
  Users,
  Plus,
  Copy,
  Key,
  Calendar,
  Loader2,
  AlertCircle,
  ArrowRight,
  QrCode,
} from "lucide-react";
import { toast } from "sonner";

const cardGradients = [
  "from-blue-500 to-cyan-500",
  "from-violet-500 to-purple-600",
  "from-emerald-500 to-teal-500",
  "from-amber-500 to-orange-500",
  "from-rose-500 to-pink-500",
  "from-indigo-500 to-blue-600",
];

export default function TeacherClassesPage() {
  const { user, isLoading: authLoading } = useAuth("teacher");
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({ name: "", joinPassword: "" });
  const [shareClass, setShareClass] = useState<ClassItem | null>(null);

  useEffect(() => {
    if (!user) return;
    fetchClasses();
  }, [user]);

  async function fetchClasses() {
    try {
      const data = await getTeacherClasses();
      setClasses(data);
    } catch {
      setError("Сыныптарды жүктеу сәтсіз аяқталды");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate() {
    if (!formData.name.trim() || !formData.joinPassword.trim()) {
      toast.error("Барлық өрістерді толтырыңыз");
      return;
    }

    setCreating(true);
    try {
      const newClass = await createClass(formData);
      setClasses((prev) => [newClass, ...prev]);
      setFormData({ name: "", joinPassword: "" });
      setDialogOpen(false);
      toast.success("Сынып сәтті жасалды");
    } catch {
      toast.error("Сынып жасау сәтсіз аяқталды");
    } finally {
      setCreating(false);
    }
  }

  function copyToClipboard(text: string, label: string) {
    navigator.clipboard.writeText(text);
    toast.success(`${label} алмасу буферіне көшірілді`);
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
      <div className="flex items-center justify-between animate-fade-in-down">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Сыныптар</h1>
          <p className="text-muted-foreground mt-1">
            Сыныптарыңыз бен оқушыларыңызды басқарыңыз
          </p>
        </div>

        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Сынып жасау
        </Button>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Жаңа сынып жасау</DialogTitle>
              <DialogDescription>
                Оқушылар осы сыныпқа кіру үшін қосылу коды мен құпия сөзді пайдаланады.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="className">Сынып атауы</Label>
                <Input
                  id="className"
                  placeholder="мыс. Веб-әзірлеу 101"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Қосылу құпия сөзі</Label>
                <Input
                  id="password"
                  type="text"
                  placeholder="Оқушылардың қосылуы үшін құпия сөз"
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
                Бас тарту
              </Button>
              <Button onClick={handleCreate} disabled={creating}>
                {creating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Жасау
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {classes.length === 0 ? (
        <Card className="animate-fade-in-up">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-1">Әлі сыныптар жоқ</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Бастау үшін бірінші сыныпты жасаңыз
            </p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Сынып жасау
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {classes.map((cls, i) => (
            <Card
              key={cls._id}
              className={`animate-fade-in-up stagger-${(i % 8) + 1} group overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300`}
            >
              <div className={`h-2 bg-linear-to-r ${cardGradients[i % cardGradients.length]}`} />
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{cls.name}</CardTitle>
                  <Badge variant="secondary" className="rounded-full">
                    {cls.students?.length || 0} оқушы
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Copy className="h-3.5 w-3.5" />
                      Қосылу коды
                    </span>
                    <button
                      onClick={() => copyToClipboard(cls.joinCode, "Қосылу коды")}
                      className="font-mono font-medium hover:text-primary transition-colors"
                    >
                      {cls.joinCode}
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Key className="h-3.5 w-3.5" />
                      Құпия сөз
                    </span>
                    <button
                      onClick={() =>
                        copyToClipboard(cls.joinPassword, "Құпия сөз")
                      }
                      className="font-mono font-medium hover:text-primary transition-colors"
                    >
                      {cls.joinPassword}
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      Жасалған
                    </span>
                    <span className="text-muted-foreground">
                      {new Date(cls.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link href={`/teacher/classes/${cls._id}`} className="flex-1">
                    <Button
                      variant="outline"
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    >
                      Толығырақ
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShareClass(cls)}
                    title="Show QR code & credentials"
                  >
                    <QrCode className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {shareClass && (
        <ClassShareModal
          open={!!shareClass}
          onOpenChange={(open) => !open && setShareClass(null)}
          className={shareClass.name}
          joinCode={shareClass.joinCode}
          joinPassword={shareClass.joinPassword}
        />
      )}
    </div>
  );
}
