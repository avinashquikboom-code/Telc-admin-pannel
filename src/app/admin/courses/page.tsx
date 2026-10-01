'use client';

import React, { useState } from 'react';
import Link from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import {
  BookOpen,
  Plus,
  Eye,
  Edit2,
  Copy,
  Archive,
  Trash2,
  Filter,
  CheckCircle2,
} from 'lucide-react';
import { Course, CourseLevel, PublishingStatus } from '@/types';
import { useAdminStore } from '@/lib/store';
import { PageHeader } from '@/components/admin/navigation/PageHeader';
import { DataTable } from '@/components/admin/tables/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ConfirmDialog } from '@/components/ui/dialog';

export default function CoursesPage() {
  const { courses, deleteCourse, duplicateCourse, updateCourse } = useAdminStore();
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

  // Filtered dataset
  const filteredCourses = courses.filter((c) => {
    if (levelFilter !== 'all' && c.level !== levelFilter) return false;
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    return true;
  });

  const columns: ColumnDef<Course>[] = [
    {
      accessorKey: 'title',
      header: 'Course',
      cell: ({ row }) => {
        const course = row.original;
        return (
          <div className="flex flex-col">
            <a
              href={`/admin/courses/${course.id}`}
              className="font-semibold text-slate-900 hover:text-blue-600 transition-colors"
            >
              {course.title}
            </a>
            <span className="text-[11px] text-slate-400 line-clamp-1 max-w-sm">
              {course.description}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'level',
      header: 'Level',
      cell: ({ row }) => (
        <Badge
          variant={
            row.original.level === 'B1'
              ? 'default'
              : row.original.level === 'B2'
              ? 'purple'
              : 'secondary'
          }
          className="font-bold"
        >
          {row.original.level}
        </Badge>
      ),
    },
    {
      accessorKey: 'totalChapters',
      header: 'Chapters',
      cell: ({ row }) => (
        <span className="font-medium text-slate-700">{row.original.totalChapters} Chapters</span>
      ),
    },
    {
      accessorKey: 'totalVocabulary',
      header: 'Vocabulary',
      cell: ({ row }) => (
        <span className="font-medium text-slate-700">{row.original.totalVocabulary} Words</span>
      ),
    },
    {
      accessorKey: 'learnersCount',
      header: 'Learners',
      cell: ({ row }) => (
        <span className="font-medium text-slate-700">
          {row.original.learnersCount.toLocaleString()}
        </span>
      ),
    },
    {
      accessorKey: 'completionRate',
      header: 'Progress',
      cell: ({ row }) => {
        const rate = row.original.completionRate;
        return (
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-16 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full" style={{ width: `${rate}%` }} />
            </div>
            <span className="text-xs font-semibold text-slate-700">{rate}%</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge
            variant={
              status === 'published'
                ? 'success'
                : status === 'draft'
                ? 'warning'
                : 'secondary'
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
      header: 'Actions',
      cell: ({ row }) => {
        const course = row.original;
        return (
          <div className="flex items-center gap-1">
            <a href={`/admin/courses/${course.id}`} title="View Course">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600 hover:text-blue-600">
                <Eye className="h-4 w-4" />
              </Button>
            </a>
            <button
              onClick={() => duplicateCourse(course.id)}
              title="Duplicate Course"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              <Copy className="h-4 w-4" />
            </button>
            <button
              onClick={() => {
                const nextStatus = course.status === 'archived' ? 'published' : 'archived';
                updateCourse(course.id, { status: nextStatus });
              }}
              title={course.status === 'archived' ? 'Restore Course' : 'Archive Course'}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-amber-700 transition-colors"
            >
              <Archive className="h-4 w-4" />
            </button>
            <button
              onClick={() => setCourseToDelete(course)}
              title="Delete Course"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Courses"
        description="Manage TELC curriculum levels, course modules, chapter hierarchies, and publishing states."
        actions={
          <a href="/admin/courses/new">
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4" />
              Create Course
            </Button>
          </a>
        }
      />

      {/* TanStack Table with filters */}
      <DataTable
        columns={columns}
        data={filteredCourses}
        searchKey="title"
        searchPlaceholder="Search courses by name..."
        filters={
          <div className="flex flex-wrap items-center gap-2">
            {/* Level Filter */}
            <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs">
              <span className="text-slate-400">Level:</span>
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="bg-transparent font-medium text-slate-700 focus:outline-hidden cursor-pointer"
              >
                <option value="all">All Levels</option>
                <option value="A1">A1</option>
                <option value="A2">A2</option>
                <option value="B1">B1</option>
                <option value="B2">B2</option>
                <option value="C1">C1</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs">
              <span className="text-slate-400">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent font-medium text-slate-700 focus:outline-hidden cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        }
        emptyTitle="No courses found"
        emptyDescription="Create your first TELC learning course to begin adding chapters and vocabulary."
        onAddFirst={() => window.location.assign('/admin/courses/new')}
        addFirstLabel="+ Create First Course"
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        open={!!courseToDelete}
        onOpenChange={(open) => !open && setCourseToDelete(null)}
        title="Delete Course?"
        description={`Are you sure you want to delete "${courseToDelete?.title}"? All chapters and associated vocabulary relationships will be permanently removed. This action cannot be undone.`}
        confirmText="Delete Course"
        variant="destructive"
        onConfirm={() => {
          if (courseToDelete) {
            deleteCourse(courseToDelete.id);
            setCourseToDelete(null);
          }
        }}
      />
    </div>
  );
}
