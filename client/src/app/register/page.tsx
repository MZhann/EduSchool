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
import { Code2, GraduationCap, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { Role } from "@/types";

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!role) {
      toast.error("Please select a role");
      return;
    }

    setLoading(true);
    try {
      const res = await authService.register({ name, email, password, role });
      setAuth(res.user, res.token);
      toast.success("Account created successfully");
      router.push(res.user.role === "teacher" ? "/teacher" : "/student");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registration failed");
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
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>Choose your role and sign up</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("teacher")}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                  role === "teacher"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <GraduationCap
                  className={`h-8 w-8 ${
                    role === "teacher" ? "text-primary" : "text-muted-foreground"
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    role === "teacher" ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  Teacher
                </span>
              </button>
              <button
                type="button"
                onClick={() => setRole("student")}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                  role === "student"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <BookOpen
                  className={`h-8 w-8 ${
                    role === "student" ? "text-primary" : "text-muted-foreground"
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    role === "student" ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  Student
                </span>
              </button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Min 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading || !role}>
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Sign In
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
