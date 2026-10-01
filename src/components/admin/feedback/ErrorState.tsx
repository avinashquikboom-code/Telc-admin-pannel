import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'Unable to load data at this time. Please check your connection or try again.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50/30 p-8 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 mb-4 ring-8 ring-red-50">
        <AlertCircle className="h-6 w-6" />
      </div>
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-slate-600">{message}</p>
      {onRetry && (
        <div className="mt-5">
          <Button variant="outline" onClick={onRetry} className="gap-2 border-red-200 text-red-700 hover:bg-red-50">
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </div>
      )}
    </div>
  );
}
