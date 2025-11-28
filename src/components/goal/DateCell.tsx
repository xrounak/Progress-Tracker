import React, {  useState } from "react";
import { Spinner } from "@/components/ui/Spinner";
import type { Task, TaskLog } from "@/types/habits";

interface DateCellProps {
  task: Task;
  date: string; // ISO yyyy-mm-dd
  log: TaskLog | undefined;
  onToggle: (task: Task, date: string, nextStatus: boolean) => void;
  isLoading?: boolean;
}



export const DateCell: React.FC<DateCellProps> = ({
  task,
  date,
  log,
  onToggle,
  isLoading = false
}) => {
  const done = log?.status ?? false;
  
  const [refresh, setRefresh] = useState<number>(0);

  const handleClick = () => {
    if (isLoading) return;
    onToggle(task, date, !done);
    setRefresh(refresh + 1);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      className={`flex h-9 w-9 items-center justify-center rounded-md border text-[11px] transition-all disabled:cursor-not-allowed disabled:opacity-60 ${
        done
          ? "border-emerald-500/60 bg-emerald-500/15 text-emerald-300 shadow-[0_0_0_1px_rgba(16,185,129,0.25)]"
          : "border-border/60 bg-card/40 text-muted-foreground hover:bg-muted/70"
      }`}
    >
      {isLoading ? (
        <Spinner size="sm" />
      ) : done ? (
        "✓"
      ) : (
        ""
      )}
    </button>
  );
};


