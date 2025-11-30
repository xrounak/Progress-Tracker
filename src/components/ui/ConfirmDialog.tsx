import React from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "danger" | "warning" | "info";
    isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "danger",
    isLoading = false,
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div className="space-y-4">
                <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${variant === "danger" ? "bg-red-100 text-red-600" :
                            variant === "warning" ? "bg-amber-100 text-amber-600" :
                                "bg-blue-100 text-blue-600"
                        }`}>
                        <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">{message}</p>
                    </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        {cancelText}
                    </Button>
                    <Button
                        variant="primary"
                        onClick={onConfirm}
                        isLoading={isLoading}
                        disabled={isLoading}
                        className={variant === "danger" ? "bg-red-600 hover:bg-red-700 text-white shadow-red-500/20" : ""}
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
