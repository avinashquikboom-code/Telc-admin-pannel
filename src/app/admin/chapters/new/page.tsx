'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, Check, Layers } from 'lucide-react';
import { PageHeader } from '@/components/admin/navigation/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAdminStore } from '@/lib/store';
import { PublishingStatus } from '@/types';

const chapterSchema = z.object({
  title: z.string().min(3, 'Chapter title must be at least 3 characters'),
  chapterNumber: z.coerce.number().min(1, 'Chapter number must be at least 1'),
  courseId: z.string().min(1, 'Course selection is required'),
  description: z.string().min(5, 'Provide a short description'),
  dailyWordTarget: z.coerce.number().min(5).max(50),
  daysCount: z.coerce.number().min(1).max(30),
});

type ChapterFormData = z.infer<typeof chapterSchema>;

export default function CreateChapterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultCourseId = searchParams.get('courseId') || 'course_b1';
  const { courses, addChapter } = useAdminStore();
  const [reviewEnabled, setReviewEnabled] = useState(true);
  const [status, setStatus] = useState<PublishingStatus>('published');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChapterFormData>({
    resolver: zodResolver(chapterSchema),
    defaultValues: {
      title: '',
      chapterNumber: 5,
      courseId: defaultCourseId,
      description: 'Vocabulary covering core communication topics for TELC examination.',
      dailyWordTarget: 20,
      daysCount: 7,
    },
  });

  const onSubmit = async (data: ChapterFormData) => {
    setIsSubmitting(true);
    try {
      const selectedCourse = courses.find((c) => c.id === data.courseId);
      const newChap = addChapter({
        title: data.title,
        chapterNumber: data.chapterNumber,
        courseId: data.courseId,
        courseTitle: selectedCourse?.title || 'B1 German Vocabulary',
        description: data.description,
        dailyWordTarget: data.dailyWordTarget,
        daysCount: data.daysCount,
        reviewEnabled: reviewEnabled,
        status: status,
      });
      router.push(`/admin/chapters/${newChap.id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <a href="/admin/chapters" className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Chapters
        </a>
      </div>

      <PageHeader
        title="Create Chapter"
        description="Set up a structured learning module with daily word quota and automatic review progression."
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Chapter Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Chapter Name <span className="text-red-500">*</span>
                </label>
                <Input
                  {...register('title')}
                  placeholder="e.g. Medien & Kommunikation"
                  error={errors.title?.message}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Chapter Number <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  {...register('chapterNumber')}
                  error={errors.chapterNumber?.message}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Parent Course <span className="text-red-500">*</span>
              </label>
              <select
                {...register('courseId')}
                className="flex h-9 w-full rounded-lg border border-slate-300 bg-white px-3 py-1 text-sm text-slate-900 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              >
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title} ({course.level})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Chapter Description
              </label>
              <Textarea
                {...register('description')}
                placeholder="Overview of topics and practical contexts taught in this chapter..."
                rows={3}
                error={errors.description?.message}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Daily Word Target (Words / Day)
                </label>
                <Input
                  type="number"
                  {...register('dailyWordTarget')}
                  placeholder="20"
                  error={errors.dailyWordTarget?.message}
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  TELC standard: 20 new words learned per day
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Total Schedule Days
                </label>
                <Input
                  type="number"
                  {...register('daysCount')}
                  placeholder="7"
                  error={errors.daysCount?.message}
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  7 days × 20 words = 140 vocabulary words per chapter
                </p>
              </div>
            </div>

            {/* Review switch */}
            <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/50 p-3.5">
              <div>
                <p className="text-xs font-semibold text-slate-800">Enable Previous Review Flow</p>
                <p className="text-[11px] text-slate-500">
                  Includes 10 previous vocabulary words into daily sessions starting from Day 2
                </p>
              </div>
              <Switch checked={reviewEnabled} onCheckedChange={setReviewEnabled} />
            </div>
          </CardContent>
        </Card>

        {/* Action buttons */}
        <div className="flex items-center justify-between pt-2">
          <a href="/admin/chapters">
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
              Publish Chapter
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
