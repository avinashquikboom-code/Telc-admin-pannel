'use client';

import * as React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetBody, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export interface ConfirmationDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'destructive' | 'default';
  isLoading?: boolean;
  onConfirm: () => void;
  children?: React.ReactNode;
}

export function ConfirmationDrawer({
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'Confirm Action',
  cancelText = 'Cancel',
  variant = 'destructive',
  isLoading = false,
  onConfirm,
  children,
}: ConfirmationDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent size="sm">
        <SheetHeader>
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${variant === 'destructive' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
              <AlertTriangle className="h-4 w-4" />
            </div>
            <SheetTitle>{title}</SheetTitle>
          </div>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>

        <SheetBody>
          {children || (
            <div className="rounded-lg border border-amber-200 bg-amber-50/70 p-3.5 text-xs text-amber-800 leading-relaxed">
              Please note: This action cannot be easily undone and may impact live learning sessions or registered mobile learners.
            </div>
          )}
        </SheetBody>

        <SheetFooter>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant={variant === 'destructive' ? 'destructive' : 'default'}
            size="sm"
            isLoading={isLoading}
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
