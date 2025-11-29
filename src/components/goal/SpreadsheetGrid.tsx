import React from "react";
import type { Task, TaskLog } from "@/types/habits";
import { TaskRow } from "@/components/goal/TaskRow";

interface SpreadsheetGridProps {
  tasks: Task[];
  logs: TaskLog[];
  dates: string[];
  dailyTotals: Record<string, number>;
  onPointsChange: (task: Task, date: string, points: number) => void;
  togglingCells?: Set<string>;
}

export const SpreadsheetGrid: React.FC<SpreadsheetGridProps> = ({
  tasks,
  logs,
  dates,
  dailyTotals,
  onPointsChange,
  togglingCells = new Set()
}) => {
  return (
    <div
      className="
        w-full overflow-x-auto
        scrollbar-thin scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent
        pb-4
      "
    >
      <div
        className="
          inline-block min-w-max
          rounded-2xl border border-border bg-background/50
          backdrop-blur-md shadow-lg
        "
      >
        {/* Header Row */}
        <div
          className="
            sticky top-0 z-30 flex min-w-max items-center gap-2
            border-b border-border/70
            bg-background/70 backdrop-blur-xl
            px-2 py-2 text-[11px] text-muted-foreground
          "
        >
          <div
            className="
              sticky left-0 z-[40]
              flex min-w-[140px] max-w-fit items-center
              bg-background/70 backdrop-blur-xl
              font-semibold pr-2 text-left rounded-l-xl
            "
          >
            Task
          </div>

          <div className="flex gap-2">
            {dates.map((date) => {
              const d = new Date(date);
              const day = d.getDate();
              const weekday = d.toLocaleDateString(undefined, { weekday: "short" });

              return (
                <div
                  key={date}
                  className="flex w-9 flex-col items-center justify-center gap-0.5 text-[10px]"
                >
                  <span>{day}</span>
                  <span className="text-[9px] text-muted-foreground">{weekday}</span>
                </div>
              );
            })}
          </div>

          <div className="ml-auto flex w-16 items-center justify-end pr-1 text-[10px] font-semibold">
            Total
          </div>
        </div>

        {/* Task Rows */}
        {tasks.length === 0 ? (
          <div className="px-4 py-6 text-center text-[11px] text-muted-foreground">
            No tasks yet for this goal. Add tasks to start tracking.
          </div>
        ) : (
          tasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              dates={dates}
              logs={logs}
              onPointsChange={onPointsChange}
              togglingCells={togglingCells}
            />
          ))
        )}

        {/* Daily Totals Row */}
        {tasks.length > 0 && (
          <div
            className="
              flex min-w-max items-center gap-2
              border-t border-border/70
              bg-background/70 backdrop-blur-xl
              px-2 py-2 text-[11px] text-muted-foreground
            "
          >
            <div
              className="
                sticky left-0 z-[40]
                flex min-w-[140px] items-center
                bg-background/70 backdrop-blur-xl
                font-semibold pr-2 rounded-l-xl
              "
            >
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




