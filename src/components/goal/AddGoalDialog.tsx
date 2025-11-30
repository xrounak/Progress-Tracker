import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { X, Plus, Sparkles } from "lucide-react";
import { useToast } from "@/context/ToastContext";

interface TaskInput {
    id: string;
    title: string;
    points: number;
}

interface AddGoalDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onCreateGoal: (goalData: {
        title: string;
        duration_days: number;
        start_date: string;
    }) => Promise<{ id: string } | undefined>;
    onCreateTask: (taskData: {
        goal_id: string;
        title: string;
        points: number;
    }) => Promise<void>;
}

const todayIso = () => new Date().toISOString().slice(0, 10);

export const AddGoalDialog: React.FC<AddGoalDialogProps> = ({
    isOpen,
    onClose,
    onCreateGoal,
    onCreateTask,
}) => {
    const [goalTitle, setGoalTitle] = useState("");
    const [duration, setDuration] = useState(21);
    const [tasks, setTasks] = useState<TaskInput[]>([
        { id: "1", title: "", points: 10 },
        { id: "2", title: "", points: 10 },
        { id: "3", title: "", points: 10 },
    ]);
    const [isCreating, setIsCreating] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState("");

    const { showToast } = useToast();

    const handleAddTask = () => {
        const newTask: TaskInput = {
            id: Date.now().toString(),
            title: "",
            points: 10,
        };
        setTasks([...tasks, newTask]);
    };

    const handleRemoveTask = (id: string) => {
        if (tasks.length > 1) {
            setTasks(tasks.filter((task) => task.id !== id));
        }
    };

    const handleTaskChange = (id: string, field: "title" | "points", value: string | number) => {
        setTasks(
            tasks.map((task) =>
                task.id === id ? { ...task, [field]: value } : task
            )
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Validation
        if (!goalTitle.trim()) {
            showToast("Please enter a goal title", "error");
            return;
        }

        const validTasks = tasks.filter((task) => task.title.trim());
        if (validTasks.length === 0) {
            showToast("Please add at least one task", "error");
            return;
        }

        setIsCreating(true);

        try {
            // Create the goal first and get the returned goal
            const newGoal = await onCreateGoal({
                title: goalTitle.trim(),
                duration_days: duration,
                start_date: todayIso(),
            });

            if (newGoal) {
                // Create all tasks for this goal
                for (const task of validTasks) {
                    await onCreateTask({
                        goal_id: newGoal.id,
                        title: task.title.trim(),
                        points: task.points,
                    });
                }
            }

            // Show success message
            setShowSuccess(true);
            showToast("Goal created successfully! 🎉", "success");

            // Reset form after a delay
            setTimeout(() => {
                setShowSuccess(false);
                resetForm();
                onClose();
            }, 2000);
        } catch (err) {
            showToast("Failed to create goal. Please try again.", "error");
            setIsCreating(false);
        }
    };

    const resetForm = () => {
        setGoalTitle("");
        setDuration(21);
        setTasks([
            { id: "1", title: "", points: 10 },
            { id: "2", title: "", points: 10 },
            { id: "3", title: "", points: 10 },
        ]);
        setIsCreating(false);
        setError("");
    };

    const handleClose = () => {
        if (!isCreating) {
            resetForm();
            onClose();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Create New Goal">
            {showSuccess ? (
                <div className="flex flex-col items-center justify-center py-8 space-y-4">
                    <div className="rounded-full bg-emerald-500/20 p-4">
                        <Sparkles className="h-12 w-12 text-emerald-400" />
                    </div>
                    <div className="text-center space-y-2">
                        <h3 className="text-xl font-semibold text-foreground">
                            Congratulations! 🎉
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Your goal has been created successfully!
                        </p>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                    {/* Goal Title */}
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">
                            Goal Title *
                        </label>
                        <Input
                            value={goalTitle}
                            onChange={(e) => setGoalTitle(e.target.value)}
                            placeholder="e.g., 21-day morning routine"
                            disabled={isCreating}
                            className="h-9 text-sm"
                        />
                    </div>

                    {/* Duration */}
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">
                            Duration (days)
                        </label>
                        <Input
                            type="number"
                            min={1}
                            value={duration}
                            onChange={(e) => setDuration(Number(e.target.value) || 1)}
                            disabled={isCreating}
                            className="w-32 h-9 text-sm"
                        />
                    </div>

                    {/* Tasks */}
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground">
                            Tasks
                        </label>
                        <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
                            {tasks.map((task, index) => (
                                <div
                                    key={task.id}
                                    className="flex flex-col sm:flex-row sm:items-end gap-2 p-2 rounded-lg border border-border/70 bg-card/60"
                                >
                                    <div className="flex-1 space-y-1 w-full">
                                        <label className="text-[10px] font-medium text-muted-foreground">
                                            Task {index + 1}
                                        </label>
                                        <Input
                                            value={task.title}
                                            onChange={(e) =>
                                                handleTaskChange(task.id, "title", e.target.value)
                                            }
                                            placeholder="e.g., Drink 500ml water"
                                            disabled={isCreating}
                                            className="h-8 text-xs"
                                        />
                                    </div>
                                    <div className="flex items-end gap-2 w-full sm:w-auto">
                                        <div className="space-y-1 flex-1 sm:flex-none">
                                            <label className="text-[10px] font-medium text-muted-foreground">
                                                Points
                                            </label>
                                            <Input
                                                type="number"
                                                min={1}
                                                value={task.points}
                                                onChange={(e) =>
                                                    handleTaskChange(
                                                        task.id,
                                                        "points",
                                                        Number(e.target.value) || 1
                                                    )
                                                }
                                                disabled={isCreating}
                                                className="w-full sm:w-16 h-8 text-xs"
                                            />
                                        </div>
                                        {tasks.length > 1 && (
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleRemoveTask(task.id)}
                                                disabled={isCreating}
                                                className="shrink-0 h-8 w-8 p-0"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Add More Task Button */}
                        <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={handleAddTask}
                            disabled={isCreating}
                            className="w-full h-8 text-xs"
                        >
                            <Plus className="h-3.5 w-3.5 mr-2" />
                            Add More Task
                        </Button>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-md p-2">
                            {error}
                        </p>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={isCreating}
                            className="flex-1 h-9"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            isLoading={isCreating}
                            disabled={isCreating}
                            className="flex-1 h-9"
                        >
                            Create Goal
                        </Button>
                    </div>
                </form>
            )}
        </Modal>
    );
};
