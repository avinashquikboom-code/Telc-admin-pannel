'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Menu,
  Search,
  Bell,
  User,
  Shield,
  LogOut,
  ChevronDown,
  Check,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/authContext';
import { AdminRole } from '@/types';

interface HeaderProps {
  onOpenMobileMenu: () => void;
  collapsed: boolean;
}

export function AdminHeader({ onOpenMobileMenu, collapsed }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, switchRole } = useAuth();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Breadcrumb segments
  const pathSegments = pathname
    .split('/')
    .filter(Boolean)
    .filter((s) => s !== 'admin');

  const pageTitle =
    pathSegments.length > 0
      ? pathSegments[0].replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase())
      : 'Dashboard';

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/admin/vocabulary?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-slate-200/90 bg-white/95 px-4 sm:px-6 backdrop-blur-xs">
      {/* Left: Mobile Toggle & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 text-sm">
          <a href="/admin/dashboard" className="text-slate-500 hover:text-slate-900 font-medium">
            Dashboard
          </a>
          {pathSegments.map((segment, idx) => (
            <React.Fragment key={idx}>
              <span className="text-slate-300">/</span>
              <span className="font-semibold text-slate-800 capitalize">
                {segment.replace(/-/g, ' ')}
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Center Search */}
      <div className="hidden lg:flex max-w-xs flex-1 mx-4">
        <form onSubmit={handleSearch} className="relative w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search words, courses, learners..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-hidden"
          />
        </form>
      </div>

      {/* Right Controls: Role Switcher, Notification, Admin Profile */}
      <div className="flex items-center gap-3">
        {/* Role Switcher Pill - Excellent for demonstrating Role-Based Access */}
        {user && (
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="hidden sm:flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <Shield className="h-3.5 w-3.5 text-blue-600" />
              <span>Role: <strong className="text-blue-700">{user.role.replace('_', ' ')}</strong></span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>

            {roleMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg z-50 animate-in fade-in-50"
                onClick={() => setRoleMenuOpen(false)}
              >
                <div className="px-2 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Switch Active Role
                </div>
                {(['SUPER_ADMIN', 'CONTENT_ADMIN', 'SUPPORT_ADMIN'] as AdminRole[]).map((role) => (
                  <button
                    key={role}
                    onClick={() => switchRole(role)}
                    className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-100 text-left"
                  >
                    <span>{role.replace('_', ' ')}</span>
                    {user.role === role && <Check className="h-3.5 w-3.5 text-blue-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Notifications Icon */}
        <div className="relative">
          <a
            href="/admin/notifications"
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[9px] font-bold text-white">
              3
            </span>
          </a>
        </div>

        {/* Admin Avatar & Dropdown */}
        <div className="flex items-center gap-2 pl-1">
          <a href="/admin/settings" className="flex items-center gap-2 cursor-pointer">
            <img
              src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
              alt={user?.name || 'Admin'}
              className="h-8 w-8 rounded-full border border-slate-200 object-cover"
            />
            <div className="hidden xl:block text-left">
              <p className="text-xs font-semibold text-slate-900 leading-tight">{user?.name}</p>
              <p className="text-[11px] text-slate-500 leading-none">{user?.email}</p>
            </div>
          </a>
        </div>
      </div>
    </header>
  );
}
