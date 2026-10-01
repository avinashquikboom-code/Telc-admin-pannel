'use client';

import React, { useState } from 'react';
import Link from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import {
  Layers,
  Plus,
  Eye,
  Trash2,
  Calendar,
  Languages,
  BookOpen,
} from 'lucide-react';
import { Chapter } from '@/types';
import { useAdminStore } from '@/lib/store';
import { PageHeader } from '@/components/admin/navigation/PageHeader';
import { DataTable } from '@/components/admin/tables/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ConfirmDialog } from '@/components/ui/dialog';

export default function ChaptersPage() {
  const { chapters, courses, deleteChapter, updateChapter } = useAdminStore();
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [chapterToDelete, setChapterToDelete] = useState<Chapter | null>(null);

  const filteredChapters = chapters.filter((ch) => {
    if (courseFilter !== 'all' && ch.courseId !== courseFilter) return false;
    if (statusFilter !== 'all' && ch.status !== statusFilter) return false;
    return true;
  });

  const columns: ColumnDef<Chapter>[] = [
    {
      accessorKey: 'title',
      header: 'Chapter',
      cell: ({ row }) => {
        const chapter = row.original;
        return (
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                Ch. {chapter.chapterNumber}
              </span>
              <a
                href={`/admin/chapters/${chapter.id}`}
                className="font-semibold text-slate-900 hover:text-blue-600 transition-colors"
              >
                {chapter.title}
              </a>
            </div>
            <span className="text-[11px] text-slate-400 line-clamp-1 max-w-sm mt-0.5">
              {chapter.description}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'courseTitle',
      header: 'Course',
      cell: ({ row }) => (
        <span className="font-medium text-slate-700">{row.original.courseTitle || 'B1 German'}</span>
      ),
    },
    {
      accessorKey: 'daysCount',
      header: 'Schedule',
      cell: ({ row }) => (
        <span className="text-slate-700">{row.original.daysCount} Days (20 words/day)</span>
      ),
    },
    {
      accessorKey: 'totalWords',
      header: 'Words',
      cell: ({ row }) => (
        <span className="font-semibold text-slate-900">{row.original.totalWords} Words</span>
      ),
    },
    {
      accessorKey: 'completedLearners',
      header: 'Completed',
      cell: ({ row }) => (
        <span className="text-slate-700 font-medium">{row.original.completedLearners} learners</span>
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
        const chapter = row.original;
        return (
          <div className="flex items-center gap-1">
            <a href={`/admin/chapters/${chapter.id}`} title="View Chapter">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600 hover:text-blue-600">
                <Eye className="h-4 w-4" />
              </Button>
            </a>
            <a href={`/admin/vocabulary?chapterId=${chapter.id}`} title="Manage Vocabulary">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600 hover:text-blue-600">
                <Languages className="h-4 w-4" />
              </Button>
            </a>
            <button
              onClick={() => setChapterToDelete(chapter)}
              title="Delete Chapter"
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
        title="Chapters"
        description="Configure 7-day module chapters, daily word quotas (20 words/day), and cumulative review stages."
        actions={
          <a href="/admin/chapters/new">
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4" />
              Create Chapter
            </Button>
          </a>
        }
      />

      <DataTable
        columns={columns}
        data={filteredChapters}
        searchKey="title"
        searchPlaceholder="Search chapters..."
        filters={
          <div className="flex flex-wrap items-center gap-2">
            {/* Course Filter */}
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
              </select>
            </div>
          </div>
        }
        emptyTitle="No chapters found"
        emptyDescription="Create your first chapter to organize vocabulary into daily 20-word sessions."
        onAddFirst={() => window.location.assign('/admin/chapters/new')}
        addFirstLabel="+ Create First Chapter"
      />

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        open={!!chapterToDelete}
        onOpenChange={(open) => !open && setChapterToDelete(null)}
        title="Delete Chapter?"
        description={`Are you sure you want to delete "${chapterToDelete?.title}"? All scheduled daily sessions will be deleted. This action cannot be undone.`}
        confirmText="Delete Chapter"
        variant="destructive"
        onConfirm={() => {
          if (chapterToDelete) {
            deleteChapter(chapterToDelete.id);
            setChapterToDelete(null);
          }
        }}
      />
    </div>
  );
}
