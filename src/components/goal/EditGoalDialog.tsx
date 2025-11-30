import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface EditGoalDialogProps {
    isOpen: boolean;
    onClose: () => void;
    goal: {
        id: string;
        title: string;
        duration_days: number;
        description?: string | null;
    } | null;
    onUpdateGoal: (goalId: string, data: { title: string; duration_days: number; description?: string }) => Promise<void>;
}

export const EditGoalDialog: React.FC<EditGoalDialogProps> = ({
    isOpen,
    onClose,
    goal,
    onUpdateGoal,
}) => {
    const [title, setTitle] = useState(goal?.title || "");
    const [duration, setDuration] = useState(goal?.duration_days || 21);
    const [description, setDescription] = useState(goal?.description || "");
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState("");

    // Update form when goal changes
    React.useEffect(() => {
        if (goal) {
            setTitle(goal.title);
            setDuration(goal.duration_days);
            setDescription(goal.description || "");
        }
    }, [goal]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!title.trim()) {
            setError("Please enter a goal title");
            return;
        }

        if (!goal) return;

        setIsUpdating(true);
        try {
            await onUpdateGoal(goal.id, {
                title: title.trim(),
                duration_days: duration,
                description: description.trim() || undefined,
            });
            onClose();
        } catch (err) {
            setError("Failed to update goal. Please try again.");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleClose = () => {
        if (!isUpdating) {
            setError("");
            onClose();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Edit Goal">
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Goal Title */}
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">
                        Goal Title *
                    </label>
                    <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., 21-day morning routine"
                        disabled={isUpdating}
                    />
                </div>

                {/* Duration */}
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">
                        Duration (days)
                    </label>
                    <Input
                        type="number"
                        min={1}
                        value={duration}
                        onChange={(e) => setDuration(Number(e.target.value) || 1)}
                        disabled={isUpdating}
                        className="w-32"
                    />
                </div>

                {/* Description (Optional) */}
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">
                        Description (optional)
                    </label>
                    <Input
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Add a description..."
                        disabled={isUpdating}
                    />
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
                        disabled={isUpdating}
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        isLoading={isUpdating}
                        disabled={isUpdating}
                        className="flex-1"
                    >
                        Update Goal
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
