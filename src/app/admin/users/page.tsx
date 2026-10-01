'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import {
  Users,
  Plus,
  Eye,
  RotateCcw,
  Ban,
  Trash2,
  CheckCircle,
} from 'lucide-react';
import { Learner } from '@/types';
import { useAdminStore } from '@/lib/store';
import { PageHeader } from '@/components/admin/navigation/PageHeader';
import { DataTable } from '@/components/admin/tables/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ConfirmDialog } from '@/components/ui/dialog';
import { formatTimeAgo } from '@/lib/utils';

export default function UsersPage() {
  const { learners, courses, updateLearnerStatus, resetLearnerProgress } = useAdminStore();
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [learnerToReset, setLearnerToReset] = useState<Learner | null>(null);

  const filteredLearners = learners.filter((l) => {
    if (courseFilter !== 'all' && l.courseId !== courseFilter) return false;
    if (statusFilter !== 'all' && l.status !== statusFilter) return false;
    return true;
  });

  const columns: ColumnDef<Learner, any>[] = [
    {
      accessorKey: 'name',
      header: 'Learner',
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex items-center gap-3">
            <img
              src={item.avatarUrl}
              alt={item.name}
              className="h-8 w-8 rounded-full object-cover border border-slate-200"
            />
            <div>
              <a
                href={`/admin/users/${item.id}`}
                className="font-bold text-slate-900 hover:text-blue-600 transition-colors"
              >
                {item.name}
              </a>
              <p className="text-[11px] text-slate-400">{item.email}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'courseName',
      header: 'Course & Chapter',
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div>
            <p className="font-semibold text-slate-800 text-xs">{item.courseName}</p>
            <p className="text-[11px] text-slate-500">{item.chapterName}</p>
          </div>
        );
      },
    },
    {
      accessorKey: 'progressPercentage',
      header: 'Curriculum Progress',
      cell: ({ row }) => {
        const prog = row.original.progressPercentage;
        return (
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-16 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full" style={{ width: `${prog}%` }} />
            </div>
            <span className="text-xs font-bold text-slate-700">{prog}%</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'wordsLearned',
      header: 'Words Learned',
      cell: ({ row }) => (
        <span className="font-medium text-slate-800">{row.original.wordsLearned} words</span>
      ),
    },
    {
      accessorKey: 'averageScore',
      header: 'Avg Score',
      cell: ({ row }) => (
        <span className="font-bold text-emerald-600">{row.original.averageScore}%</span>
      ),
    },
    {
      accessorKey: 'lastActive',
      header: 'Last Active',
      cell: ({ row }) => (
        <span className="text-slate-500 text-xs">{formatTimeAgo(row.original.lastActive)}</span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge
            variant={
              status === 'active'
                ? 'success'
                : status === 'suspended'
                ? 'destructive'
                : 'secondary'
            }
            className="capitalize text-[10px]"
          >
            {status}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const learner = row.original;
        return (
          <div className="flex items-center gap-1">
            <a href={`/admin/users/${learner.id}`} title="View Learner Profile">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600 hover:text-blue-600">
                <Eye className="h-4 w-4" />
              </Button>
            </a>
            <button
              onClick={() => {
                const next = learner.status === 'suspended' ? 'active' : 'suspended';
                updateLearnerStatus(learner.id, next);
              }}
              title={learner.status === 'suspended' ? 'Unsuspend Learner' : 'Suspend Learner'}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-amber-700 transition-colors"
            >
              <Ban className="h-4 w-4" />
            </button>
            <button
              onClick={() => setLearnerToReset(learner)}
              title="Reset Progress"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Learners"
        description="Monitor individual learner trajectories, chapter progressions, streak activity, and examination performance."
      />

      <DataTable
        columns={columns}
        data={filteredLearners}
        searchKey="name"
        searchPlaceholder="Search learners by name or email..."
        filters={
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs">
              <span className="text-slate-400">Course:</span>
              <select
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="bg-transparent font-medium text-slate-700 focus:outline-hidden cursor-pointer"
              >
                <option value="all">All Courses</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs">
              <span className="text-slate-400">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent font-medium text-slate-700 focus:outline-hidden cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        }
        emptyTitle="No learners found"
        emptyDescription="There are currently no learners enrolled matching the chosen criteria."
      />

      {/* Confirmation modal for Reset Progress mandated by Section 21 */}
      <ConfirmDialog
        open={!!learnerToReset}
        onOpenChange={(open) => !open && setLearnerToReset(null)}
        title="Reset Learner Progress?"
        description={`"This will remove the learner's learning progress." Are you sure you want to reset all completed daily sessions, words learned, and test scores for ${learnerToReset?.name}?`}
        confirmText="Reset Progress"
        variant="destructive"
        onConfirm={() => {
          if (learnerToReset) {
            resetLearnerProgress(learnerToReset.id);
            setLearnerToReset(null);
          }
        }}
      />
    </div>
  );
}
