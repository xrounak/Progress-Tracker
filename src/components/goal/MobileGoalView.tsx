import React, { useState, useMemo, useEffect } from "react";
import { ChevronLeft, ChevronRight, CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/utils/cn"; // Assuming you have a cn utility, if not I'll use classnames or template literals
import type { Task, TaskLog } from "@/types/habits";

interface MobileGoalViewProps {
    tasks: Task[];
    logs: TaskLog[];
    dates: string[];
    onPointsChange: (task: Task, date: string, points: number) => void;
    togglingCells?: Set<string>;
}

export const MobileGoalView: React.FC<MobileGoalViewProps> = ({
    tasks,
    logs,
    dates,
    onPointsChange,
    togglingCells = new Set(),
}) => {
    // Default to the last date (usually "today" or most recent)
    const [selectedDateIndex, setSelectedDateIndex] = useState<number>(dates.length - 1);

    useEffect(() => {
        if (dates.length > 0) {
            setSelectedDateIndex(dates.length - 1);
        }
    }, [dates.length]);

    const selectedDate = dates[selectedDateIndex];

    const handlePrev = () => {
        if (selectedDateIndex > 0) setSelectedDateIndex((prev) => prev - 1);
    };

    const handleNext = () => {
        if (selectedDateIndex < dates.length - 1) setSelectedDateIndex((prev) => prev + 1);
    };

    const isToday = (dateString: string) => {
        const today = new Date().toISOString().slice(0, 10);
        return dateString === today;
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, {
            weekday: "long",
            month: "long",
            day: "numeric",
        });
    };

    const getTaskPoints = (taskId: string, date: string) => {
        const log = logs.find((l) => l.task_id === taskId && l.log_date === date);
        return log?.points_earned ?? 0;
    };

    if (!selectedDate) {
        return <div className="p-4 text-center text-muted-foreground">No dates available</div>;
    }

    return (
        <div className="flex flex-col gap-4 pb-20">
            {/* Date Navigation */}
            <div className="flex items-center justify-between rounded-xl border border-border bg-card/50 p-2 backdrop-blur-sm">
                <button
                    onClick={handlePrev}
                    disabled={selectedDateIndex === 0}
                    className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted disabled:opacity-30"
                >
                    <ChevronLeft className="h-5 w-5" />
                </button>

                <div className="text-center">
                    <div className="text-sm font-semibold">{formatDate(selectedDate)}</div>
                    {isToday(selectedDate) && (
                        <div className="text-[10px] font-medium text-primary uppercase tracking-wider">Today</div>
                    )}
                </div>

                <button
                    onClick={handleNext}
                    disabled={selectedDateIndex === dates.length - 1}
                    className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted disabled:opacity-30"
                >
                    <ChevronRight className="h-5 w-5" />
                </button>
            </div>

            {/* Task List */}
            <div className="space-y-3">
                {tasks.map((task) => {
                    const points = getTaskPoints(task.id, selectedDate);
                    const isCompleted = points > 0;
                    const isToggling = togglingCells.has(`${task.id}-${selectedDate}`);

                    return (
                        <div
                            key={task.id}
                            className={cn(
                                "flex items-center justify-between gap-4 rounded-xl border p-4 transition-all",
                                isCompleted
                                    ? "border-primary/50 bg-primary/10"
                                    : "border-border bg-card/30"
                            )}
                        >
                            <div className="flex flex-col gap-1">
                                <span className={cn("font-medium", isCompleted && "text-muted-foreground")}>
                                    {task.title}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    Max: {task.points} pts
                                </span>
                            </div>

                            <div className={cn("relative flex items-center justify-end", isToggling && "opacity-70")}>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    placeholder="0"
                                    defaultValue={points > 0 ? points.toString() : ""}
                                    onBlur={(e) => {
                                        let val = parseInt(e.target.value, 10);
                                        if (isNaN(val) || val === 0) {
                                            if (points !== 0) onPointsChange(task, selectedDate, 0);
                                            e.target.value = "";
                                        } else {
                                            if (val > task.points) {
                                                val = task.points;
                                                e.target.value = val.toString();
                                            }
                                            if (val !== points) onPointsChange(task, selectedDate, val);
                                        }
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.currentTarget.blur();
                                        }
                                    }}
                                    className={cn(
                                        "h-12 w-16 rounded-lg border text-center text-lg font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-primary/50",
                                        points > 0
                                            ? "border-emerald-500/60 bg-emerald-500/15 text-emerald-300 shadow-[0_0_0_1px_rgba(16,185,129,0.25)]"
                                            : "border-border/60 bg-card/40 text-foreground focus:bg-background"
                                    )}
                                />
                            </div>
                        </div>
                    );
                })}

                {tasks.length === 0 && (
                    <div className="py-8 text-center text-sm text-muted-foreground">
                        No tasks for this goal yet.
                    </div>
                )}
            </div>
        </div>
    );
};
