'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'success' | 'destructive' | 'info';
  duration?: number;
}

interface ToastContextType {
  toast: (toast: Omit<ToastItem, 'id'>) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ title, description, variant = 'success', duration = 4000 }: Omit<ToastItem, 'id'>) => {
      const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      setToasts((prev) => [...prev, { id, title, description, variant, duration }]);

      if (duration > 0) {
        setTimeout(() => {
          dismiss(id);
        }, duration);
      }
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      {/* Toast viewport */}
      <div
        aria-live="polite"
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none max-w-md w-full px-4"
      >
        {toasts.map((item) => {
          const isSuccess = item.variant === 'success' || !item.variant;
          const isDestructive = item.variant === 'destructive';
          const isInfo = item.variant === 'info';

          return (
            <div
              key={item.id}
              role="alert"
              className={cn(
                'pointer-events-auto flex items-start gap-3 rounded-xl border p-4 shadow-xl transition-all animate-in slide-in-from-bottom-5 duration-200',
                isSuccess && 'bg-white border-emerald-200 text-slate-800 shadow-emerald-500/5',
                isDestructive && 'bg-white border-red-200 text-slate-800 shadow-red-500/5',
                isInfo && 'bg-white border-blue-200 text-slate-800 shadow-blue-500/5',
                item.variant === 'default' && 'bg-white border-slate-200 text-slate-800'
              )}
            >
              {isSuccess && <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />}
              {isDestructive && <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />}
              {isInfo && <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />}

              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900 leading-tight">{item.title}</p>
                {item.description && (
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed break-words">{item.description}</p>
                )}
              </div>

              <button
                onClick={() => dismiss(item.id)}
                className="shrink-0 rounded-md p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label="Dismiss toast"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
