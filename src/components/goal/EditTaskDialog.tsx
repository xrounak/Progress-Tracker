import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface EditTaskDialogProps {
    isOpen: boolean;
    onClose: () => void;
    task: {
        id: string;
        title: string;
        points: number;
    } | null;
    onUpdateTask: (taskId: string, data: { title: string; points: number }) => Promise<void>;
}

export const EditTaskDialog: React.FC<EditTaskDialogProps> = ({
    isOpen,
    onClose,
    task,
    onUpdateTask,
}) => {
    const [title, setTitle] = useState(task?.title || "");
    const [points, setPoints] = useState(task?.points || 10);
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState("");

    // Update form when task changes
    React.useEffect(() => {
        if (task) {
            setTitle(task.title);
            setPoints(task.points);
        }
    }, [task]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!title.trim()) {
            setError("Please enter a task title");
            return;
        }

        if (!task) return;

        setIsUpdating(true);
        try {
            await onUpdateTask(task.id, {
                title: title.trim(),
                points,
            });
            onClose();
        } catch (err) {
            setError("Failed to update task. Please try again.");
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
        <Modal isOpen={isOpen} onClose={handleClose} title="Edit Task">
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Task Title */}
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">
                        Task Title *
                    </label>
                    <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., Drink 500ml water"
                        disabled={isUpdating}
                    />
                </div>

                {/* Points */}
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">
                        Points
                    </label>
                    <Input
                        type="number"
                        min={1}
                        value={points}
                        onChange={(e) => setPoints(Number(e.target.value) || 1)}
                        disabled={isUpdating}
                        className="w-32"
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
                        Update Task
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
