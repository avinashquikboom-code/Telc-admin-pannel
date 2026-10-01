'use client';

import React, { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import {
  Users,
  Eye,
  RotateCcw,
  Ban,
  CheckCircle,
  GraduationCap,
  BookOpen,
  Calendar,
  Award,
} from 'lucide-react';
import { Learner } from '@/types';
import { useAdminStore } from '@/lib/store';
import { PageHeader } from '@/components/admin/navigation/PageHeader';
import { DataTable } from '@/components/admin/tables/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AdminDrawer } from '@/components/admin/drawers/AdminDrawer';
import { ConfirmationDrawer } from '@/components/admin/drawers/ConfirmationDrawer';
import { useToast } from '@/components/ui/toast';
import { formatTimeAgo } from '@/lib/utils';

export default function UsersPage() {
  const { toast } = useToast();
  const { learners, courses, updateLearnerStatus, resetLearnerProgress } = useAdminStore();
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Drawer states
  const [selectedLearner, setSelectedLearner] = useState<Learner | null>(null);
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
              <button
                onClick={() => setSelectedLearner(item)}
                className="font-bold text-slate-900 hover:text-blue-600 transition-colors text-left cursor-pointer"
              >
                {item.name}
              </button>
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
        <span className="text-xs font-semibold text-emerald-600">{row.original.averageScore}%</span>
      ),
    },
    {
      accessorKey: 'lastActive',
      header: 'Last Active',
      cell: ({ row }) => (
        <span className="text-xs text-slate-500">{formatTimeAgo(row.original.lastActive)}</span>
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
              status === 'active' ? 'default' : status === 'suspended' ? 'destructive' : 'secondary'
            }
            className="capitalize"
          >
            {status}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        const learner = row.original;
        return (
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSelectedLearner(learner)}
              title="View Details in Drawer"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-blue-600 transition-colors cursor-pointer"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              onClick={() => {
                const nextStatus = learner.status === 'active' ? 'suspended' : 'active';
                updateLearnerStatus(learner.id, nextStatus);
                toast({
                  title: 'Learner Status Changed',
                  description: `${learner.name} is now ${nextStatus}.`,
                  variant: nextStatus === 'suspended' ? 'destructive' : 'success',
                });
              }}
              title={learner.status === 'active' ? 'Suspend Learner' : 'Activate Learner'}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-amber-700 transition-colors cursor-pointer"
            >
              {learner.status === 'active' ? <Ban className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setLearnerToReset(learner)}
              title="Reset Progress"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
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
        description="Monitor registered mobile learners, curriculum progress, review consistency, and account statuses."
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
        emptyDescription="Learners registered through the TELC Mastery mobile app will be displayed here."
      />

      {/* ======================================================== */}
      {/* LEARNER DETAILS RIGHT-SIDE DRAWER */}
      {/* ======================================================== */}
      {selectedLearner && (
        <AdminDrawer
          open={!!selectedLearner}
          onOpenChange={(open) => !open && setSelectedLearner(null)}
          title={selectedLearner.name}
          description={`Registered Learner ID: ${selectedLearner.id}`}
          badge={
            <Badge
              variant={selectedLearner.status === 'active' ? 'default' : 'destructive'}
              className="text-[10px]"
            >
              {selectedLearner.status}
            </Badge>
          }
          footer={
            <div className="flex items-center justify-between w-full">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setLearnerToReset(selectedLearner)}
                className="text-xs text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 gap-1.5"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset Progress
              </Button>
              <Button type="button" size="sm" onClick={() => setSelectedLearner(null)}>
                Close
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            {/* Profile Overview Card */}
            <div className="flex items-center gap-3.5 p-4 rounded-xl border border-slate-200 bg-slate-50">
              <img
                src={selectedLearner.avatarUrl}
                alt={selectedLearner.name}
                className="h-14 w-14 rounded-full object-cover border-2 border-white shadow-xs"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-bold text-slate-900">{selectedLearner.name}</h4>
                <p className="text-xs text-slate-500">{selectedLearner.email}</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Enrolled: {new Date(selectedLearner.joinedDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Curriculum Progress */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Current Course</span>
                <Badge variant="outline" className="text-[11px]">
                  {selectedLearner.courseName}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 font-medium">Chapter: {selectedLearner.chapterName}</p>

              <div>
                <div className="flex justify-between text-xs mb-1.5 font-medium">
                  <span className="text-slate-600">Completion</span>
                  <span className="font-bold text-blue-600">{selectedLearner.progressPercentage}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${selectedLearner.progressPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Performance Stats Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-center">
                <span className="text-slate-400 block text-[11px]">Words Learned</span>
                <span className="text-xl font-bold text-slate-900 mt-0.5 block">
                  {selectedLearner.wordsLearned}
                </span>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-center">
                <span className="text-slate-400 block text-[11px]">Words Reviewed</span>
                <span className="text-xl font-bold text-blue-600 mt-0.5 block">
                  {selectedLearner.wordsReviewed}
                </span>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-center">
                <span className="text-slate-400 block text-[11px]">Tests Completed</span>
                <span className="text-xl font-bold text-purple-600 mt-0.5 block">
                  {selectedLearner.testsCompleted}
                </span>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-center">
                <span className="text-slate-400 block text-[11px]">Average Score</span>
                <span className="text-xl font-bold text-emerald-600 mt-0.5 block">
                  {selectedLearner.averageScore}%
                </span>
              </div>
            </div>
          </div>
        </AdminDrawer>
      )}

      {/* ======================================================== */}
      {/* RESET PROGRESS CONFIRMATION DRAWER */}
      {/* ======================================================== */}
      {learnerToReset && (
        <ConfirmationDrawer
          open={!!learnerToReset}
          onOpenChange={(open) => !open && setLearnerToReset(null)}
          title="Reset Learner Progress?"
          description={`Are you sure you want to reset all vocabulary progress and test scores for "${learnerToReset.name}"?`}
          confirmText="Confirm Progress Reset"
          variant="destructive"
          onConfirm={() => {
            resetLearnerProgress(learnerToReset.id);
            toast({
              title: 'Progress Reset',
              description: `All learning history reset for ${learnerToReset.name}.`,
              variant: 'default',
            });
            setLearnerToReset(null);
            if (selectedLearner && selectedLearner.id === learnerToReset.id) {
              setSelectedLearner({
                ...selectedLearner,
                progressPercentage: 0,
                wordsLearned: 0,
                wordsReviewed: 0,
                testsCompleted: 0,
                averageScore: 0,
              });
            }
          }}
        />
      )}
    </div>
  );
}
