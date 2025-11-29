import React, { useState } from "react";
import { Spinner } from "@/components/ui/Spinner";
import type { Task, TaskLog } from "@/types/habits";

interface DateCellProps {
  task: Task;
  date: string; // ISO yyyy-mm-dd
  log: TaskLog | undefined;
  onPointsChange: (task: Task, date: string, points: number) => void;
  isLoading?: boolean;
}

export const DateCell: React.FC<DateCellProps> = ({
  task,
  date,
  log,
  onPointsChange,
  isLoading = false
}) => {
  const points = log?.points_earned ?? 0;
  const [inputValue, setInputValue] = useState<string>(points > 0 ? points.toString() : "");

  // Sync local state with props when not editing
  React.useEffect(() => {
    setInputValue(points > 0 ? points.toString() : "");
  }, [points]);

  const handleBlur = () => {
    if (isLoading) return;
    let newPoints = parseInt(inputValue, 10);

    if (isNaN(newPoints) || newPoints === 0) {
      if (points !== 0) onPointsChange(task, date, 0);
      setInputValue("");
    } else {
      // Enforce max points
      if (newPoints > task.points) {
        newPoints = task.points;
        setInputValue(newPoints.toString());
      }

      if (newPoints !== points) onPointsChange(task, date, newPoints);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Allow empty or numbers only
    if (val === "" || /^\d+$/.test(val)) {
      setInputValue(val);
    }
  };

  return (
    <div className="relative flex h-9 w-9 items-center justify-center">
      {isLoading ? (
        <Spinner size="sm" />
      ) : (
        <input
          type="text"
          inputMode="numeric"
          value={inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          className={`h-full w-full rounded-md border text-center text-[11px] transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-60 ${points > 0
              ? "border-emerald-500/60 bg-emerald-500/15 text-emerald-300 shadow-[0_0_0_1px_rgba(16,185,129,0.25)]"
              : "border-border/60 bg-card/40 text-muted-foreground hover:bg-muted/70 focus:bg-background"
            }`}
        />
      )}
    </div>
  );
};
