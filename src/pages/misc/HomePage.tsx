import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useGoals } from "@/hooks/useGoals";

export const HomePage: React.FC = () => {
  const { user, loading } = useAuth();
  const { goals } = useGoals();
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);

  const isLoggedIn = !loading && !!user;

  return (
    <div className="flex min-h-[calc(100vh-60px)] items-center justify-center px-4 py-10">
      <div className="max-w-xl space-y-6 text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-emerald-400/80">
          HabitTracker
        </p>
        <h1 className="text-2xl font-semibold leading-tight text-foreground sm:text-3xl">
          Turn your habits into a{" "}
          <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            score you can actually see
          </span>
          .
        </h1>
        <p className="text-xs text-muted-foreground sm:text-sm">
          Create goals, assign points to micro-tasks, and track your streaks on a
          calendar-like grid. Built for consistency, not perfection.
        </p>
        <div className="flex flex-col items-center justify-center gap-2 sm:flex-row sm:justify-center">
          {isLoggedIn ? (
            <div className="flex flex-col">
            <Button asChild className="w-full sm:w-auto">
              <Link to="/app/dashboard">Open your dashboard</Link>
            </Button>
            <br />
            {goals.map((goal) => (
                <div
                  key={goal.id}
                  className={`flex w-full items-center justify-between gap-2 rounded-md border px-3 py-2 text-[11px] transition-colors ${
                    selectedGoalId === goal.id
                      ? "border-accent/70 bg-accent/10 text-foreground"
                      : "border-border/70 bg-card/60 text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedGoalId(goal.id)}
                    className="flex flex-1 items-center justify-between text-left"
                  >
                    <span className="font-medium truncate">{goal.title}</span>
                    <span className="ml-2 text-[10px] shrink-0">
                      {goal.duration_days} days
                    </span>
                  </button>
                  <Button asChild size="sm" variant="outline" className="shrink-0">
                    <Link to={`/app/goal/${goal.id}`}>Open grid</Link>
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <>
              <Button asChild className="w-full sm:w-auto">
                <Link to="/auth/register">Get started</Link>
              </Button>
              <Button asChild variant="outline" className="w-full sm:w-auto">
                <Link to="/auth/login">I already have an account</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

