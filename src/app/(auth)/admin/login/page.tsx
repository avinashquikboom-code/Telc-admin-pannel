'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { GraduationCap, Lock, Mail, AlertCircle, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth/authContext';
import { AdminRole } from '@/types';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<AdminRole>('SUPER_ADMIN');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'admin@telcmastery.com',
      password: 'password123',
      rememberMe: true,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      // Simulate authentication API latency
      await new Promise((resolve) => setTimeout(resolve, 600));
      await login(data.email, selectedRole);
      router.push('/admin/dashboard');
    } catch {
      setErrorMsg('Invalid email or password. Please verify your admin credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        {/* Logo and Brand */}
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
            <GraduationCap className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">TELC Mastery</h1>
          <p className="text-xs font-semibold tracking-wider text-blue-600 uppercase">
            Admin Management Portal
          </p>
        </div>

        {/* Title */}
        <div className="text-center border-t border-slate-100 pt-4">
          <h2 className="text-lg font-semibold text-slate-900">Admin Login</h2>
          <p className="text-xs text-slate-500 mt-1">
            Sign in with authorized credentials to manage courses and platform content
          </p>
        </div>

        {errorMsg && (
          <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Admin Email
            </label>
            <div className="relative">
              <Input
                type="email"
                {...register('email')}
                placeholder="admin@telcmastery.com"
                error={errors.email?.message}
                className="pl-9"
              />
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Input
                type="password"
                {...register('password')}
                placeholder="••••••••"
                error={errors.password?.message}
                className="pl-9"
              />
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            </div>
          </div>

          {/* Role selection for preview */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-blue-600" />
              Sign in as Role:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { role: 'SUPER_ADMIN', label: 'Super Admin' },
                  { role: 'CONTENT_ADMIN', label: 'Content' },
                  { role: 'SUPPORT_ADMIN', label: 'Support' },
                ] as const
              ).map((r) => (
                <button
                  key={r.role}
                  type="button"
                  onClick={() => setSelectedRole(r.role)}
                  className={`rounded-lg border px-2 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                    selectedRole === r.role
                      ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-slate-600">
              <input
                type="checkbox"
                {...register('rememberMe')}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              Remember me
            </label>
            <a
              href="#forgot"
              onClick={(e) => {
                e.preventDefault();
                alert('Password reset instructions have been sent to admin recovery email.');
              }}
              className="text-blue-600 hover:underline font-medium"
            >
              Forgot password?
            </a>
          </div>

          <Button type="submit" isLoading={isLoading} className="w-full h-10 mt-2 bg-blue-600 hover:bg-blue-700">
            Sign In to Platform
          </Button>
        </form>

        <div className="text-center pt-2">
          <p className="text-[11px] text-slate-400">
            Protected by TELC Mastery Enterprise Access Protocol.
          </p>
        </div>
      </div>
    </div>
  );
}
