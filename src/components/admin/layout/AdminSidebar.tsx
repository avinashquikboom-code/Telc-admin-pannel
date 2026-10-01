'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  BookOpen,
  Layers,
  Languages,
  CalendarDays,
  ClipboardCheck,
  RefreshCw,
  Users,
  UserRound,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  GraduationCap,
  CreditCard,
  Puzzle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth/authContext';
import { Badge } from '@/components/ui/badge';

export type AdminMenuItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

export type AdminMenuGroup = {
  label: string | null;
  items: AdminMenuItem[];
};

const menuGroups: AdminMenuGroup[] = [
  {
    label: null,
    items: [
      {
        title: 'Dashboard',
        href: '/admin/dashboard',
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: 'Learning Content',
    items: [
      { title: 'Courses', href: '/admin/courses', icon: BookOpen },
      { title: 'Chapters', href: '/admin/chapters', icon: Layers },
      { title: 'Vocabulary', href: '/admin/vocabulary', icon: Languages },
      { title: 'Learning Sessions', href: '/admin/learning-sessions', icon: CalendarDays },
      { title: 'Tests', href: '/admin/tests', icon: ClipboardCheck },
    ],
  },
  {
    label: 'Review',
    items: [
      { title: 'Review Rules', href: '/admin/review-settings', icon: RefreshCw },
      { title: 'Review Sessions', href: '/admin/reviews', icon: CalendarDays },
    ],
  },
  {
    label: 'Users',
    items: [
      { title: 'Learners', href: '/admin/users', icon: Users },
      { title: 'User Progress', href: '/admin/progress', icon: UserRound },
    ],
  },
  {
    label: 'Financial',
    items: [
      { title: 'Payments', href: '/admin/payments', icon: CreditCard },
    ],
  },
  {
    label: 'Analytics',
    items: [
      { title: 'Overview', href: '/admin/analytics', icon: BarChart3 },
      { title: 'Learning Analytics', href: '/admin/analytics/learning', icon: BarChart3 },
      { title: 'Vocabulary Analytics', href: '/admin/analytics/vocabulary', icon: Languages },
    ],
  },
  {
    label: 'System',
    items: [
      { title: 'Notifications', href: '/admin/notifications', icon: Bell },
      { title: 'Integrations', href: '/admin/settings/integrations', icon: Puzzle },
      { title: 'Settings', href: '/admin/settings', icon: Settings },
    ],
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function AdminSidebar({
  collapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const pathname = usePathname();
  const { user, logout, canAccessRoute } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<{
    text: string;
    top: number;
  } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMouseEnter = (text: string, e: React.MouseEvent<HTMLElement>, isCollapsed: boolean) => {
    if (!isCollapsed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setActiveTooltip({
      text,
      top: rect.top + rect.height / 2,
    });
  };

  const handleMouseLeave = () => {
    setActiveTooltip(null);
  };

  // Render the inner 3-section layout: Header + Nav + Footer
  const renderSidebarContent = (isCollapsed: boolean, isMobileView: boolean = false) => (
    <>
      {/* 1. Header (Fixed Height, shrink-0) */}
      <header
        className={cn(
          'flex h-16 shrink-0 items-center border-b border-slate-200 transition-all duration-200 ease-in-out',
          isCollapsed ? 'px-2.5 justify-between' : 'px-4 justify-between'
        )}
      >
        <Link
          href="/admin/dashboard"
          onClick={onCloseMobile}
          className={cn(
            'flex items-center gap-2.5 overflow-hidden text-slate-900 no-underline',
            isCollapsed ? 'justify-center' : 'min-w-0'
          )}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
            <GraduationCap className="h-5 w-5" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0 transition-opacity duration-150">
              <span className="font-bold text-base tracking-tight text-slate-900 leading-tight truncate">
                TELC Mastery
              </span>
              <span className="text-[10px] font-semibold tracking-wider text-blue-600 uppercase truncate">
                Admin Platform
              </span>
            </div>
          )}
        </Link>

        {/* Desktop Collapse Toggle */}
        {!isMobileView && (
          <button
            onClick={onToggleCollapse}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="hidden md:flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        )}

        {/* Mobile Close Button */}
        {isMobileView && (
          <button
            onClick={onCloseMobile}
            aria-label="Close menu"
            className="flex md:hidden h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-100"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
      </header>

      {/* 2. Scrollable Navigation (min-h-0 flex-1 overflow-y-auto) */}
      <nav
        className="min-h-0 flex-1 overflow-y-auto py-3 sidebar-scroll"
        onScroll={handleMouseLeave}
      >
        <div className={cn('space-y-4', isCollapsed ? 'px-2' : 'px-3')}>
          {menuGroups.map((group, groupIdx) => {
            const visibleItems = group.items.filter((item) => canAccessRoute(item.href));
            if (visibleItems.length === 0) return null;

            return (
              <div key={group.label || `group-${groupIdx}`} className="space-y-1">
                {group.label && !isCollapsed && (
                  <h4 className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    {group.label}
                  </h4>
                )}
                {group.label && isCollapsed && (
                  <div className="my-1.5 mx-auto h-[1px] w-8 bg-slate-200" />
                )}

                {visibleItems.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.href === '/admin/dashboard'
                      ? pathname === '/admin/dashboard'
                      : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onCloseMobile}
                      onMouseEnter={(e) => handleMouseEnter(item.title, e, isCollapsed)}
                      onMouseLeave={handleMouseLeave}
                      aria-label={item.title}
                      title={isCollapsed ? item.title : undefined}
                      className={cn(
                        'flex items-center text-sm font-medium transition-colors cursor-pointer',
                        isCollapsed
                          ? cn(
                              'mx-auto h-12 w-12 justify-center rounded-xl p-0',
                              isActive
                                ? 'bg-blue-50 text-blue-700 font-semibold shadow-xs'
                                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                            )
                          : cn(
                              'w-full gap-3 px-3 py-2.5 rounded-xl',
                              isActive
                                ? 'bg-blue-50 text-blue-700 font-semibold'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            )
                      )}
                    >
                      <Icon
                        className={cn(
                          'h-5 w-5 shrink-0 transition-colors',
                          isActive ? 'text-blue-600' : 'text-slate-500'
                        )}
                      />
                      {!isCollapsed && (
                        <span className="truncate text-sm transition-opacity duration-150">
                          {item.title}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </div>
      </nav>

      {/* 3. Footer (Fixed Height, shrink-0, border-t) */}
      <footer
        className={cn(
          'shrink-0 border-t border-slate-200 bg-white transition-all duration-200 ease-in-out',
          isCollapsed ? 'p-2 flex flex-col items-center gap-2' : 'p-3 space-y-2'
        )}
      >
        {user && (
          isCollapsed ? (
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full hover:ring-2 hover:ring-blue-500/20 cursor-pointer"
              onMouseEnter={(e) => handleMouseEnter(`${user.name} (${user.role.replace('_', ' ')})`, e, isCollapsed)}
              onMouseLeave={handleMouseLeave}
              aria-label={`${user.name} Profile`}
              title={`${user.name} (${user.role.replace('_', ' ')})`}
            >
              <img
                src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                alt={user.name}
                className="h-8 w-8 rounded-full object-cover border border-slate-200"
              />
            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50/80 p-2.5">
              <img
                src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                alt={user.name}
                className="h-8 w-8 rounded-full object-cover border border-slate-200 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-slate-900 leading-tight">
                  {user.name}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Badge
                    variant={
                      user.role === 'SUPER_ADMIN'
                        ? 'default'
                        : user.role === 'CONTENT_ADMIN'
                        ? 'purple'
                        : 'secondary'
                    }
                    className="text-[9px] px-1.5 py-0 uppercase"
                  >
                    {user.role.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
            </div>
          )
        )}

        <div
          className={cn(
            'flex items-center',
            isCollapsed ? 'flex-col gap-1 w-full' : 'gap-1'
          )}
        >
          <Link
            href="/admin/settings"
            onClick={onCloseMobile}
            onMouseEnter={(e) => handleMouseEnter('Roles & Auth', e, isCollapsed)}
            onMouseLeave={handleMouseLeave}
            aria-label="Roles & Auth"
            title={isCollapsed ? 'Roles & Auth' : undefined}
            className={cn(
              'flex items-center rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors',
              isCollapsed
                ? 'h-10 w-10 justify-center p-0'
                : 'flex-1 gap-3 px-3 py-2'
            )}
          >
            <ShieldCheck className="h-4 w-4 shrink-0 text-slate-500" />
            {!isCollapsed && <span>Roles & Auth</span>}
          </Link>

          <button
            onClick={logout}
            onMouseEnter={(e) => handleMouseEnter('Log out', e, isCollapsed)}
            onMouseLeave={handleMouseLeave}
            aria-label="Log out"
            title={isCollapsed ? 'Log out' : undefined}
            className={cn(
              'flex shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer',
              isCollapsed ? 'h-10 w-10' : 'h-8 w-8'
            )}
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </footer>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar: 3-section layout, w-[80px] collapsed, w-[260px] expanded */}
      <aside
        className={cn(
          'hidden md:flex h-dvh flex-col fixed inset-y-0 left-0 z-30 border-r border-slate-200/90 bg-white transition-[width] duration-200 ease-in-out',
          collapsed ? 'w-[80px]' : 'w-[260px]'
        )}
      >
        {renderSidebarContent(collapsed, false)}
      </aside>

      {/* Floating Tooltip for Collapsed Sidebar Items (rendered into body, zero clipping) */}
      {mounted && activeTooltip && collapsed && createPortal(
        <div
          style={{ top: `${activeTooltip.top}px`, left: '88px' }}
          className="pointer-events-none fixed -translate-y-1/2 z-50 whitespace-nowrap rounded-md bg-slate-900 px-2.5 py-1 text-xs font-medium text-white shadow-lg transition-opacity duration-150 animate-in fade-in-0"
        >
          {activeTooltip.text}
        </div>,
        document.body
      )}

      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs md:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Mobile Drawer: Full width (expanded view) inside slide-over sheet */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex h-dvh w-[280px] flex-col bg-white shadow-2xl transition-transform duration-200 ease-in-out md:hidden',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {renderSidebarContent(false, true)}
      </aside>
    </>
  );
}
