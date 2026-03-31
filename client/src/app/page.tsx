"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { Code2, GraduationCap, BookOpen, Blocks } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  const router = useRouter();
  const { loadFromStorage, user, isLoading } = useAuthStore();

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  useEffect(() => {
    if (!isLoading && user) {
      router.push(user.role === "teacher" ? "/teacher" : "/student");
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-50 animate-fade-in-down">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-linear-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20">
              <Code2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">EduSchool</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost">Log In</Button>
            </Link>
            <Link href="/register">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative py-28 px-6 overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-linear-to-b from-primary/5 via-transparent to-transparent" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-[800px] h-[400px] rounded-full bg-primary/8 blur-3xl" />
          <div className="container mx-auto max-w-4xl text-center">
            <div className="animate-fade-in-up stagger-1 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Blocks className="h-3.5 w-3.5" />
              Interactive HTML Learning
            </div>
            <h1 className="animate-fade-in-up stagger-2 text-5xl sm:text-6xl font-bold tracking-tight mb-6 bg-linear-to-br from-foreground via-foreground to-muted-foreground bg-clip-text">
              Learn HTML by Building
            </h1>
            <p className="animate-fade-in-up stagger-3 text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              A modern drag-and-drop platform where students learn HTML by
              assembling blocks, not writing code. Teachers assign, monitor,
              and grade — all in real time.
            </p>
            <div className="animate-fade-in-up stagger-4 flex items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="text-base px-8 shadow-lg shadow-primary/25">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="text-base px-8">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-24 px-6 bg-muted/40">
          <div className="container mx-auto max-w-5xl">
            <h2 className="animate-fade-in-up text-2xl font-bold text-center mb-12">Why EduSchool?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="animate-fade-in-up stagger-1 flex flex-col items-center text-center p-8 rounded-2xl bg-card border-0 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="h-14 w-14 rounded-2xl bg-linear-to-br from-blue-500/20 to-blue-500/5 flex items-center justify-center mb-5">
                  <Blocks className="h-7 w-7 text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Drag & Drop Editor
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Build HTML pages by dragging tag blocks into the workspace.
                  No manual coding required.
                </p>
              </div>
              <div className="animate-fade-in-up stagger-2 flex flex-col items-center text-center p-8 rounded-2xl bg-card border-0 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="h-14 w-14 rounded-2xl bg-linear-to-br from-emerald-500/20 to-emerald-500/5 flex items-center justify-center mb-5">
                  <BookOpen className="h-7 w-7 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  2700+ Unique Tasks
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Each student gets a unique randomized assignment. No two
                  students receive the same task.
                </p>
              </div>
              <div className="animate-fade-in-up stagger-3 flex flex-col items-center text-center p-8 rounded-2xl bg-card border-0 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="h-14 w-14 rounded-2xl bg-linear-to-br from-amber-500/20 to-amber-500/5 flex items-center justify-center mb-5">
                  <GraduationCap className="h-7 w-7 text-amber-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Teacher Dashboard
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Create classes, assign homework, monitor progress,
                  grade submissions, and view statistics.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8 px-6 bg-card/50">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          &copy; 2026 EduSchool. HTML Learning Platform.
        </div>
      </footer>
    </div>
  );
}
