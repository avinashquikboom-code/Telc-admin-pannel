'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SheetContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SheetContext = React.createContext<SheetContextValue | null>(null);

export function useSheet() {
  const context = React.useContext(SheetContext);
  if (!context) {
    throw new Error('useSheet must be used within a Sheet');
  }
  return context;
}

interface SheetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export function Sheet({ open = false, onOpenChange, children }: SheetProps) {
  const [internalOpen, setInternalOpen] = React.useState(open);
  const isControlled = onOpenChange !== undefined;
  const currentOpen = isControlled ? open : internalOpen;

  const handleOpenChange = React.useCallback(
    (newOpen: boolean) => {
      if (!isControlled) {
        setInternalOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    },
    [isControlled, onOpenChange]
  );

  return (
    <SheetContext.Provider value={{ open: currentOpen, onOpenChange: handleOpenChange }}>
      {children}
    </SheetContext.Provider>
  );
}

export function SheetTrigger({
  asChild,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }) {
  const { onOpenChange } = useSheet();

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: (e: React.MouseEvent) => {
        (children as any).props?.onClick?.(e);
        onOpenChange(true);
      },
    });
  }

  return (
    <button type="button" onClick={() => onOpenChange(true)} {...props}>
      {children}
    </button>
  );
}

export function SheetClose({
  asChild,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }) {
  const { onOpenChange } = useSheet();

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: (e: React.MouseEvent) => {
        (children as any).props?.onClick?.(e);
        onOpenChange(false);
      },
    });
  }

  return (
    <button type="button" onClick={() => onOpenChange(false)} {...props}>
      {children}
    </button>
  );
}

interface SheetContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: 'right' | 'left';
  size?: 'default' | 'sm' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
}

export function SheetContent({
  side = 'right',
  size = 'default',
  showCloseButton = true,
  className,
  children,
  ...props
}: SheetContentProps) {
  const { open, onOpenChange } = useSheet();

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onOpenChange(false);
      }
    };

    if (open) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex overflow-hidden">
      {/* Subtle backdrop so background page remains visible as required */}
      <div
        className="fixed inset-0 bg-slate-900/30 backdrop-blur-[2px] transition-opacity animate-in fade-in duration-200"
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />

      {/* Slide-in drawer container */}
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'fixed inset-y-0 right-0 z-50 flex flex-col bg-white shadow-2xl border-l border-slate-200/90 transition-transform duration-300 ease-in-out',
          // Desktop: 420px–560px, Tablet: 60–70%, Mobile: 100%
          size === 'sm' && 'w-full sm:w-[420px]',
          size === 'default' && 'w-full sm:w-[480px] md:w-[65vw] md:max-w-[540px]',
          size === 'lg' && 'w-full sm:w-[540px] md:w-[70vw] md:max-w-[620px]',
          size === 'xl' && 'w-full sm:w-[600px] md:w-[75vw] md:max-w-[720px]',
          size === 'full' && 'w-full',
          side === 'right' ? 'animate-in slide-in-from-right duration-250' : 'animate-in slide-in-from-left duration-250',
          className
        )}
        {...props}
      >
        {showCloseButton && (
          <button
            onClick={() => onOpenChange(false)}
            aria-label="Close drawer"
            className="absolute right-4 top-4 z-20 rounded-md p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        {children}
      </div>
    </div>
  );
}

export function SheetHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex flex-col gap-1 border-b border-slate-200/80 px-6 py-5 bg-white text-left', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function SheetTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('text-base font-bold text-slate-900 tracking-tight leading-tight', className)} {...props}>
      {children}
    </h3>
  );
}

export function SheetDescription({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-xs text-slate-500 leading-relaxed', className)} {...props}>
      {children}
    </p>
  );
}

export function SheetBody({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex-1 overflow-y-auto px-6 py-5 space-y-4', className)} {...props}>
      {children}
    </div>
  );
}

export function SheetFooter({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'mt-auto flex items-center justify-end gap-2.5 border-t border-slate-200/80 bg-slate-50/70 px-6 py-4',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
