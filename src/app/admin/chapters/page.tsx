'use client';

import React, { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Languages,
  BookOpen,
} from 'lucide-react';
import { Chapter, PublishingStatus } from '@/types';
import { useAdminStore } from '@/lib/store';
import { PageHeader } from '@/components/admin/navigation/PageHeader';
import { DataTable } from '@/components/admin/tables/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { FormDrawer } from '@/components/admin/drawers/FormDrawer';
import { ConfirmationDrawer } from '@/components/admin/drawers/ConfirmationDrawer';
import { useToast } from '@/components/ui/toast';

export default function ChaptersPage() {
  const { chapters, courses, addChapter, updateChapter, deleteChapter } = useAdminStore();
  const { toast } = useToast();

  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [chapterToDelete, setChapterToDelete] = useState<Chapter | null>(null);

  // Drawer states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  const [form, setForm] = useState({
    title: '',
    courseId: courses[0]?.id || '',
    chapterNumber: 1,
    description: '',
    daysCount: 7,
    dailyWordTarget: 20,
    reviewEnabled: true,
    status: 'published' as PublishingStatus,
  });

  const handleOpenAdd = () => {
    setEditingChapter(null);
    setForm({
      title: '',
      courseId: courses[0]?.id || '',
      chapterNumber: chapters.length + 1,
      description: '',
      daysCount: 7,
      dailyWordTarget: 20,
      reviewEnabled: true,
      status: 'published',
    });
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (chapter: Chapter) => {
    setEditingChapter(chapter);
    setForm({
      title: chapter.title,
      courseId: chapter.courseId,
      chapterNumber: chapter.chapterNumber,
      description: chapter.description,
      daysCount: chapter.daysCount,
      dailyWordTarget: chapter.dailyWordTarget,
      reviewEnabled: chapter.reviewEnabled,
      status: chapter.status,
    });
    setIsDrawerOpen(true);
  };

  const handleSaveChapter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) return;

    const courseObj = courses.find((c) => c.id === form.courseId);
    const courseTitle = courseObj ? courseObj.title : 'TELC German';

    if (editingChapter) {
      updateChapter(editingChapter.id, {
        ...form,
        courseTitle,
      });
      toast({
        title: 'Chapter Updated',
        description: `Kapitel ${form.chapterNumber}: "${form.title}" saved.`,
        variant: 'success',
      });
    } else {
      addChapter({
        ...form,
        courseTitle,
      });
      toast({
        title: 'Chapter Created',
        description: `Kapitel ${form.chapterNumber}: "${form.title}" created.`,
        variant: 'success',
      });
    }

    setIsDrawerOpen(false);
  };

  const filteredChapters = chapters.filter((ch) => {
    if (courseFilter !== 'all' && ch.courseId !== courseFilter) return false;
    if (statusFilter !== 'all' && ch.status !== statusFilter) return false;
    return true;
  });

  const columns: ColumnDef<Chapter, any>[] = [
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
              <button
                onClick={() => handleOpenEdit(chapter)}
                className="font-semibold text-slate-900 hover:text-blue-600 transition-colors text-left cursor-pointer"
              >
                {chapter.title}
              </button>
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
        <span className="text-slate-700">{row.original.daysCount} Days ({row.original.dailyWordTarget} words/day)</span>
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
                ? 'default'
                : status === 'draft'
                ? 'secondary'
                : 'outline'
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
        const chapter = row.original;
        return (
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleOpenEdit(chapter)}
              title="Edit in Right Drawer"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-blue-600 transition-colors cursor-pointer"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setChapterToDelete(chapter)}
              title="Delete Chapter"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
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
        description="Configure structured 7-day chapter modules, daily 20-word targets, and chapter wrap-up milestones."
        actions={
          <Button onClick={handleOpenAdd} className="gap-2 bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4" />
            Create Chapter
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={filteredChapters}
        searchKey="title"
        searchPlaceholder="Search chapters..."
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
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        }
        emptyTitle="No chapters found"
        emptyDescription="Create a chapter module to organize vocabulary words into 7-day learning schedules."
        onAddFirst={handleOpenAdd}
        addFirstLabel="+ Create First Chapter"
      />

      {/* ======================================================== */}
      {/* ADD / EDIT CHAPTER RIGHT-SIDE DRAWER */}
      {/* ======================================================== */}
      <FormDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        title={editingChapter ? 'Edit Chapter' : 'Create Chapter'}
        description={
          editingChapter
            ? `Update settings for ${editingChapter.title}`
            : 'Configure a new learning chapter module.'
        }
        submitLabel={editingChapter ? 'Save Changes' : 'Create Chapter'}
        onSubmit={handleSaveChapter}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Parent Course</label>
            <select
              value={form.courseId}
              onChange={(e) => setForm({ ...form, courseId: e.target.value })}
              className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-700"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title} ({c.level})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Chapter Number</label>
              <Input
                type="number"
                value={form.chapterNumber}
                onChange={(e) => setForm({ ...form, chapterNumber: Number(e.target.value) })}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Chapter Title <span className="text-red-500">*</span>
              </label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Familie & Freunde"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Days Count</label>
              <Input
                type="number"
                value={form.daysCount}
                onChange={(e) => setForm({ ...form, daysCount: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Daily Target</label>
              <Input
                type="number"
                value={form.dailyWordTarget}
                onChange={(e) => setForm({ ...form, dailyWordTarget: Number(e.target.value) })}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Overview of thematic topic covered in this chapter..."
              rows={3}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50">
            <div>
              <p className="text-xs font-semibold text-slate-800">Spaced Review Integration</p>
              <p className="text-[11px] text-slate-500">Enable Day 7 chapter review test</p>
            </div>
            <Switch
              checked={form.reviewEnabled}
              onCheckedChange={(val) => setForm({ ...form, reviewEnabled: val })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Publishing Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as PublishingStatus })}
              className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-700"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </FormDrawer>

      {/* ======================================================== */}
      {/* DELETE CONFIRMATION DRAWER */}
      {/* ======================================================== */}
      {chapterToDelete && (
        <ConfirmationDrawer
          open={!!chapterToDelete}
          onOpenChange={(open) => !open && setChapterToDelete(null)}
          title="Delete Chapter?"
          description={`Are you sure you want to delete "${chapterToDelete.title}"? Associated vocabulary words will be removed.`}
          confirmText="Delete Chapter"
          variant="destructive"
          onConfirm={() => {
            deleteChapter(chapterToDelete.id);
            toast({
              title: 'Chapter Deleted',
              description: `"${chapterToDelete.title}" deleted.`,
              variant: 'default',
            });
            setChapterToDelete(null);
          }}
        />
      )}
    </div>
  );
}
