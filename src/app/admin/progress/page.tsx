'use client';

import React from 'react';
import {
  UserRound,
  TrendingUp,
  Layers,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { PageHeader } from '@/components/admin/navigation/PageHeader';
import { StatCard } from '@/components/admin/cards/StatCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAdminStore } from '@/lib/store';

export default function UserProgressOverviewPage() {
  const { learners, courses, chapters } = useAdminStore();

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Learning Progress"
        description="Global curriculum velocity, daily completion streaks, milestone adherence, and test scores across learner cohorts."
      />

      {/* Progress KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          title="Active Candidates"
          value={learners.length}
          icon={UserRound}
          iconColor="bg-blue-50 text-blue-600"
        />
        <StatCard
          title="Avg Progress Rate"
          value="48.5%"
          change="+4.1%"
          changeType="positive"
          icon={TrendingUp}
          iconColor="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          title="Chapters Active"
          value={chapters.length}
          icon={Layers}
          iconColor="bg-purple-50 text-purple-600"
        />
        <StatCard
          title="Avg Daily Sessions"
          value="412"
          icon={Clock}
          iconColor="bg-amber-50 text-amber-600"
        />
      </div>

      {/* Daily Progress Timeline Progression Example */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Learning Schedule & Progress Matrix</CardTitle>
          <p className="text-xs text-slate-500">
            Progress milestones from Day 1 to Day 7 concluding in chapter review
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                day: 1,
                words: '20 words',
                desc: '20 New Words • 0 Previous',
                status: 'Completed by 840 learners',
                completion: 100,
              },
              {
                day: 2,
                words: '30 words',
                desc: '20 New Words • 10 Previous Review',
                status: 'Completed by 790 learners',
                completion: 94,
              },
              {
                day: 3,
                words: '30 words',
                desc: '20 New Words • 10 Previous Review',
                status: 'Completed by 710 learners',
                completion: 84,
              },
              {
                day: 4,
                words: '30 words',
                desc: '20 New Words + Mid-Chapter Cumulative Exam',
                status: 'Completed by 680 learners',
                completion: 80,
              },
              {
                day: 5,
                words: '30 words',
                desc: '20 New Words • 10 Previous Review',
                status: 'Completed by 640 learners',
                completion: 76,
              },
              {
                day: 6,
                words: '30 words',
                desc: '20 New Words • 10 Previous Review',
                status: 'Completed by 610 learners',
                completion: 72,
              },
              {
                day: 7,
                words: '30 words',
                desc: 'Final 20 Words + End-of-Chapter Comprehensive Exam',
                status: 'Completed by 590 learners',
                completion: 70,
              },
            ].map((d) => (
              <div
                key={d.day}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-xs">
                    D{d.day}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">Day {d.day}</span>
                      <Badge variant="default" className="text-[10px]">
                        {d.words}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{d.desc}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-32 hidden sm:block">
                    <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                      <span>Pass rate</span>
                      <span>{d.completion}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-200">
                      <div
                        className="h-full bg-emerald-600 rounded-full"
                        style={{ width: `${d.completion}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-slate-700">{d.status}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
