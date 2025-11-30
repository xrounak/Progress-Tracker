import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useGoals } from "@/hooks/useGoals";
import { AddGoalDialog } from "@/components/goal/AddGoalDialog";
import { EditGoalDialog } from "@/components/goal/EditGoalDialog";
import { useTasks } from "@/hooks/useTasks";
import { Plus, Pencil, Trash2, Target } from "lucide-react";
import type { Goal } from "@/types/habits";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/context/ToastContext";

export const GoalsPage: React.FC = () => {
  const { goals, loading: goalsLoading, error: goalsError, createGoal, updateGoal, deleteGoal } = useGoals();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const { createTask } = useTasks(null);

  // Confirm Dialog State
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState<{ id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { showToast } = useToast();

  const handleDeleteClick = (goal: Goal) => {
    setGoalToDelete({ id: goal.id, title: goal.title });
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!goalToDelete) return;
    setIsDeleting(true);
    try {
      await deleteGoal(goalToDelete.id);
      showToast("Goal deleted successfully", "success");
    } catch (error) {
      showToast("Failed to delete goal", "error");
    } finally {
      setIsDeleting(false);
      setConfirmOpen(false);
      setGoalToDelete(null);
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
              <div className="flex flex-col items-center justify-center py-8 text-center space-y-3">
                <div className="p-3 bg-muted/50 rounded-full">
                  <Target className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">No goals yet</p>
                  <p className="text-[11px] text-muted-foreground max-w-[200px]">
                    Start your journey by creating your first goal or challenge above.
                  </p>
                </div>
              </div>
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
                    className="h-8 w-8 p-0"
                    title="Edit goal"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteClick(goal)}
                    className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                    title="Delete goal"
                  >
                    <Trash2 className="h-4 w-4" />
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

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Goal"
        message={`Are you sure you want to delete "${goalToDelete?.title}"? This will also delete all associated tasks and cannot be undone.`}
        confirmText="Delete Goal"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
};
