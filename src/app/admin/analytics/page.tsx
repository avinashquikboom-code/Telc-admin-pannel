'use client';

import React, { useState } from 'react';
import {
  BarChart3,
  Users,
  Languages,
  RotateCcw,
  Award,
  CheckCircle2,
  Calendar,
  TrendingUp,
} from 'lucide-react';
import { PageHeader } from '@/components/admin/navigation/PageHeader';
import { StatCard } from '@/components/admin/cards/StatCard';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAdminStore } from '@/lib/store';
import { activityTrend7Days } from '@/lib/mockData';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts';

export default function AnalyticsPage() {
  const { analytics } = useAdminStore();
  const [dateRange, setDateRange] = useState<'today' | '7' | '30' | '90'>('7');

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics Overview"
        description="Holistic performance metrics across learners, memorization retention rates, examination scores, and daily sessions."
        actions={
          <div className="flex items-center rounded-lg border border-slate-200 bg-white p-0.5 shadow-xs">
            {(['today', '7', '30', '90'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors cursor-pointer capitalize ${
                  dateRange === range
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {range === 'today' ? 'Today' : `${range} Days`}
              </button>
            ))}
          </div>
        }
      />

      {/* Row 1: KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <StatCard
          title="Daily Active Learners"
          value={analytics.dailyActiveLearners.toLocaleString()}
          change="+6.4%"
          changeType="positive"
          icon={Users}
          iconColor="bg-blue-50 text-blue-600"
        />
        <StatCard
          title="Weekly Active Learners"
          value={analytics.weeklyActiveLearners.toLocaleString()}
          change="+11.2%"
          changeType="positive"
          icon={TrendingUp}
          iconColor="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          title="Words Learned"
          value={analytics.wordsLearnedTotal.toLocaleString()}
          icon={Languages}
          iconColor="bg-purple-50 text-purple-600"
        />
        <StatCard
          title="Words Reviewed"
          value={analytics.wordsReviewedTotal.toLocaleString()}
          icon={RotateCcw}
          iconColor="bg-amber-50 text-amber-600"
        />
        <StatCard
          title="Tests Completed"
          value={analytics.testsCompletedTotal.toLocaleString()}
          icon={Award}
          iconColor="bg-teal-50 text-teal-600"
        />
        <StatCard
          title="Average Score"
          value={`${analytics.avgTestScore}%`}
          change="+1.8%"
          changeType="positive"
          icon={CheckCircle2}
          iconColor="bg-indigo-50 text-indigo-600"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Daily Learning Sessions & Test Attempts */}
        <Card>
          <CardHeader>
            <CardTitle>Learning Sessions & Test Attempts</CardTitle>
            <p className="text-xs text-slate-500">Volume distribution over selected timeframe</p>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityTrend7Days} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="sessions" fill="#2563eb" radius={[4, 4, 0, 0]} name="Sessions" />
                  <Bar dataKey="tests" fill="#93c5fd" radius={[4, 4, 0, 0]} name="Tests" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Chart 2: Words Memorized Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Vocabulary Memorization Velocity</CardTitle>
            <p className="text-xs text-slate-500">Total vocabulary words learned per day</p>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activityTrend7Days} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      fontSize: '12px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="words"
                    stroke="#16a34a"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#16a34a' }}
                    name="Words Memorized"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links to Detailed Analytics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <a
          href="/admin/analytics/vocabulary"
          className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 hover:border-blue-300 hover:shadow-xs transition-all"
        >
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Vocabulary Accuracy Analytics</h4>
            <p className="text-xs text-slate-500 mt-1">
              Inspect hardest words, error frequency, and words requiring review reinforcement.
            </p>
          </div>
          <Button variant="outline" size="sm" className="text-xs">
            Open
          </Button>
        </a>

        <a
          href="/admin/analytics/learning"
          className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 hover:border-blue-300 hover:shadow-xs transition-all"
        >
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Chapter Completion Analytics</h4>
            <p className="text-xs text-slate-500 mt-1">
              Curriculum progression funnels, drop-off rates, and chapter exam milestones.
            </p>
          </div>
          <Button variant="outline" size="sm" className="text-xs">
            Open
          </Button>
        </a>
      </div>
    </div>
  );
}
