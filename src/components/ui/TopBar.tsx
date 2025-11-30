import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/utils/cn";
import { Moon, Sun, LayoutDashboard, LogIn } from "lucide-react";

const getTitle = (pathname: string): string => {
  if (pathname.includes("/app/dashboard")) return "Dashboard";
  if (pathname.includes("/app/goals")) return "Goals";
  if (pathname.includes("/app/calendar")) return "Calendar";
  if (pathname.includes("/app/profile")) return "Profile";
  if (pathname.startsWith("/auth/login")) return "Login";
  if (pathname.startsWith("/auth/register")) return "Register";
  return "Overview";
};

export const TopBar: React.FC = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user, loading } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  const title = getTitle(location.pathname);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-30 transition-all duration-300 border-b",
        scrolled
          ? "bg-background/80 backdrop-blur-md border-border shadow-sm py-2"
          : "bg-transparent border-transparent py-4"
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="group flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
              <span className="text-lg">🎯</span>
            </div>
            <span className="hidden sm:block text-sm font-bold tracking-wider uppercase text-foreground/90 transition-colors group-hover:text-primary">
              HabitTracker
            </span>
          </Link>

          {/* Divider and Title */}
          <div className="hidden md:flex items-center gap-3 pl-4 border-l border-border/40">
            <span
              key={title}
              className="text-sm font-medium text-muted-foreground animate-in fade-in slide-in-from-left-1 duration-300"
            >
              {title}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            onClick={toggleTheme}
            className="rounded-full transition-transform hover:rotate-90 hover:bg-muted"
          >
            {theme === "dark" ? (
              <Moon className="h-5 w-5 text-blue-400 transition-all" />
            ) : (
              <Sun className="h-5 w-5 text-orange-500 transition-all" />
            )}
          </Button>

          {!loading && !user && (
            <Button
              asChild
              variant="default"
              size="sm"
              className="hidden sm:inline-flex shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
            >
              <Link to="/auth/login">
                <LogIn className="mr-2 h-4 w-4" />
                Sign in
              </Link>
            </Button>
          )}

          {!loading && user && (
            <Button
              asChild
              variant="default"
              size="sm"
              className="hidden sm:inline-flex shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
            >
              <Link to="/app/dashboard">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};


