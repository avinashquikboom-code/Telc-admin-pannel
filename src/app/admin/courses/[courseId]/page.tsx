'use client';

import React, { use, useState } from 'react';
import Link from 'next/navigation';
import {
  BookOpen,
  Layers,
  Languages,
  Users,
  TrendingUp,
  Plus,
  ArrowLeft,
  Calendar,
  Settings,
  Eye,
  CheckCircle,
  FileCheck,
} from 'lucide-react';
import { PageHeader } from '@/components/admin/navigation/PageHeader';
import { StatCard } from '@/components/admin/cards/StatCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useAdminStore } from '@/lib/store';

export default function CourseDetailPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const resolvedParams = use(params);
  const { courseId } = resolvedParams;
  const { courses, chapters, vocabulary, updateCourse } = useAdminStore();
  const [activeTab, setActiveTab] = useState('overview');

  const course = courses.find((c) => c.id === courseId) || courses[0];
  const courseChapters = chapters.filter((ch) => ch.courseId === course.id);
  const courseVocab = vocabulary.filter((v) => v.courseId === course.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <a href="/admin/courses" className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Courses
        </a>
      </div>

      <PageHeader
        title={course.title}
        description={course.description}
        badge={
          <Badge
            variant={course.status === 'published' ? 'success' : 'warning'}
            className="capitalize"
          >
            {course.status}
          </Badge>
        }
        actions={
          <div className="flex items-center gap-2">
            <a href={`/admin/chapters/new?courseId=${course.id}`}>
              <Button size="sm" className="gap-1.5 bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4" />
                Add Chapter
              </Button>
            </a>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                const nextStatus = course.status === 'published' ? 'draft' : 'published';
                updateCourse(course.id, { status: nextStatus });
              }}
            >
              {course.status === 'published' ? 'Unpublish Course' : 'Publish Course'}
            </Button>
          </div>
        }
      />

      {/* Course Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Chapters"
          value={courseChapters.length}
          icon={Layers}
          iconColor="bg-blue-50 text-blue-600"
          description="Structured learning modules"
        />
        <StatCard
          title="Vocabulary Words"
          value={courseVocab.length}
          icon={Languages}
          iconColor="bg-purple-50 text-purple-600"
          description="Active learning items"
        />
        <StatCard
          title="Enrolled Learners"
          value={course.learnersCount.toLocaleString()}
          icon={Users}
          iconColor="bg-emerald-50 text-emerald-600"
          description="Active TELC candidates"
        />
        <StatCard
          title="Avg Completion"
          value={`${course.completionRate}%`}
          icon={TrendingUp}
          iconColor="bg-amber-50 text-amber-600"
          description="Overall curriculum pass rate"
        />
      </div>

      {/* Detail Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="chapters">Chapters ({courseChapters.length})</TabsTrigger>
          <TabsTrigger value="vocabulary">Vocabulary ({courseVocab.length})</TabsTrigger>
          <TabsTrigger value="learningRules">Learning Rules</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Tab 1: Overview */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Course Specifications</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Curriculum Level</span>
                  <span className="font-semibold text-slate-800">{course.level}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Target Language</span>
                  <span className="font-semibold text-slate-800">German (Deutsch)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Translation Language</span>
                  <span className="font-semibold text-slate-800">{course.translationLanguage}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Daily Target</span>
                  <span className="font-semibold text-blue-600">20 words / day</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Days Per Chapter</span>
                  <span className="font-semibold text-slate-800">7 Days (140 Words)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Cumulative Testing</span>
                  <span className="font-semibold text-emerald-600">Enabled</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Chapters List */}
        <TabsContent value="chapters" className="space-y-3">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-semibold text-slate-800">Curriculum Chapter Sequence</h3>
            <a href={`/admin/chapters/new?courseId=${course.id}`}>
              <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                <Plus className="h-3.5 w-3.5" />
                New Chapter
              </Button>
            </a>
          </div>

          <div className="space-y-3">
            {courseChapters.map((chapter) => (
              <div
                key={chapter.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-slate-200 bg-white p-4 gap-4 shadow-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs font-bold">
                      Chapter {chapter.chapterNumber}
                    </Badge>
                    <a
                      href={`/admin/chapters/${chapter.id}`}
                      className="font-semibold text-slate-900 hover:text-blue-600"
                    >
                      {chapter.title}
                    </a>
                    <Badge
                      variant={chapter.status === 'published' ? 'success' : 'warning'}
                      className="text-[10px] capitalize"
                    >
                      {chapter.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500">{chapter.description}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                    <span>
                      Schedule: <strong className="text-slate-700">{chapter.daysCount} days</strong>
                    </span>
                    <span>
                      Target: <strong className="text-slate-700">{chapter.dailyWordTarget} words/day</strong>
                    </span>
                    <span>
                      Total: <strong className="text-slate-700">{chapter.totalWords} words</strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a href={`/admin/chapters/${chapter.id}`}>
                    <Button variant="outline" size="sm" className="h-8 text-xs gap-1">
                      <Eye className="h-3.5 w-3.5" />
                      View
                    </Button>
                  </a>
                  <a href={`/admin/vocabulary?chapterId=${chapter.id}`}>
                    <Button variant="outline" size="sm" className="h-8 text-xs gap-1">
                      <Languages className="h-3.5 w-3.5" />
                      Manage Words
                    </Button>
                  </a>
                  <a href={`/admin/learning-sessions?chapterId=${chapter.id}`}>
                    <Button variant="outline" size="sm" className="h-8 text-xs gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      Schedule
                    </Button>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Tab 3: Vocabulary */}
        <TabsContent value="vocabulary" className="space-y-3">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-semibold text-slate-800">
              Vocabulary Words in this Course ({courseVocab.length})
            </h3>
            <a href="/admin/vocabulary/new">
              <Button size="sm" className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-xs">
                <Plus className="h-3.5 w-3.5" />
                Add Word
              </Button>
            </a>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50/80 text-slate-500 font-medium">
                <tr>
                  <th className="px-4 py-3">German Word</th>
                  <th className="px-4 py-3">English Translation</th>
                  <th className="px-4 py-3">Part of Speech</th>
                  <th className="px-4 py-3">Difficulty</th>
                  <th className="px-4 py-3">Accuracy</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {courseVocab.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-semibold text-slate-900">{w.german}</td>
                    <td className="px-4 py-3 text-slate-700">{w.english}</td>
                    <td className="px-4 py-3 text-slate-500">{w.partOfSpeech}</td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          w.difficulty === 'Easy'
                            ? 'success'
                            : w.difficulty === 'Medium'
                            ? 'warning'
                            : 'destructive'
                        }
                        className="text-[10px]"
                      >
                        {w.difficulty}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-700">{w.accuracy}%</td>
                    <td className="px-4 py-3 text-right">
                      <a href={`/admin/vocabulary/${w.id}`}>
                        <Button variant="ghost" size="sm" className="h-7 text-xs text-blue-600">
                          Edit
                        </Button>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* Tab 4: Learning Rules */}
        <TabsContent value="learningRules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Course Learning Sequence Rules</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <div>
                  <p className="font-semibold text-slate-800">Words Per Batch</p>
                  <p className="text-slate-400">Step 1 presents initial memorization cards</p>
                </div>
                <span className="font-bold text-blue-600 text-sm">4 Words</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <div>
                  <p className="font-semibold text-slate-800">Daily New Word Target</p>
                  <p className="text-slate-400">Repeats batch cycles until quota is met</p>
                </div>
                <span className="font-bold text-slate-800 text-sm">20 Words</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <div>
                  <p className="font-semibold text-slate-800">Cumulative Testing</p>
                  <p className="text-slate-400">Step 4 tests previous batches in session</p>
                </div>
                <Badge variant="success">Active</Badge>
              </div>
              <div className="pt-2">
                <a href="/admin/settings">
                  <Button variant="outline" size="sm">
                    Modify Rules in System Settings
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 5: Analytics */}
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Completion Funnel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>Enrolled Candidates</span>
                  <span>1,250 learners (100%)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: '100%' }} />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>Started Chapter 1</span>
                  <span>1,180 learners (94.4%)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '94.4%' }} />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>Completed Chapter 1 Exam</span>
                  <span>840 learners (67.2%)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '67.2%' }} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
