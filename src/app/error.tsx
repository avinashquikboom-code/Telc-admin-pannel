'use client';

import React, { useEffect } from 'react';
import { AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App Router Boundary Error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600 mb-4 border border-red-200">
        <AlertCircle className="h-8 w-8" />
      </div>
      <h1 className="text-2xl font-bold text-slate-900">Application Error</h1>
      <p className="mt-2 max-w-md text-sm text-slate-500 leading-relaxed">
        An unexpected error occurred while processing your request.
      </p>
      <div className="mt-6 flex items-center gap-3">
        <Button
          onClick={() => reset()}
          variant="outline"
          className="gap-2 cursor-pointer"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
        <Link href="/admin/dashboard">
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
