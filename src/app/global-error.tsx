'use client';

import React, { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App Router Global Error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4 text-center font-sans">
        <div className="rounded-2xl border border-red-200 bg-white p-8 shadow-xl max-w-md w-full">
          <h2 className="text-xl font-bold text-slate-900">System Error</h2>
          <p className="mt-2 text-sm text-slate-500">
            A critical system error occurred. Please refresh or return to dashboard.
          </p>
          <button
            onClick={() => reset()}
            className="mt-6 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 cursor-pointer"
          >
            Refresh Platform
          </button>
        </div>
      </body>
    </html>
  );
}
