import React from 'react';
import { LucideIcon, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  actionHref?: string;
}

export function EmptyState({
  icon: Icon = Layers,
  title,
  description,
  actionText,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center animate-in fade-in-50">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 mb-4 ring-8 ring-blue-50/50">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-slate-500">{description}</p>
      {actionText && onAction && (
        <div className="mt-5">
          <Button onClick={onAction} className="bg-blue-600 hover:bg-blue-700">
            {actionText}
          </Button>
        </div>
      )}
    </div>
  );
}
