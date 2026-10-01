'use client';

import React from 'react';
import {
  Layers,
  ArrowLeft,
  Users,
  CheckCircle2,
  Clock,
  Award,
  TrendingUp,
  RotateCcw,
} from 'lucide-react';
import { PageHeader } from '@/components/admin/navigation/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAdminStore } from '@/lib/store';

export default function LearningAndChapterAnalyticsPage() {
  const { chapters } = useAdminStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <a href="/admin/analytics" className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Analytics
        </a>
      </div>

      <PageHeader
        title="Chapter & Learning Analytics"
        description="Conversion funnels, completion velocity, average examination grades, and retention review ratios per module chapter."
      />

      {/* Chapter Completion Funnels */}
      <div className="space-y-4">
        {chapters.map((ch, idx) => {
          const totalEnrolled = ch.completedLearners + 210;
          const started = ch.completedLearners + 130;
          const completed = ch.completedLearners;
          const startRatio = Math.round((started / totalEnrolled) * 100);
          const compRatio = Math.round((completed / totalEnrolled) * 100);

          return (
            <Card key={ch.id}>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="text-xs font-bold">
                    Chapter {ch.chapterNumber}
                  </Badge>
                  <CardTitle className="text-base font-bold text-slate-900">
                    {ch.title}
                  </CardTitle>
                </div>
                <Badge variant={ch.status === 'published' ? 'success' : 'secondary'} className="capitalize">
                  {ch.status}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Visual completion funnel */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <span className="text-[11px] font-semibold text-slate-500">1. Enrolled Candidates</span>
                    <p className="mt-1 text-lg font-bold text-slate-900">{totalEnrolled} learners</p>
                    <div className="mt-1.5 h-1.5 w-full rounded-full bg-slate-200">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: '100%' }} />
                    </div>
                  </div>

                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <span className="text-[11px] font-semibold text-slate-500">2. Began Day 1</span>
                    <p className="mt-1 text-lg font-bold text-slate-900">
                      {started} learners ({startRatio}%)
                    </p>
                    <div className="mt-1.5 h-1.5 w-full rounded-full bg-slate-200">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${startRatio}%` }} />
                    </div>
                  </div>

                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <span className="text-[11px] font-semibold text-slate-500">3. Completed Chapter Exam</span>
                    <p className="mt-1 text-lg font-bold text-emerald-600">
                      {completed} learners ({compRatio}%)
                    </p>
                    <div className="mt-1.5 h-1.5 w-full rounded-full bg-slate-200">
                      <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${compRatio}%` }} />
                    </div>
                  </div>
                </div>

                {/* Chapter metrics strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="text-slate-400 text-[10px]">Avg Completion Time</p>
                      <p className="font-semibold text-slate-800">6.8 days</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-emerald-500" />
                    <div>
                      <p className="text-slate-400 text-[10px]">Average Test Score</p>
                      <p className="font-semibold text-emerald-600">86.4%</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-purple-500" />
                    <div>
                      <p className="text-slate-400 text-[10px]">Vocabulary Accuracy</p>
                      <p className="font-semibold text-slate-800">89.2%</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <RotateCcw className="h-4 w-4 text-amber-500" />
                    <div>
                      <p className="text-slate-400 text-[10px]">Review Usage</p>
                      <p className="font-semibold text-slate-800">92% daily adherence</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
