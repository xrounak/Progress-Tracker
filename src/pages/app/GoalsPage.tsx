import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useGoals } from "@/hooks/useGoals";
import { useTasks } from "@/hooks/useTasks";
import { useTaskLogs } from "@/hooks/useTaskLogs";
import type { Task } from "@/types/habits";

const todayIso = () => new Date().toISOString().slice(0, 10);

export const GoalsPage: React.FC = () => {
  const { goals, loading: goalsLoading, error: goalsError, createGoal } =
    useGoals();
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);

  const {
    tasks,
    loading: tasksLoading,
    createTask
  } = useTasks(selectedGoalId);

  const taskIds = useMemo(() => tasks.map((t) => t.id), [tasks]);
  const { logs, upsertLog } = useTaskLogs(taskIds.length ? taskIds : null);

  const [goalTitle, setGoalTitle] = useState("");
  const [goalDuration, setGoalDuration] = useState(21);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskPoints, setTaskPoints] = useState(10);

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle.trim()) return;
    await createGoal({
      title: goalTitle.trim(),
      duration_days: goalDuration,
      start_date: todayIso()
    });
    setGoalTitle("");
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGoalId || !taskTitle.trim()) return;
    await createTask({
      goal_id: selectedGoalId,
      title: taskTitle.trim(),
      points: taskPoints
    });
    setTaskTitle("");
  };

  const isTaskDoneToday = (task: Task): boolean => {
    const log = logs.find(
      (l) => l.task_id === task.id && l.log_date === todayIso()
    );
    return log?.status ?? false;
  };

  const toggleTaskToday = async (task: Task) => {
    const done = isTaskDoneToday(task);
    await upsertLog({
      task_id: task.id,
      log_date: todayIso(),
      status: !done,
      points_earned: !done ? task.points : 0
    });
  };

  const selectedGoal = goals.find((g) => g.id === selectedGoalId) ?? null;

  return (
    <div className="space-y-4">
      <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-foreground sm:text-xl">
            Goals
          </h1>
          <p className="text-xs text-muted-foreground">
            Create 21-day challenges, long-term goals, or micro-habits.
          </p>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1.6fr)]">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-foreground">
                Your goals
              </span>
              {goalsLoading && (
                <span className="text-[11px] text-muted-foreground">
                  Loading...
                </span>
              )}
            </div>
          </CardHeader>
          <CardBody className="space-y-4 text-xs">
            <form onSubmit={handleCreateGoal} className="space-y-2">
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-muted-foreground">
                  New goal title
                </label>
                <Input
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  placeholder="21-day morning routine"
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium text-muted-foreground">
                    Duration (days)
                  </label>
                  <Input
                    type="number"
                    min={1}
                    value={goalDuration}
                    onChange={(e) =>
                      setGoalDuration(Number(e.target.value) || 1)
                    }
                    className="w-28"
                  />
                </div>
                <Button type="submit" size="sm" className="mt-5">
                  Add goal
                </Button>
              </div>
            </form>

            {goalsError && (
              <p className="text-[11px] text-red-400">{goalsError}</p>
            )}

            <div className="space-y-1">
              {goals.length === 0 && (
                <p className="text-[11px] text-muted-foreground">
                  No goals yet. Create your first challenge above.
                </p>
              )}
              {goals.map((goal) => (
                <div
                  key={goal.id}
                  className={`flex w-full items-center justify-between gap-2 rounded-md border px-3 py-2 text-[11px] transition-colors ${
                    selectedGoalId === goal.id
                      ? "border-accent/70 bg-accent/10 text-foreground"
                      : "border-border/70 bg-card/60 text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedGoalId(goal.id)}
                    className="flex flex-1 items-center justify-between text-left"
                  >
                    <span className="font-medium truncate">{goal.title}</span>
                    <span className="ml-2 text-[10px] shrink-0">
                      {goal.duration_days} days
                    </span>
                  </button>
                  <Button asChild size="sm" variant="outline" className="shrink-0">
                    <Link to={`/app/goal/${goal.id}`}>Open grid</Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-foreground">
                Tasks &amp; daily check-in
              </span>
              {tasksLoading && (
                <span className="text-[11px] text-muted-foreground">
                  Loading...
                </span>
              )}
            </div>
          </CardHeader>
          <CardBody className="space-y-4 text-xs">
            {!selectedGoal && (
              <p className="text-[11px] text-muted-foreground">
                Select a goal on the left to manage its tasks.
              </p>
            )}

            {selectedGoal && (
              <>
                <p className="text-[11px] text-muted-foreground">
                  Goal:{" "}
                  <span className="font-medium text-foreground">
                    {selectedGoal.title}
                  </span>{" "}
                  • {selectedGoal.duration_days} days
                </p>

                <form
                  onSubmit={handleCreateTask}
                  className="flex flex-wrap items-end gap-2"
                >
                  <div className="min-w-[160px] flex-1 space-y-1.5">
                    <label className="text-[11px] font-medium text-muted-foreground">
                      New task
                    </label>
                    <Input
                      value={taskTitle}
                      onChange={(e) => setTaskTitle(e.target.value)}
                      placeholder="Drink 500ml water"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-medium text-muted-foreground">
                      Points
                    </label>
                    <Input
                      type="number"
                      min={1}
                      value={taskPoints}
                      onChange={(e) =>
                        setTaskPoints(Number(e.target.value) || 1)
                      }
                      className="w-24"
                    />
                  </div>
                  <Button type="submit" size="sm">
                    Add task
                  </Button>
                </form>

                <div className="space-y-1">
                  {tasks.length === 0 && (
                    <p className="text-[11px] text-muted-foreground">
                      No tasks yet. Add a few micro-actions above.
                    </p>
                  )}
                  {tasks.map((task) => {
                    const doneToday = isTaskDoneToday(task);
                    return (
                      <div
                        key={task.id}
                        className="flex items-center justify-between rounded-md border border-border/70 bg-card/60 px-3 py-2"
                      >
                        <div>
                          <p className="text-[11px] font-medium text-foreground">
                            {task.title}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {task.points} pts • today:{" "}
                            <span
                              className={doneToday ? "text-emerald-400" : ""}
                            >
                              {doneToday ? "done" : "not done"}
                            </span>
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant={doneToday ? "outline" : "primary"}
                          onClick={() => void toggleTaskToday(task)}
                        >
                          {doneToday ? "Undo" : "Mark done"}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

