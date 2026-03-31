"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";
import * as authService from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Code2 } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await authService.login({ email, password });
      setAuth(res.user, res.token);
      toast.success("Сәтті кірдіңіз");
      router.push(res.user.role === "teacher" ? "/teacher" : "/student");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Кіру сәтсіз аяқталды");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-linear-to-br from-primary/5 via-background to-background">
      <Card className="animate-scale-in w-full max-w-md border-0 shadow-xl shadow-primary/5">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <div className="h-12 w-12 rounded-xl bg-linear-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/25">
              <Code2 className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl">Қайта қош келдіңіз</CardTitle>
          <CardDescription>EduSchool аккаунтыңызға кіріңіз</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Электрондық пошта</Label>
              <Input
                id="email"
                type="email"
                placeholder="сіз@мысал.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Құпия сөз</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Кіру..." : "Кіру"}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-4">
            Аккаунтыңыз жоқ па?{" "}
            <Link href="/register" className="text-primary hover:underline font-medium">
              Тіркелу
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
