"use client"

import * as React from "react"
import { create } from "zustand"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

interface Toast {
    id: string;
    title?: string;
    description?: string;
    type?: 'default' | 'success' | 'error';
}

interface ToastStore {
    toasts: Toast[];
    addToast: (toast: Omit<Toast, 'id'>) => void;
    removeToast: (id: string) => void;
}

export const useToast = create<ToastStore>((set) => ({
    toasts: [],
    addToast: (toast) => {
        const id = Math.random().toString(36).substring(2, 9);
        set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
        setTimeout(() => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })), 3000);
    },
    removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

export function Toaster() {
    const { toasts, removeToast } = useToast();

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={cn(
                        "min-w-[300px] rounded-md border p-4 shadow-lg transition-all",
                        toast.type === 'success' && "bg-success/10 border-success/30 text-success",
                        toast.type === 'error' && "bg-destructive/10 border-destructive/30 text-destructive",
                        (!toast.type || toast.type === 'default') && "bg-card border-border text-foreground"
                    )}
                    role="alert"
                >
                    <div className="flex justify-between items-start">
                        <div>
                            {toast.title && <h4 className="font-semibold text-sm">{toast.title}</h4>}
                            {toast.description && <p className="text-sm opacity-90">{toast.description}</p>}
                        </div>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="text-muted-foreground hover:text-foreground"
                            aria-label="닫기"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
