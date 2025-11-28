import React from "react";
import type { Task, TaskLog } from "@/types/habits";
import { TaskRow } from "@/components/goal/TaskRow";

interface SpreadsheetGridProps {
  tasks: Task[];
  logs: TaskLog[];
  dates: string[];
  dailyTotals: Record<string, number>;
  onToggle: (task: Task, date: string, nextStatus: boolean) => void;
  togglingCells?: Set<string>;
}

export const SpreadsheetGrid: React.FC<SpreadsheetGridProps> = ({
  tasks,
  logs,
  dates,
  dailyTotals,
  onToggle,
  togglingCells = new Set()
}) => {
  return (
    <div className="w-screen max-w-full overflow-x-auto">
      <div className="inline-block min-w-max rounded-lg border border-border bg-card/60 shadow-soft">

        {/* Header row */}
        <div className="sticky top-0 z-20 flex min-w-max items-center gap-2 border-b border-border/80 bg-background/95 px-2 py-2 text-[11px] text-muted-foreground backdrop-blur">
          <div className="sticky left-0 z-30 flex w-40 items-center bg-background/95 pr-2 text-left font-semibold">
            Task
          </div>
          <div className="flex gap-2">
            {dates.map((date) => {
              const d = new Date(date);
              const day = d.getDate();
              const weekday = d.toLocaleDateString(undefined, { weekday: "short" });

              return (
                <div key={date} className="flex w-9 flex-col items-center justify-center gap-0.5 text-[10px]">
                  <span>{day}</span>
                  <span className="text-[9px] text-muted-foreground">{weekday}</span>
                </div>
              );
            })}
          </div>
          <div className="ml-auto flex w-16 items-center justify-end pr-1 text-[10px] font-semibold">Total</div>
        </div>

        {/* Task rows */}
        {tasks.length === 0 ? (
          <div className="px-4 py-6 text-center text-[11px] text-muted-foreground">
            No tasks yet for this goal. Add some tasks from the Goals page to start tracking.
          </div>
        ) : (
          tasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              dates={dates}
              logs={logs}
              onToggle={onToggle}
              togglingCells={togglingCells}
            />
          ))
        )}

        {/* Daily totals */}
        {tasks.length > 0 && (
          <div className="flex min-w-max items-center gap-2 border-t border-border/80 bg-background/90 px-2 py-2 text-[11px] text-muted-foreground">
            <div className="sticky left-0 z-10 flex w-40 items-center bg-background/90 pr-2 text-left font-semibold">
              Daily points
            </div>
            <div className="flex gap-2">
              {dates.map((date) => (
                <div key={date} className="flex w-9 items-center justify-center text-[10px]">
                  {dailyTotals[date] ?? 0}
                </div>
              ))}
            </div>
            <div className="ml-auto flex w-16 items-center justify-end pr-1 text-[10px] font-semibold">
              {Object.values(dailyTotals).reduce((sum, v) => sum + v, 0)} pts
            </div>
          </div>
        )}
      </div>
    </div>
  );
};



