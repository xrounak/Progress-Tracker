import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useGoal } from "@/hooks/useGoal";
import { useTasks } from "@/hooks/useTasks";
import { useTaskLogs } from "@/hooks/useTaskLogs";
import { SpreadsheetGrid } from "@/components/goal/SpreadsheetGrid";
import { MobileGoalView } from "@/components/goal/MobileGoalView";
import { ReportDialog } from "@/components/goal/ReportDialog";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/Button";

// ... existing imports

// ... inside GoalPage component


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
  const [isReportOpen, setIsReportOpen] = useState(false);

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

  const handlePointsChange = async (task: Task, date: string, points: number) => {
    const cellKey = `${task.id}-${date}`;
    if (togglingCells.has(cellKey)) return;

    setTogglingCells((prev) => new Set(prev).add(cellKey));
    try {
      await upsertLog({
        task_id: task.id,
        log_date: date,
        status: points > 0,
        points_earned: points
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
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
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
        </div>

        {goal && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsReportOpen(true)}
            className="gap-2 text-xs h-8 w-full sm:w-auto"
          >
            <Download className="h-3.5 w-3.5" />
            Download Report
          </Button>
        )}
      </section>

      {goal && (
        <ReportDialog
          isOpen={isReportOpen}
          onClose={() => setIsReportOpen(false)}
          goalTitle={goal.title}
          tasks={tasks}
          logs={logs}
          dailyTotals={dailyTotals}
          dates={dates}
        />
      )}

      <section aria-label="Task spreadsheet">
        {loading && !goal && (
          <div className="space-y-2">
            <div className="h-10 animate-pulse rounded-md bg-muted/60" />
            <div className="h-40 animate-pulse rounded-md bg-muted/40" />
          </div>
        )}

        {goal && (
          <>
            <div className="hidden md:block">
              <SpreadsheetGrid
                tasks={tasks}
                logs={logs}
                dates={dates}
                dailyTotals={dailyTotals}
                onPointsChange={handlePointsChange}
                togglingCells={togglingCells}
              />
            </div>
            <div className="block md:hidden">
              <MobileGoalView
                tasks={tasks}
                logs={logs}
                dates={dates}
                onPointsChange={handlePointsChange}
                togglingCells={togglingCells}
              />
            </div>
          </>
        )}
      </section>

      <section aria-label="Analytics">
        <ChartsSection tasks={tasks} logs={logs} dates={dates} />
      </section>
    </div>
  );
};


