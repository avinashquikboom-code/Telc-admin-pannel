'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AdminUser, AdminRole } from '@/types';
import { initialAdminUser } from '@/lib/mockData';

interface AuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  login: (email: string, role?: AdminRole) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: AdminRole) => void;
  hasPermission: (requiredRole: AdminRole | AdminRole[]) => boolean;
  canAccessRoute: (pathname: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'telc_admin_auth_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(initialAdminUser);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        setUser(initialAdminUser);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(initialAdminUser));
      }
    } catch {
      setUser(initialAdminUser);
    }
    setMounted(true);
  }, []);

  const login = async (email: string, role: AdminRole = 'SUPER_ADMIN'): Promise<boolean> => {
    const admin: AdminUser = {
      id: `admin_${Date.now()}`,
      name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || 'Marcus Weber',
      email,
      role,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      lastLogin: new Date().toISOString(),
    };
    setUser(admin);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(admin));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    router.push('/admin/login');
  };

  const switchRole = (role: AdminRole) => {
    if (!user) return;
    const updated = { ...user, role };
    setUser(updated);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
  };

  const hasPermission = (requiredRole: AdminRole | AdminRole[]): boolean => {
    if (!user) return false;
    if (user.role === 'SUPER_ADMIN') return true;
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(user.role);
    }
    return user.role === requiredRole;
  };

  const canAccessRoute = (path: string): boolean => {
    if (!user) return false;
    if (user.role === 'SUPER_ADMIN') return true;

    // Content Admin permissions:
    if (user.role === 'CONTENT_ADMIN') {
      const allowedPrefixes = [
        '/admin/dashboard',
        '/admin/courses',
        '/admin/chapters',
        '/admin/vocabulary',
        '/admin/learning-sessions',
        '/admin/tests',
        '/admin/reviews',
        '/admin/review-settings',
        '/admin/analytics/vocabulary',
        '/admin/profile',
      ];
      return allowedPrefixes.some((prefix) => path.startsWith(prefix));
    }

    // Support Admin permissions:
    if (user.role === 'SUPPORT_ADMIN') {
      const allowedPrefixes = [
        '/admin/dashboard',
        '/admin/users',
        '/admin/progress',
        '/admin/payments',
        '/admin/notifications',
        '/admin/integrations',
        '/admin/settings/integrations',
        '/admin/analytics',
        '/admin/profile',
      ];
      return allowedPrefixes.some((prefix) => path.startsWith(prefix));
    }

    return false;
  };

  if (!mounted) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        switchRole,
        hasPermission,
        canAccessRoute,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
