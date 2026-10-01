'use client';

import * as React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetBody, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export interface FormDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  badge?: React.ReactNode;
  submitLabel?: string;
  cancelLabel?: string;
  isSubmitting?: boolean;
  submitDisabled?: boolean;
  error?: string | null;
  onSubmit?: (e: React.FormEvent) => void;
  children: React.ReactNode;
  size?: 'sm' | 'default' | 'lg' | 'xl';
  extraFooterActions?: React.ReactNode;
}

export function FormDrawer({
  open,
  onOpenChange,
  title,
  description,
  badge,
  submitLabel = 'Save Changes',
  cancelLabel = 'Cancel',
  isSubmitting = false,
  submitDisabled = false,
  error,
  onSubmit,
  children,
  size = 'default',
  extraFooterActions,
}: FormDrawerProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(e);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent size={size}>
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <SheetHeader>
            <div className="flex items-center gap-2">
              <SheetTitle>{title}</SheetTitle>
              {badge}
            </div>
            {description && <SheetDescription>{description}</SheetDescription>}
          </SheetHeader>

          <SheetBody>
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                <span className="leading-tight">{error}</span>
              </div>
            )}
            {children}
          </SheetBody>

          <SheetFooter>
            {extraFooterActions}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              {cancelLabel}
            </Button>
            <Button
              type="submit"
              size="sm"
              isLoading={isSubmitting}
              disabled={submitDisabled || isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
            >
              {submitLabel}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
