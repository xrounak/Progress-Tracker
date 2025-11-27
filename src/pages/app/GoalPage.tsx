import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useGoal } from "@/hooks/useGoal";
import { useTasks } from "@/hooks/useTasks";
import { useTaskLogs } from "@/hooks/useTaskLogs";
import { SpreadsheetGrid } from "@/components/goal/SpreadsheetGrid";
import { ChartsSection } from "@/components/goal/ChartsSection";
import type { Task } from "@/types/habits";

const getDateRange = (startDate: string, durationDays: number): string[] => {
  const start = new Date(startDate);
  const dates: string[] = [];
  for (let i = 0; i < durationDays; i += 1) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
};

export const GoalPage: React.FC = () => {
  const params = useParams();
  const goalId = (params.goalId as string | undefined) ?? null;

  const { goal, loading: goalLoading, error: goalError } = useGoal(goalId);
  const {
    tasks,
    loading: tasksLoading
  } = useTasks(goalId);

  const taskIds = useMemo(() => tasks.map((t) => t.id), [tasks]);
  const {
    logs,
    loading: logsLoading,
    upsertLog
  } = useTaskLogs(taskIds.length ? taskIds : null);
  const [togglingCells, setTogglingCells] = useState<Set<string>>(new Set());

  const dates = useMemo(() => {
    if (!goal) return [];
    return getDateRange(goal.start_date, goal.duration_days);
  }, [goal]);

  const dailyTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    logs.forEach((log) => {
      if (!log.status) return;
      totals[log.log_date] = (totals[log.log_date] ?? 0) + log.points_earned;
    });
    return totals;
  }, [logs]);

  const handleToggle = async (task: Task, date: string, nextStatus: boolean) => {
    const cellKey = `${task.id}-${date}`;
    if (togglingCells.has(cellKey)) return;
    
    setTogglingCells((prev) => new Set(prev).add(cellKey));
    try {
      await upsertLog({
        task_id: task.id,
        log_date: date,
        status: nextStatus,
        points_earned: nextStatus ? task.points : 0
      });
    } finally {
      setTogglingCells((prev) => {
        const next = new Set(prev);
        next.delete(cellKey);
        return next;
      });
    }
  };

  const loading = goalLoading || tasksLoading || logsLoading;

  return (
    <div className="space-y-4">
      <section className="space-y-1">
        {goal ? (
          <>
            <h1 className="text-lg font-semibold text-foreground sm:text-xl">
              {goal.title}
            </h1>
            <p className="text-xs text-muted-foreground">
              {goal.duration_days} days • starting{" "}
              {new Date(goal.start_date).toLocaleDateString()}
            </p>
          </>
        ) : (
          <div className="h-10 w-40 animate-pulse rounded-md bg-muted/60" />
        )}
        {goalError && (
          <p className="text-[11px] text-red-400">
            {goalError}
          </p>
        )}
      </section>

      <section aria-label="Task spreadsheet">
        {loading && !goal && (
          <div className="space-y-2">
            <div className="h-10 animate-pulse rounded-md bg-muted/60" />
            <div className="h-40 animate-pulse rounded-md bg-muted/40" />
          </div>
        )}

        {goal && (
          <SpreadsheetGrid
            tasks={tasks}
            logs={logs}
            dates={dates}
            dailyTotals={dailyTotals}
            onToggle={handleToggle}
            togglingCells={togglingCells}
          />
        )}
      </section>

      <section aria-label="Analytics">
        <ChartsSection tasks={tasks} logs={logs} dates={dates} />
      </section>
    </div>
  );
};


