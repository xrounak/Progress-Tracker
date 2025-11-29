import React, { useEffect, useMemo, useState } from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useGoals } from "@/hooks/useGoals";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/supabase/client";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";
import { Loader2, Plus, Trophy, Target, Zap, Activity } from "lucide-react";

interface RecentLog {
  id: string;
  task_id: string;
  points_earned: number;
  created_at: string;
  tasks: {
    title: string;
    goal_id: string;
  };
}

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { goals, loading: goalsLoading } = useGoals();
  const [recentLogs, setRecentLogs] = useState<RecentLog[]>([]);
  const [todayPoints, setTodayPoints] = useState(0);
  const [weeklyActivity, setWeeklyActivity] = useState<{ date: string; points: number }[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      setLoadingStats(true);
      const today = new Date().toISOString().slice(0, 10);

      // Fetch today's points
      const { data: todayLogs } = await supabase
        .from("task_logs")
        .select("points_earned")
        .eq("log_date", today);

      const points = todayLogs?.reduce((sum, log) => sum + log.points_earned, 0) ?? 0;
      setTodayPoints(points);

      // Fetch recent activity
      const { data: logs } = await supabase
        .from("task_logs")
        .select(`
          id,
          task_id,
          points_earned,
          created_at,
          tasks (
            title,
            goal_id
          )
        `)
        .order("created_at", { ascending: false })
        .limit(5);

      if (logs) {
        // @ts-ignore - Supabase types are sometimes tricky with joins
        setRecentLogs(logs as RecentLog[]);
      }

      // Fetch last 7 days activity for chart
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return d.toISOString().slice(0, 10);
      });

      const { data: weekLogs } = await supabase
        .from("task_logs")
        .select("log_date, points_earned")
        .in("log_date", last7Days);

      const activityMap = (weekLogs || []).reduce((acc, log) => {
        acc[log.log_date] = (acc[log.log_date] || 0) + log.points_earned;
        return acc;
      }, {} as Record<string, number>);

      const activityData = last7Days.map(date => ({
        date: new Date(date).toLocaleDateString(undefined, { weekday: 'short' }),
        points: activityMap[date] || 0
      }));

      setWeeklyActivity(activityData);
      setLoadingStats(false);
    };

    void fetchStats();
  }, [user]);

  const activeGoalsCount = useMemo(() => {
    const today = new Date();
    return goals.filter(g => {
      const start = new Date(g.start_date);
      const end = new Date(start);
      end.setDate(start.getDate() + g.duration_days);
      return start <= today && today <= end;
    }).length;
  }, [goals]);

  if (goalsLoading || loadingStats) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome back!
          </h1>
          <p className="text-sm text-muted-foreground">
            Here's what's happening with your goals today.
          </p>
        </div>
        <Button onClick={() => navigate("/app/goals")} className="gap-2">
          <Plus className="h-4 w-4" />
          New Goal
        </Button>
      </section>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-l-4 border-l-primary bg-card/50 backdrop-blur-sm">
          <CardBody className="flex items-center gap-4 p-6">
            <div className="rounded-full bg-primary/10 p-3 text-primary">
              <Zap className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Points Today</p>
              <h3 className="text-2xl font-bold">{todayPoints}</h3>
            </div>
          </CardBody>
        </Card>

        <Card className="border-l-4 border-l-emerald-500 bg-card/50 backdrop-blur-sm">
          <CardBody className="flex items-center gap-4 p-6">
            <div className="rounded-full bg-emerald-500/10 p-3 text-emerald-500">
              <Target className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Goals</p>
              <h3 className="text-2xl font-bold">{activeGoalsCount}</h3>
            </div>
          </CardBody>
        </Card>

        <Card className="border-l-4 border-l-amber-500 bg-card/50 backdrop-blur-sm">
          <CardBody className="flex items-center gap-4 p-6">
            <div className="rounded-full bg-amber-500/10 p-3 text-amber-500">
              <Trophy className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Goals</p>
              <h3 className="text-2xl font-bold">{goals.length}</h3>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Activity Chart */}
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Weekly Activity
            </h2>
          </CardHeader>
          <CardBody className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyActivity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ fill: "hsl(var(--muted)/0.3)" }}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                  }}
                />
                <Bar dataKey="points" radius={[4, 4, 0, 0]}>
                  {weeklyActivity.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="hsl(var(--primary))" fillOpacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Recent Activity</h2>
          </CardHeader>
          <CardBody>
            {recentLogs.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No recent activity.</p>
            ) : (
              <div className="space-y-4">
                {recentLogs.map((log) => (
                  <div key={log.id} className="flex items-start gap-3 border-b border-border/50 pb-3 last:border-0 last:pb-0">
                    <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{log.tasks?.title || "Unknown Task"}</p>
                      <p className="text-xs text-muted-foreground">
                        Earned <span className="font-semibold text-emerald-500">+{log.points_earned} pts</span>
                      </p>
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
