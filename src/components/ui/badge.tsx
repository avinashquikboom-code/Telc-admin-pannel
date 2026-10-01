import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-blue-100 text-blue-800 border border-blue-200',
        secondary: 'bg-slate-100 text-slate-700 border border-slate-200',
        destructive: 'bg-red-50 text-red-700 border border-red-200',
        success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
        warning: 'bg-amber-50 text-amber-800 border border-amber-200',
        purple: 'bg-purple-50 text-purple-700 border border-purple-200',
        outline: 'border border-slate-300 text-slate-700 bg-white',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
