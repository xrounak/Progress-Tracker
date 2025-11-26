import React from "react";
import { Button } from "@/components/ui/Button";
import type { Task, TaskLog } from "@/types/habits";

interface DateCellProps {
  task: Task;
  date: string; // ISO yyyy-mm-dd
  log: TaskLog | undefined;
  onToggle: (task: Task, date: string, nextStatus: boolean) => void;
}

export const DateCell: React.FC<DateCellProps> = ({
  task,
  date,
  log,
  onToggle
}) => {
  const done = log?.status ?? false;

  const handleClick = () => {
    onToggle(task, date, !done);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`flex h-9 w-9 items-center justify-center rounded-md border text-[11px] transition-all ${
        done
          ? "border-emerald-500/60 bg-emerald-500/15 text-emerald-300 shadow-[0_0_0_1px_rgba(16,185,129,0.25)]"
          : "border-border/60 bg-card/40 text-muted-foreground hover:bg-muted/70"
      }`}
    >
      {done ? "✓" : ""}
    </button>
  );
};


