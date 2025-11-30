import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useGoals } from "@/hooks/useGoals";
import { AddGoalDialog } from "@/components/goal/AddGoalDialog";
import { EditGoalDialog } from "@/components/goal/EditGoalDialog";
import { useTasks } from "@/hooks/useTasks";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { Goal } from "@/types/habits";

export const GoalsPage: React.FC = () => {
  const { goals, loading: goalsLoading, error: goalsError, createGoal, updateGoal, deleteGoal } = useGoals();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const { createTask } = useTasks(null);

  const handleDeleteGoal = async (goalId: string, goalTitle: string) => {
    if (confirm(`Are you sure you want to delete "${goalTitle}"? This will also delete all associated tasks.`)) {
      await deleteGoal(goalId);
    }
  };

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
          {/* Add Goal Button */}
          <Button
            onClick={() => setIsDialogOpen(true)}
            size="sm"
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Goal
          </Button>

          {goalsError && (
            <p className="text-[11px] text-red-400">{goalsError}</p>
          )}

          <div className="space-y-2">
            {goals.length === 0 && (
              <p className="text-[11px] text-muted-foreground">
                No goals yet. Create your first challenge above.
              </p>
            )}
            {goals.map((goal) => (
              <div
                key={goal.id}
                className="flex items-center justify-between gap-2 rounded-md border border-border/70 bg-card/60 px-3 py-2.5 text-[11px] transition-colors hover:bg-muted/70"
              >
                <Link
                  to={`/app/goal/${goal.id}`}
                  className="flex-1 flex items-center justify-between text-foreground hover:text-foreground"
                >
                  <span className="font-medium truncate">{goal.title}</span>
                  <span className="ml-2 text-[10px] text-muted-foreground shrink-0">
                    {goal.duration_days} days
                  </span>
                </Link>
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingGoal(goal)}
                    className="h-7 w-7 p-0"
                    title="Edit goal"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteGoal(goal.id, goal.title)}
                    className="h-7 w-7 p-0 text-red-400 hover:text-red-300"
                    title="Delete goal"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Add Goal Dialog */}
      <AddGoalDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onCreateGoal={createGoal}
        onCreateTask={createTask}
      />

      {/* Edit Goal Dialog */}
      <EditGoalDialog
        isOpen={!!editingGoal}
        onClose={() => setEditingGoal(null)}
        goal={editingGoal}
        onUpdateGoal={updateGoal}
      />
    </div>
  );
};
