"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import * as authService from "@/services/auth.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { User as UserIcon, Mail, Lock, Shield, Save, Loader2 } from "lucide-react";

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingInfo, setSavingInfo] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  if (!user) return null;

  async function handleUpdateInfo(e: React.FormEvent) {
    e.preventDefault();
    setSavingInfo(true);
    try {
      const updated = await authService.updateProfile({ name, email });
      updateUser(updated);
      toast.success("Профиль сәтті жаңартылды");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Профильді жаңарту сәтсіз аяқталды");
    } finally {
      setSavingInfo(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Жаңа құпия сөздер сәйкес келмейді");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Жаңа құпия сөз кемінде 6 таңбадан тұруы керек");
      return;
    }
    setSavingPassword(true);
    try {
      await authService.updateProfile({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Құпия сөз сәтті өзгертілді");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Құпия сөзді өзгерту сәтсіз аяқталды");
    } finally {
      setSavingPassword(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="animate-fade-in-down">
        <h1 className="text-2xl font-bold tracking-tight">Профиль</h1>
        <p className="text-muted-foreground mt-1">
          Аккаунт ақпаратын басқару
        </p>
      </div>

      <Card className="animate-fade-in-up stagger-1 overflow-hidden border-0 shadow-md">
        <div className="h-1.5 bg-linear-to-r from-violet-500 to-purple-600" />
        <CardHeader className="pb-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-lg font-semibold">{user.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Shield className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground capitalize">
                  {user.role}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card className="animate-fade-in-up stagger-2 overflow-hidden border-0 shadow-md">
        <div className="h-1.5 bg-linear-to-r from-blue-500 to-cyan-500" />
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <UserIcon className="h-4 w-4" />
            Жеке ақпарат
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateInfo} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Толық аты-жөні</Label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                  required
                  minLength={2}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Электрондық пошта</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <Button type="submit" disabled={savingInfo} className="gap-2">
              {savingInfo ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {savingInfo ? "Сақталуда..." : "Сақтау"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="animate-fade-in-up stagger-3 overflow-hidden border-0 shadow-md">
        <div className="h-1.5 bg-linear-to-r from-amber-500 to-orange-500" />
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Құпия сөзді өзгерту
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Ағымдағы құпия сөз</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Ағымдағы құпия сөзді енгізіңіз"
                required
              />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="newPassword">Жаңа құпия сөз</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Кемінде 6 таңба"
                required
                minLength={6}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Жаңа құпия сөзді растаңыз</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Жаңа құпия сөзді қайта енгізіңіз"
                required
                minLength={6}
              />
            </div>
            <Button type="submit" disabled={savingPassword} variant="outline" className="gap-2">
              {savingPassword ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Lock className="h-4 w-4" />
              )}
              {savingPassword ? "Өзгертілуде..." : "Құпия сөзді өзгерту"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
