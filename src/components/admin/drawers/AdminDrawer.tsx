'use client';

import * as React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetBody, SheetFooter } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

export interface AdminDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'default' | 'lg' | 'xl' | 'full';
  className?: string;
}

export function AdminDrawer({
  open,
  onOpenChange,
  title,
  description,
  badge,
  children,
  footer,
  size = 'default',
  className,
}: AdminDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent size={size} className={className}>
        <SheetHeader>
          <div className="flex items-center gap-2">
            <SheetTitle>{title}</SheetTitle>
            {badge}
          </div>
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>

        <SheetBody>{children}</SheetBody>

        {footer && <SheetFooter>{footer}</SheetFooter>}
      </SheetContent>
    </Sheet>
  );
}
