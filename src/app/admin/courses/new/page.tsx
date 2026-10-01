'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, BookOpen, Check, Layers } from 'lucide-react';
import { PageHeader } from '@/components/admin/navigation/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAdminStore } from '@/lib/store';
import { CourseLevel, PublishingStatus } from '@/types';

const courseSchema = z.object({
  title: z.string().min(3, 'Course title must be at least 3 characters'),
  level: z.enum(['A1', 'A2', 'B1', 'B2', 'C1']),
  description: z.string().min(10, 'Please provide a clear description of at least 10 characters'),
  translationLanguage: z.string().min(2, 'Translation language is required'),
});

type CourseFormData = z.infer<typeof courseSchema>;

export default function CreateCoursePage() {
  const router = useRouter();
  const { addCourse } = useAdminStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<PublishingStatus>('draft');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: 'B1 German Vocabulary',
      level: 'B1',
      description: 'Comprehensive curriculum designed for TELC B1 certification candidates with daily learning sessions and cumulative testing.',
      translationLanguage: 'English',
    },
  });

  const onSubmit = async (data: CourseFormData) => {
    setIsSubmitting(true);
    try {
      const newCourse = addCourse({
        title: data.title,
        level: data.level as CourseLevel,
        description: data.description,
        translationLanguage: data.translationLanguage,
        status: status,
      });
      router.push(`/admin/courses/${newCourse.id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <a href="/admin/courses" className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Courses
        </a>
      </div>

      <PageHeader
        title="Create Course"
        description="Configure a new TELC language learning curriculum and define target proficiency parameters."
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Course Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Course Name <span className="text-red-500">*</span>
              </label>
              <Input
                {...register('title')}
                placeholder="e.g. B1 German Vocabulary"
                error={errors.title?.message}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Proficiency Level <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('level')}
                  className="flex h-9 w-full rounded-lg border border-slate-300 bg-white px-3 py-1 text-sm text-slate-900 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                >
                  <option value="A1">A1 — Absolute Beginner</option>
                  <option value="A2">A2 — Elementary German</option>
                  <option value="B1">B1 — Intermediate (TELC Standard)</option>
                  <option value="B2">B2 — Professional / Vocational</option>
                  <option value="C1">C1 — Advanced Academic</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Translation Language <span className="text-red-500">*</span>
                </label>
                <Input
                  {...register('translationLanguage')}
                  placeholder="English"
                  error={errors.translationLanguage?.message}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Curriculum Description <span className="text-red-500">*</span>
              </label>
              <Textarea
                {...register('description')}
                placeholder="Describe the topics, exam scope, and daily target of this course..."
                rows={4}
                error={errors.description?.message}
              />
            </div>
          </CardContent>
        </Card>

        {/* Workflow reminder card */}
        <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-4">
          <div className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Layers className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-blue-900">Curriculum Setup Sequence</h4>
              <p className="mt-0.5 text-xs text-blue-700">
                1. Save course &rarr; 2. Add chapters (e.g. 7 chapters) &rarr; 3. Add vocabulary words
                (20 words/day) &rarr; 4. Validate tests and review rules &rarr; 5. Publish to learners.
              </p>
            </div>
          </div>
        </div>

        {/* Publishing Actions */}
        <div className="flex items-center justify-between pt-2">
          <a href="/admin/courses">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </a>

          <div className="flex items-center gap-3">
            <Button
              type="submit"
              variant="outline"
              isLoading={isSubmitting && status === 'draft'}
              onClick={() => setStatus('draft')}
            >
              Save Draft
            </Button>

            <Button
              type="submit"
              isLoading={isSubmitting && status === 'published'}
              onClick={() => setStatus('published')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Check className="mr-1.5 h-4 w-4" />
              Publish Course
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
