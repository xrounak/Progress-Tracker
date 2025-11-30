import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

const getTitle = (pathname: string): string => {
  if (pathname.includes("/app/dashboard")) return "Dashboard";
  if (pathname.includes("/app/goals")) return "Goals";
  if (pathname.includes("/app/calendar")) return "Calendar";
  if (pathname.includes("/app/profile")) return "Profile";
  if (pathname.startsWith("/auth/login")) return "Login";
  if (pathname.startsWith("/auth/register")) return "Register";
  return "HabitTracker";
};

export const TopBar: React.FC = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user, loading } = useAuth();

  const title = getTitle(location.pathname);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3">
        <div className="flex items-center gap-3">
{/* 
          <span className="text-sm font-medium text-foreground/80 sm:text-base">
            {title}
          </span> */}
          <Link
            to="/"
            className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground"
          >
            HabitTracker
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            onClick={toggleTheme}
          >
            <span className="text-lg">{theme === "dark" ? "🌙" : "☀️"}</span>
          </Button>

          {!loading && !user && (
            <Button
              asChild
              variant="outline"
              size="sm"
              className="hidden sm:inline-flex"
            >
              <Link to="/auth/login">Sign in</Link>
            </Button>
          )}

          {!loading && user && (
            <Button
              asChild
              variant="outline"
              size="sm"
              className="hidden sm:inline-flex"
            >
              <Link to="/app/dashboard">Open app</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};


