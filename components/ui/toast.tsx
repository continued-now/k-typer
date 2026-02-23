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
                        "min-w-[300px] rounded-md border p-4 shadow-lg transition-all animate-in slide-in-from-right-full",
                        toast.type === 'success' && "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200",
                        toast.type === 'error' && "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200",
                        toast.type === 'default' && "bg-card border-border text-foreground"
                    )}
                >
                    <div className="flex justify-between items-start">
                        <div>
                            {toast.title && <h4 className="font-semibold text-sm">{toast.title}</h4>}
                            {toast.description && <p className="text-sm opacity-90">{toast.description}</p>}
                        </div>
                        <button onClick={() => removeToast(toast.id)} className="text-slate-400 hover:text-slate-600">
                            <X size={16} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
