import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { useAuth } from "@/context/AuthContext";
import { useGoals } from "@/hooks/useGoals";
import { useProfile } from "@/hooks/useProfile";
import {
  Target,
  Calendar,
  TrendingUp,
  Sparkles,
  Plus,
  ArrowRight,
  Flame,
  CheckCircle2,
  LayoutDashboard
} from "lucide-react";

export const HomePage: React.FC = () => {
  const { user, loading } = useAuth();
  const { goals } = useGoals();
  const { profile } = useProfile();

  const isLoggedIn = !loading && !!user;

  // Calculate stats
  const stats = useMemo(() => {
    const totalGoals = goals.length;
    const activeGoals = goals.filter(g => {
      const endDate = new Date(g.start_date);
      endDate.setDate(endDate.getDate() + g.duration_days);
      return endDate >= new Date();
    }).length;

    return { totalGoals, activeGoals };
  }, [goals]);

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-emerald-950/20 px-4 py-10">
        <div className="max-w-2xl space-y-8 text-center">
          {/* Hero Section */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-400 ring-1 ring-emerald-500/20">
              <Sparkles className="h-4 w-4" />
              <span>Track. Improve. Succeed.</span>
            </div>

            <h1 className="text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
              Turn your habits into a{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                score you can see
              </span>
            </h1>

            <p className="text-lg text-muted-foreground sm:text-xl">
              Create goals, assign points to micro-tasks, and track your streaks on a
              calendar-like grid. Built for consistency, not perfection.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="w-full gap-2 sm:w-auto">
              <Link to="/auth/register">
                <Sparkles className="h-4 w-4" />
                Get started free
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link to="/auth/login">I already have an account</Link>
            </Button>
          </div>

          {/* Features */}
          <div className="grid gap-4 pt-8 sm:grid-cols-3">
            <Card className="border-border/50 bg-card/50">
              <CardBody className="space-y-2 p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10">
                  <Target className="h-6 w-6 text-emerald-400" />
                </div>
                <h3 className="font-semibold text-foreground">Set Goals</h3>
                <p className="text-sm text-muted-foreground">
                  Create custom goals with tasks and point values
                </p>
              </CardBody>
            </Card>

            <Card className="border-border/50 bg-card/50">
              <CardBody className="space-y-2 p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500/10">
                  <Calendar className="h-6 w-6 text-cyan-400" />
                </div>
                <h3 className="font-semibold text-foreground">Track Daily</h3>
                <p className="text-sm text-muted-foreground">
                  Log your progress on a beautiful calendar grid
                </p>
              </CardBody>
            </Card>

            <Card className="border-border/50 bg-card/50">
              <CardBody className="space-y-2 p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/10">
                  <TrendingUp className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="font-semibold text-foreground">See Progress</h3>
                <p className="text-sm text-muted-foreground">
                  Visualize your growth with charts and stats
                </p>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Logged-in user view
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-emerald-950/20 px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Welcome Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 text-emerald-400" />
            <span>Welcome back!</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
            Hey, {profile?.name || user?.email?.split("@")[0] || "there"}! {profile?.mood_sticker || "👋"}
          </h1>
          <p className="text-muted-foreground">
            Ready to crush your goals today?
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Goals</p>
                  <p className="text-3xl font-bold text-foreground">{stats.totalGoals}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20">
                  <Target className="h-6 w-6 text-emerald-400" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-cyan-500/5">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Goals</p>
                  <p className="text-3xl font-bold text-foreground">{stats.activeGoals}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500/20">
                  <Flame className="h-6 w-6 text-cyan-400" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-purple-500/5">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-3xl font-bold text-foreground">{stats.totalGoals - stats.activeGoals}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/20">
                  <CheckCircle2 className="h-6 w-6 text-purple-400" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-orange-500/5">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-3xl font-bold text-foreground">
                    {goals.filter(g => {
                      const startDate = new Date(g.start_date);
                      const currentMonth = new Date().getMonth();
                      return startDate.getMonth() === currentMonth;
                    }).length}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/20">
                  <TrendingUp className="h-6 w-6 text-orange-400" />
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="group cursor-pointer transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
            <Link to="/app/goals">
              <CardBody className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20">
                  <Plus className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">Create New Goal</h3>
                  <p className="text-sm text-muted-foreground">Start tracking a new habit</p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
              </CardBody>
            </Link>
          </Card>

          <Card className="group cursor-pointer transition-all hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10">
            <Link to="/app/calendar">
              <CardBody className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 group-hover:bg-emerald-500/20">
                  <Calendar className="h-6 w-6 text-emerald-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">View Calendar</h3>
                  <p className="text-sm text-muted-foreground">See your progress grid</p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-emerald-400" />
              </CardBody>
            </Link>
          </Card>

          <Card className="group cursor-pointer transition-all hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10">
            <Link to="/app/dashboard">
              <CardBody className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500/10 group-hover:bg-cyan-500/20">
                  <LayoutDashboard className="h-6 w-6 text-cyan-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">Dashboard</h3>
                  <p className="text-sm text-muted-foreground">View detailed analytics</p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-cyan-400" />
              </CardBody>
            </Link>
          </Card>
        </div>

        {/* Recent Goals */}
        {goals.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">Your Goals</h2>
                <Button asChild variant="ghost" size="sm" className="gap-2">
                  <Link to="/app/goals">
                    View all
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardBody className="space-y-3">
              {goals.slice(0, 5).map((goal) => {
                const endDate = new Date(goal.start_date);
                endDate.setDate(endDate.getDate() + goal.duration_days);
                const isActive = endDate >= new Date();

                return (
                  <Link
                    key={goal.id}
                    to={`/app/goal/${goal.id}`}
                    className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card/50 p-4 transition-all hover:border-primary/50 hover:bg-card"
                  >
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-foreground">{goal.title}</h3>
                        {isActive && (
                          <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {goal.duration_days} days • Started {new Date(goal.start_date).toLocaleDateString()}
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  </Link>
                );
              })}
            </CardBody>
          </Card>
        )}

        {/* Empty State */}
        {goals.length === 0 && (
          <Card className="border-dashed">
            <CardBody className="flex flex-col items-center justify-center gap-4 py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Target className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">No goals yet</h3>
                <p className="text-sm text-muted-foreground">
                  Create your first goal to start tracking your progress
                </p>
              </div>
              <Button asChild className="gap-2">
                <Link to="/app/goals">
                  <Plus className="h-4 w-4" />
                  Create Your First Goal
                </Link>
              </Button>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
};
