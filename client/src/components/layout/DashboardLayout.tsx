"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Code2,
  LogOut,
  Menu,
  X,
  BookOpen,
  Users,
  BarChart3,
  Home,
  FolderOpen,
  ClipboardList,
  UserCircle,
  Award,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const teacherNavItems: NavItem[] = [
  { label: "Dashboard", href: "/teacher", icon: <Home className="h-4 w-4" /> },
  { label: "Classes", href: "/teacher/classes", icon: <Users className="h-4 w-4" /> },
  { label: "Homework", href: "/teacher/homework", icon: <ClipboardList className="h-4 w-4" /> },
  { label: "Grades", href: "/teacher/grades", icon: <Award className="h-4 w-4" /> },
  { label: "Statistics", href: "/teacher/stats", icon: <BarChart3 className="h-4 w-4" /> },
  { label: "Profile", href: "/teacher/profile", icon: <UserCircle className="h-4 w-4" /> },
];

const studentNavItems: NavItem[] = [
  { label: "Dashboard", href: "/student", icon: <Home className="h-4 w-4" /> },
  { label: "My Classes", href: "/student/classes", icon: <FolderOpen className="h-4 w-4" /> },
  { label: "Homework", href: "/student/homework", icon: <BookOpen className="h-4 w-4" /> },
  { label: "Grades", href: "/student/grades", icon: <Award className="h-4 w-4" /> },
  { label: "Profile", href: "/student/profile", icon: <UserCircle className="h-4 w-4" /> },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading, loadFromStorage, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const navItems = user.role === "teacher" ? teacherNavItems : studentNavItems;

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <div className="min-h-screen flex">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r flex flex-col transition-transform duration-300 ease-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-linear-to-br from-primary to-primary/80 flex items-center justify-center shadow-md shadow-primary/20">
              <Code2 className="h-4.5 w-4.5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg tracking-tight">EduSchool</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== `/${user.role}` && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Separator />
        <div className="p-4">
          <Link
            href={`/${user.role}/profile`}
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 mb-3 px-1 py-2 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="h-8 w-8 rounded-full bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center text-xs font-bold text-primary">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground capitalize">
                {user.role}
              </p>
            </div>
          </Link>
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Log Out
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b bg-card/50 backdrop-blur flex items-center px-4 lg:px-6 sticky top-0 z-30">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden mr-2"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex-1" />
        </header>
        <main className="flex-1 p-4 lg:p-6 overflow-auto animate-fade-in">{children}</main>
      </div>
    </div>
  );
}
