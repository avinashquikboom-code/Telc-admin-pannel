import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  description?: string;
  icon: LucideIcon;
  iconColor?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  change,
  changeType = 'positive',
  description,
  icon: Icon,
  iconColor = 'text-blue-600 bg-blue-50',
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all hover:border-slate-300',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-slate-500">{title}</p>
        <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg', iconColor)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-slate-900">{value}</span>
        {change && (
          <span
            className={cn(
              'inline-flex items-center text-xs font-semibold',
              changeType === 'positive' && 'text-emerald-600',
              changeType === 'negative' && 'text-red-600',
              changeType === 'neutral' && 'text-slate-500'
            )}
          >
            {changeType === 'positive' ? (
              <TrendingUp className="mr-0.5 h-3.5 w-3.5" />
            ) : changeType === 'negative' ? (
              <TrendingDown className="mr-0.5 h-3.5 w-3.5" />
            ) : null}
            {change}
          </span>
        )}
      </div>

      {description && <p className="mt-1 text-xs text-slate-400">{description}</p>}
    </div>
  );
}
