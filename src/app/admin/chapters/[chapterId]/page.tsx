'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import {
  Layers,
  BookOpen,
  Calendar,
  Languages,
  ArrowLeft,
  Plus,
  ClipboardCheck,
  RefreshCw,
  BarChart3,
  CheckCircle,
} from 'lucide-react';
import { PageHeader } from '@/components/admin/navigation/PageHeader';
import { StatCard } from '@/components/admin/cards/StatCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useAdminStore } from '@/lib/store';

export default function ChapterDetailPage({
  params,
}: {
  params: Promise<{ chapterId: string }>;
}) {
  const resolvedParams = use(params);
  const { chapterId } = resolvedParams;
  const { chapters, vocabulary, learningSessions, tests } = useAdminStore();
  const [activeTab, setActiveTab] = useState('overview');

  const chapter = chapters.find((ch) => ch.id === chapterId) || chapters[0];
  const chapterVocab = vocabulary.filter((v) => v.chapterId === chapter.id);
  const chapterSessions = learningSessions.filter((s) => s.chapterId === chapter.id || s.courseId === chapter.courseId);
  const chapterTests = tests.filter((t) => t.chapterId === chapter.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <a href="/admin/chapters" className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Chapters
        </a>
      </div>

      <PageHeader
        title={`Chapter ${chapter.chapterNumber}: ${chapter.title}`}
        description={chapter.description}
        badge={
          <div className="flex items-center gap-2">
            <Badge variant="default">{chapter.courseTitle || 'B1 German'}</Badge>
            <Badge variant={chapter.status === 'published' ? 'success' : 'warning'} className="capitalize">
              {chapter.status}
            </Badge>
          </div>
        }
        actions={
          <div className="flex items-center gap-2">
            <a href={`/admin/vocabulary/new?chapterId=${chapter.id}`}>
              <Button size="sm" className="gap-1.5 bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4" />
                Add Word to Chapter
              </Button>
            </a>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Vocabulary"
          value={`${chapter.totalWords || chapterVocab.length} Words`}
          icon={Languages}
          iconColor="bg-blue-50 text-blue-600"
          description="Target: 140 vocabulary words"
        />
        <StatCard
          title="Daily Sessions"
          value={`${chapter.daysCount} Days`}
          icon={Calendar}
          iconColor="bg-emerald-50 text-emerald-600"
          description="Curriculum schedule length"
        />
        <StatCard
          title="Daily Word Target"
          value={`${chapter.dailyWordTarget} Words`}
          icon={Layers}
          iconColor="bg-purple-50 text-purple-600"
          description="Batch size: 4 words"
        />
        <StatCard
          title="Completed Learners"
          value={chapter.completedLearners.toLocaleString()}
          icon={CheckCircle}
          iconColor="bg-amber-50 text-amber-600"
          description="Graduated through exam"
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="vocabulary">Vocabulary ({chapterVocab.length})</TabsTrigger>
          <TabsTrigger value="dailySchedule">Daily Schedule (7 Days)</TabsTrigger>
          <TabsTrigger value="tests">Tests ({chapterTests.length})</TabsTrigger>
          <TabsTrigger value="review">Review Flow</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Tab 1: Overview */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Chapter Structure Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Course</span>
                  <span className="font-semibold text-slate-800">{chapter.courseTitle}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Curriculum Position</span>
                  <span className="font-semibold text-slate-800">Chapter {chapter.chapterNumber}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Daily Quota</span>
                  <span className="font-semibold text-blue-600">{chapter.dailyWordTarget} words/day</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Review Previous Words</span>
                  <span className="font-semibold text-emerald-600">
                    {chapter.reviewEnabled ? 'Enabled (10 words)' : 'Disabled'}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Session Test Type</span>
                  <span className="font-semibold text-slate-800">Cumulative Flashcard Test</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">End-of-Chapter Exam</span>
                  <span className="font-semibold text-purple-600">50 Questions Comprehensive</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Vocabulary */}
        <TabsContent value="vocabulary" className="space-y-3">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-semibold text-slate-800">
              Vocabulary Words in Chapter {chapter.chapterNumber}
            </h3>
            <a href={`/admin/vocabulary/new?chapterId=${chapter.id}`}>
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
                  <th className="px-4 py-3">Article</th>
                  <th className="px-4 py-3">English Translation</th>
                  <th className="px-4 py-3">Part of Speech</th>
                  <th className="px-4 py-3">Difficulty</th>
                  <th className="px-4 py-3">Accuracy</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {chapterVocab.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-semibold text-slate-900">{w.german}</td>
                    <td className="px-4 py-3">
                      {w.article !== 'none' ? (
                        <span className="font-mono text-blue-600 font-semibold">{w.article}</span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
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

        {/* Tab 3: Daily Schedule */}
        <TabsContent value="dailySchedule" className="space-y-3">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h3 className="text-sm font-semibold text-slate-800">7-Day Learning Session Distribution</h3>
              <p className="text-xs text-slate-500">
                Each day combines new words with previous vocabulary review
              </p>
            </div>
            <a href="/admin/learning-sessions">
              <Button size="sm" variant="outline" className="text-xs">
                Edit Schedule Config
              </Button>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {chapterSessions.slice(0, 7).map((s) => (
              <div key={s.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <Badge variant="default" className="text-xs font-bold">
                    Day {s.dayNumber}
                  </Badge>
                  <span className="text-xs font-semibold text-slate-700">
                    {s.totalWordsCount} Words Total
                  </span>
                </div>
                <div className="mt-3 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>New Vocabulary:</span>
                    <strong className="text-blue-600">{s.newWordsCount} words</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Previous Review Words:</span>
                    <strong className="text-amber-600">{s.previousWordsCount} words</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Estimated Session Time:</span>
                    <strong className="text-slate-700">{s.durationMinutes} minutes</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Tab 4: Tests */}
        <TabsContent value="tests" className="space-y-3">
          <div className="space-y-3">
            {chapterTests.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-xs"
              >
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">{t.title}</h4>
                  <p className="text-xs text-slate-500">
                    Type: {t.type} • {t.questionsCount} questions • {t.attemptsCount} attempts
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-emerald-600">
                    Avg Score: {t.averageScore}%
                  </span>
                  <a href="/admin/tests">
                    <Button variant="outline" size="sm" className="text-xs">
                      Manage Test
                    </Button>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Tab 5: Review */}
        <TabsContent value="review" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Chapter Review Rules</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <p className="text-slate-600 leading-relaxed">
                When a learner finishes Day 7 of Chapter {chapter.chapterNumber}, the system unlocks the
                <strong> Chapter Review Stage</strong>. In this stage, all {chapter.totalWords} words from
                the chapter are presented in randomized test sequences to ensure long-term retention
                before proceeding to Chapter {chapter.chapterNumber + 1}.
              </p>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <span className="font-semibold text-slate-800">Automatic Previous Selection:</span>{' '}
                Selects the 10 words with the lowest accuracy or longest time since last review.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 6: Analytics */}
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Chapter Funnel Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Learners Enrolled</span>
                <span className="font-semibold text-slate-800">1,040 learners</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Completed Day 7</span>
                <span className="font-semibold text-emerald-600">840 learners (80.7%)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Average Chapter Accuracy</span>
                <span className="font-semibold text-blue-600">88.4%</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
