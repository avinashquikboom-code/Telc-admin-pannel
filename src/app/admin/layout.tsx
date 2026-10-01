'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/layout/AdminSidebar';
import { AdminHeader } from '@/components/admin/layout/AdminHeader';
import { useAuth } from '@/lib/auth/authContext';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const { isAuthenticated, user, canAccessRoute } = useAuth();
  const pathname = usePathname();

  const hasAccess = canAccessRoute(pathname);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <AdminSidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        isMobileOpen={mobileDrawerOpen}
        onCloseMobile={() => setMobileDrawerOpen(false)}
      />

      {/* Main Content Area */}
      <div
        className={cn(
          'flex flex-1 flex-col min-w-0 transition-all duration-200 ease-in-out',
          sidebarCollapsed ? 'md:pl-[72px]' : 'md:pl-[260px]'
        )}
      >
        <AdminHeader
          collapsed={sidebarCollapsed}
          onOpenMobileMenu={() => setMobileDrawerOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {!hasAccess ? (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-amber-200 bg-amber-50/50 p-8 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700 mb-4">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Access Restricted</h2>
              <p className="mt-2 max-w-md text-sm text-slate-600">
                Your current role (<strong>{user?.role.replace('_', ' ')}</strong>) does not have permission
                to view this section. You can switch roles using the role badge in the top header to preview Super Admin access.
              </p>
              <div className="mt-6 flex gap-3">
                <a href="/admin/dashboard">
                  <Button variant="outline" className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Dashboard
                  </Button>
                </a>
              </div>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}
