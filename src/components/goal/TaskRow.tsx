import React from "react";
import type { Task, TaskLog } from "@/types/habits";
import { DateCell } from "@/components/goal/DateCell";

interface TaskRowProps {
  task: Task;
  dates: string[];
  logs: TaskLog[];
  onToggle: (task: Task, date: string, nextStatus: boolean) => void;
  togglingCells?: Set<string>;
}

export const TaskRow: React.FC<TaskRowProps> = ({
  task,
  dates,
  logs,
  onToggle,
  togglingCells = new Set()
}) => {
  const totalPoints = logs
    .filter((l) => l.task_id === task.id && l.status)
    .reduce((sum, l) => sum + l.points_earned, 0);

  return (
    <div className="flex min-w-max items-stretch gap-2 border-b border-border/60 px-2 py-2 text-xs last:border-b-0">
      <div className="sticky left-0 z-10 flex w-40 items-center bg-background/90 pr-2 text-left text-[11px] font-medium text-foreground">
        <span className="truncate">{task.title}</span>
      </div>
      <div className="flex gap-2">
        {dates.map((date) => {
          const log = logs.find(
            (l) => l.task_id === task.id && l.log_date === date
          );
          return (
            <div key={date} className="flex w-9 items-center justify-center">
              <DateCell
                task={task}
                date={date}
                log={log}
                onToggle={onToggle}
                isLoading={togglingCells.has(`${task.id}-${date}`)}
              />
            </div>
          );
        })}
      </div>
      <div className="ml-auto flex w-16 items-center justify-end pr-1 text-[11px] text-muted-foreground">
        {totalPoints} pts
      </div>
    </div>
  );
};

