'use client';

import React, { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import {
  BookOpen,
  Plus,
  Eye,
  Edit2,
  Copy,
  Archive,
  Trash2,
  CheckCircle2,
} from 'lucide-react';
import { Course, CourseLevel, PublishingStatus } from '@/types';
import { useAdminStore } from '@/lib/store';
import { PageHeader } from '@/components/admin/navigation/PageHeader';
import { DataTable } from '@/components/admin/tables/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormDrawer } from '@/components/admin/drawers/FormDrawer';
import { ConfirmationDrawer } from '@/components/admin/drawers/ConfirmationDrawer';
import { useToast } from '@/components/ui/toast';

export default function CoursesPage() {
  const { courses, addCourse, updateCourse, deleteCourse, duplicateCourse } = useAdminStore();
  const { toast } = useToast();

  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

  // Drawer states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [form, setForm] = useState({
    title: '',
    level: 'B1' as CourseLevel,
    description: '',
    translationLanguage: 'English',
    status: 'draft' as PublishingStatus,
  });

  const handleOpenAdd = () => {
    setEditingCourse(null);
    setForm({
      title: '',
      level: 'B1',
      description: '',
      translationLanguage: 'English',
      status: 'published',
    });
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (course: Course) => {
    setEditingCourse(course);
    setForm({
      title: course.title,
      level: course.level,
      description: course.description,
      translationLanguage: course.translationLanguage,
      status: course.status,
    });
    setIsDrawerOpen(true);
  };

  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) return;

    if (editingCourse) {
      updateCourse(editingCourse.id, form);
      toast({
        title: 'Course Updated',
        description: `"${form.title}" was successfully updated.`,
        variant: 'success',
      });
    } else {
      addCourse(form);
      toast({
        title: 'Course Created',
        description: `"${form.title}" was added to learning catalog.`,
        variant: 'success',
      });
    }

    setIsDrawerOpen(false);
  };

  // Filtered dataset
  const filteredCourses = courses.filter((c) => {
    if (levelFilter !== 'all' && c.level !== levelFilter) return false;
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    return true;
  });

  const columns: ColumnDef<Course, any>[] = [
    {
      accessorKey: 'title',
      header: 'Course',
      cell: ({ row }) => {
        const course = row.original;
        return (
          <div className="flex flex-col">
            <button
              onClick={() => handleOpenEdit(course)}
              className="font-semibold text-slate-900 hover:text-blue-600 transition-colors text-left cursor-pointer"
            >
              {course.title}
            </button>
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
      header: 'Completion',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full bg-blue-600 rounded-full"
              style={{ width: `${row.original.completionRate}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-slate-700">
            {row.original.completionRate}%
          </span>
        </div>
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
              status === 'published' ? 'default' : status === 'draft' ? 'secondary' : 'outline'
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
        const course = row.original;
        return (
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleOpenEdit(course)}
              title="Edit in Right Drawer"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-blue-600 transition-colors cursor-pointer"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => {
                duplicateCourse(course.id);
                toast({
                  title: 'Course Duplicated',
                  description: `Created a draft copy of "${course.title}".`,
                  variant: 'info',
                });
              }}
              title="Duplicate Course"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <Copy className="h-4 w-4" />
            </button>
            <button
              onClick={() => {
                const nextStatus = course.status === 'archived' ? 'published' : 'archived';
                updateCourse(course.id, { status: nextStatus });
                toast({
                  title: 'Status Updated',
                  description: `Course is now ${nextStatus}.`,
                  variant: 'info',
                });
              }}
              title={course.status === 'archived' ? 'Restore Course' : 'Archive Course'}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-amber-700 transition-colors cursor-pointer"
            >
              <Archive className="h-4 w-4" />
            </button>
            <button
              onClick={() => setCourseToDelete(course)}
              title="Delete Course"
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
        title="Courses"
        description="Manage TELC curriculum levels, course modules, chapter hierarchies, and publishing states."
        actions={
          <Button onClick={handleOpenAdd} className="gap-2 bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4" />
            Create Course
          </Button>
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
        onAddFirst={handleOpenAdd}
        addFirstLabel="+ Create First Course"
      />

      {/* ======================================================== */}
      {/* ADD / EDIT COURSE RIGHT-SIDE DRAWER */}
      {/* ======================================================== */}
      <FormDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        title={editingCourse ? 'Edit Course' : 'Create Course'}
        description={
          editingCourse
            ? `Modify curriculum settings for ${editingCourse.title}`
            : 'Add a new TELC certificate curriculum to the platform.'
        }
        submitLabel={editingCourse ? 'Save Changes' : 'Create Course'}
        onSubmit={handleSaveCourse}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Course Title <span className="text-red-500">*</span>
            </label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. TELC Deutsch B1 — Komplettkurs"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">CEFR Level</label>
              <select
                value={form.level}
                onChange={(e) => setForm({ ...form, level: e.target.value as CourseLevel })}
                className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-700"
              >
                <option value="A1">A1 — Absolute Beginner</option>
                <option value="A2">A2 — Elementary</option>
                <option value="B1">B1 — Intermediate (Exam)</option>
                <option value="B2">B2 — Upper Intermediate</option>
                <option value="C1">C1 — Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Translation Language</label>
              <Input
                value={form.translationLanguage}
                onChange={(e) => setForm({ ...form, translationLanguage: e.target.value })}
                placeholder="English"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Full curriculum description and learning goals for the mobile app..."
              rows={3}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Publishing Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as PublishingStatus })}
              className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-700"
            >
              <option value="published">Published (Visible to learners)</option>
              <option value="draft">Draft (Curriculum in progress)</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </FormDrawer>

      {/* ======================================================== */}
      {/* DELETE CONFIRMATION RIGHT-SIDE DRAWER */}
      {/* ======================================================== */}
      {courseToDelete && (
        <ConfirmationDrawer
          open={!!courseToDelete}
          onOpenChange={(open) => !open && setCourseToDelete(null)}
          title="Delete Course?"
          description={`Are you sure you want to delete "${courseToDelete.title}"? All chapters and vocabulary relationships will be permanently removed.`}
          confirmText="Delete Course"
          variant="destructive"
          onConfirm={() => {
            deleteCourse(courseToDelete.id);
            toast({
              title: 'Course Deleted',
              description: `"${courseToDelete.title}" has been deleted.`,
              variant: 'default',
            });
            setCourseToDelete(null);
          }}
        />
      )}
    </div>
  );
}
