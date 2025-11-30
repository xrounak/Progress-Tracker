import React, { createContext, useContext, useState, useCallback } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType = "info") => {
        const id = Date.now().toString();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    }, []);

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`
              pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border text-sm font-medium transition-all animate-in slide-in-from-right-full
              ${toast.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-800" : ""}
              ${toast.type === "error" ? "bg-red-50 border-red-200 text-red-800" : ""}
              ${toast.type === "info" ? "bg-blue-50 border-blue-200 text-blue-800" : ""}
            `}
                    >
                        {toast.type === "success" && <CheckCircle className="h-4 w-4 text-emerald-500" />}
                        {toast.type === "error" && <AlertCircle className="h-4 w-4 text-red-500" />}
                        {toast.type === "info" && <Info className="h-4 w-4 text-blue-500" />}
                        <span>{toast.message}</span>
                        <button onClick={() => removeToast(toast.id)} className="ml-2 opacity-50 hover:opacity-100">
                            <X className="h-3 w-3" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};
