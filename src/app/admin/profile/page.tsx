'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/admin/navigation/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth/authContext';
import { formatDate } from '@/lib/utils';
import { Lock, ArrowLeft, Shield } from 'lucide-react';

export default function AdminProfilePage() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <a href="/admin/dashboard" className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Dashboard
        </a>
      </div>

      <PageHeader
        title="Admin Profile"
        description="Personal credentials, access role, and security settings."
      />

      <Card>
        <CardHeader>
          <CardTitle>Profile Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
            <img
              src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'}
              alt={user?.name}
              className="h-16 w-16 rounded-full object-cover border-2 border-slate-200"
            />
            <div>
              <p className="font-bold text-slate-900 text-lg">{user?.name}</p>
              <p className="text-xs text-slate-500">{user?.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="default" className="text-[10px]">
                  {user?.role.replace('_', ' ')}
                </Badge>
                <span className="text-[11px] text-slate-400">
                  Last login: {formatDate(user?.lastLogin || new Date().toISOString())}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <a href="/admin/settings">
              <Button className="bg-blue-600 hover:bg-blue-700 text-xs">
                Edit Profile in Settings
              </Button>
            </a>
            <Button
              variant="outline"
              onClick={() => alert('Password reset verification link sent to your email.')}
              className="text-xs gap-1.5"
            >
              <Lock className="h-3.5 w-3.5" />
              Change Password
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
