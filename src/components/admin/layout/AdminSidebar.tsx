'use client';

import React from 'react';
import Link from 'next/navigation';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  Layers,
  Languages,
  Calendar,
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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth/authContext';
import { Badge } from '@/components/ui/badge';

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

  const navigationGroups = [
    {
      group: null,
      items: [
        {
          name: 'Dashboard',
          href: '/admin/dashboard',
          icon: LayoutDashboard,
        },
      ],
    },
    {
      group: 'Learning Content',
      items: [
        { name: 'Courses', href: '/admin/courses', icon: BookOpen },
        { name: 'Chapters', href: '/admin/chapters', icon: Layers },
        { name: 'Vocabulary', href: '/admin/vocabulary', icon: Languages },
        { name: 'Learning Sessions', href: '/admin/learning-sessions', icon: Calendar },
        { name: 'Tests', href: '/admin/tests', icon: ClipboardCheck },
      ],
    },
    {
      group: 'Review',
      items: [
        { name: 'Review Rules', href: '/admin/review-settings', icon: RefreshCw },
        { name: 'Review Sessions', href: '/admin/reviews', icon: Calendar },
      ],
    },
    {
      group: 'Users',
      items: [
        { name: 'Learners', href: '/admin/users', icon: Users },
        { name: 'User Progress', href: '/admin/progress', icon: UserRound },
      ],
    },
    {
      group: 'Analytics',
      items: [
        { name: 'Overview', href: '/admin/analytics', icon: BarChart3 },
        { name: 'Learning Analytics', href: '/admin/analytics/learning', icon: BarChart3 },
        { name: 'Vocabulary Analytics', href: '/admin/analytics/vocabulary', icon: Languages },
      ],
    },
    {
      group: 'System',
      items: [
        { name: 'Notifications', href: '/admin/notifications', icon: Bell },
        { name: 'Settings', href: '/admin/settings', icon: Settings },
      ],
    },
  ];

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between bg-white text-slate-800">
      {/* Brand & Top Header */}
      <div>
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4">
          <Link
            href="/admin/dashboard"
            onClick={onCloseMobile}
            className="flex items-center gap-3 overflow-hidden text-slate-900 no-underline"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
              <GraduationCap className="h-5 w-5" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="font-bold text-base tracking-tight text-slate-900 leading-tight">
                  TELC Mastery
                </span>
                <span className="text-[10px] font-semibold tracking-wider text-blue-600 uppercase">
                  Admin Platform
                </span>
              </div>
            )}
          </Link>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={onToggleCollapse}
            aria-label="Toggle Sidebar"
            className="hidden md:flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Navigation list */}
        <div className="space-y-4 px-3 py-4 max-h-[calc(100vh-175px)] overflow-y-auto">
          {navigationGroups.map((group, idx) => {
            // Filter items based on user role permissions
            const visibleItems = group.items.filter((item) => canAccessRoute(item.href));
            if (visibleItems.length === 0) return null;

            return (
              <div key={idx} className="space-y-1">
                {group.group && !collapsed && (
                  <h4 className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    {group.group}
                  </h4>
                )}
                {visibleItems.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.href === '/admin/dashboard'
                      ? pathname === '/admin/dashboard'
                      : pathname.startsWith(item.href);

                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={onCloseMobile}
                      title={collapsed ? item.name : undefined}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer',
                        isActive
                          ? 'bg-blue-50 text-blue-700 font-semibold'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                        collapsed && 'justify-center px-2'
                      )}
                    >
                      <Icon
                        className={cn(
                          'h-4 w-4 shrink-0 transition-colors',
                          isActive ? 'text-blue-600' : 'text-slate-500'
                        )}
                      />
                      {!collapsed && <span className="truncate">{item.name}</span>}
                    </a>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Profile & Logout */}
      <div className="border-t border-slate-200 p-3">
        {user && !collapsed && (
          <div className="mb-2 flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50/80 p-2.5">
            <img
              src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
              alt={user.name}
              className="h-8 w-8 rounded-full object-cover border border-slate-200"
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
        )}

        <div className="flex items-center gap-1">
          <a
            href="/admin/settings"
            onClick={onCloseMobile}
            title={collapsed ? 'Admin Settings' : undefined}
            className={cn(
              'flex flex-1 items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors',
              collapsed && 'justify-center px-2'
            )}
          >
            <ShieldCheck className="h-4 w-4 shrink-0 text-slate-500" />
            {!collapsed && <span>Roles & Auth</span>}
          </a>

          <button
            onClick={logout}
            title="Log out"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden md:block fixed inset-y-0 left-0 z-30 border-r border-slate-200/90 bg-white transition-all duration-200 ease-in-out',
          collapsed ? 'w-[72px]' : 'w-[260px]'
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs md:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-[270px] bg-white transition-transform duration-200 ease-in-out md:hidden shadow-2xl',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
