'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  BookOpen,
  Layers,
  Languages,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Clock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { PageHeader } from '@/components/admin/navigation/PageHeader';
import { StatCard } from '@/components/admin/cards/StatCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAdminStore } from '@/lib/store';
import { activityTrend7Days } from '@/lib/mockData';
import { formatTimeAgo } from '@/lib/utils';
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

export default function DashboardPage() {
  const { analytics, courses, learners } = useAdminStore();
  const [timeRange, setTimeRange] = useState<'7' | '30'>('7');

  const chartData = activityTrend7Days;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <PageHeader
        title="Dashboard"
        description="TELC Mastery overview and learning activity across all active curricula."
        actions={
          <div className="flex items-center gap-2">
            <a href="/admin/courses/new">
              <Button size="sm" className="gap-1.5 bg-blue-600 hover:bg-blue-700">
                <BookOpen className="h-4 w-4" />
                + Create Course
              </Button>
            </a>
            <a href="/admin/vocabulary/new">
              <Button size="sm" variant="outline" className="gap-1.5">
                <Languages className="h-4 w-4" />
                + Add Vocabulary
              </Button>
            </a>
          </div>
        }
      />

      {/* Row 1: Primary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <StatCard
          title="Total Learners"
          value={analytics.totalLearners.toLocaleString()}
          change="+12.5%"
          changeType="positive"
          icon={Users}
          iconColor="bg-blue-50 text-blue-600"
        />
        <StatCard
          title="Active Learners"
          value={analytics.activeLearners.toLocaleString()}
          change="+8.2%"
          changeType="positive"
          icon={TrendingUp}
          iconColor="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          title="Total Courses"
          value={courses.length}
          icon={BookOpen}
          iconColor="bg-purple-50 text-purple-600"
        />
        <StatCard
          title="Total Chapters"
          value={analytics.totalChapters}
          icon={Layers}
          iconColor="bg-amber-50 text-amber-600"
        />
        <StatCard
          title="Total Vocabulary"
          value={analytics.totalVocabulary}
          icon={Languages}
          iconColor="bg-indigo-50 text-indigo-600"
        />
        <StatCard
          title="Completed Sessions"
          value={analytics.completedSessions.toLocaleString()}
          icon={CheckCircle2}
          iconColor="bg-teal-50 text-teal-600"
        />
      </div>

      {/* Row 2: Secondary Operational Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Learning Sessions</span>
            <Calendar className="h-4 w-4 text-blue-500" />
          </div>
          <p className="mt-2 text-xl font-bold text-slate-900">12,480</p>
          <p className="mt-1 text-[11px] text-slate-400">Total sessions initiated all-time</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Today&apos;s Sessions</span>
            <Clock className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="mt-2 text-xl font-bold text-slate-900">{analytics.sessionsToday}</p>
          <p className="mt-1 text-[11px] text-emerald-600 font-semibold">+14% vs yesterday</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Daily Word Target</span>
            <Sparkles className="h-4 w-4 text-amber-500" />
          </div>
          <p className="mt-2 text-xl font-bold text-slate-900">20 words/day</p>
          <p className="mt-1 text-[11px] text-slate-400">Standard 4-word batching cycle</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Average Completion</span>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </div>
          <p className="mt-2 text-xl font-bold text-slate-900">{analytics.avgCompletionRate}%</p>
          <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full"
              style={{ width: `${analytics.avgCompletionRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Row 3: Activity Chart & Course Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Learning Activity Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Learning Activity</CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                Daily learning sessions and vocabulary words memorized
              </p>
            </div>
            <div className="flex items-center rounded-lg border border-slate-200 p-0.5 bg-slate-50">
              <button
                onClick={() => setTimeRange('7')}
                className={`rounded px-2.5 py-1 text-xs font-medium cursor-pointer transition-colors ${
                  timeRange === '7' ? 'bg-white shadow-xs text-blue-700 font-semibold' : 'text-slate-600'
                }`}
              >
                Last 7 Days
              </button>
              <button
                onClick={() => setTimeRange('30')}
                className={`rounded px-2.5 py-1 text-xs font-medium cursor-pointer transition-colors ${
                  timeRange === '30' ? 'bg-white shadow-xs text-blue-700 font-semibold' : 'text-slate-600'
                }`}
              >
                Last 30 Days
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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

        {/* Right 1 Col: Course Progress */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Course Progress</CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">Active curriculum completion</p>
            </div>
            <a href="/admin/courses" className="text-xs font-medium text-blue-600 hover:underline">
              View All
            </a>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            {courses.map((course) => (
              <div key={course.id} className="space-y-1.5 pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="text-[10px] px-1.5 py-0">
                      {course.level}
                    </Badge>
                    <span className="text-xs font-semibold text-slate-900">{course.title}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-700">{course.completionRate}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${course.completionRate}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>{course.learnersCount} learners</span>
                  <span className="capitalize text-emerald-600 font-medium">{course.status}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Row 4: Recent Learners Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle>Recent Learners</CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">
              Latest learner activity, chapter progress, and session scores
            </p>
          </div>
          <a href="/admin/users">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              View All Learners
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </a>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-y border-slate-200 bg-slate-50/80 text-slate-500 font-medium">
                <tr>
                  <th className="px-4 py-3">Learner</th>
                  <th className="px-4 py-3">Course & Chapter</th>
                  <th className="px-4 py-3">Progress</th>
                  <th className="px-4 py-3">Words Learned</th>
                  <th className="px-4 py-3">Last Active</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {learners.slice(0, 5).map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={l.avatarUrl}
                          alt={l.name}
                          className="h-7 w-7 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <p className="font-semibold text-slate-900">{l.name}</p>
                          <p className="text-[11px] text-slate-400">{l.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-800">{l.courseName}</p>
                      <p className="text-[11px] text-slate-500">{l.chapterName}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full bg-blue-600 rounded-full"
                            style={{ width: `${l.progressPercentage}%` }}
                          />
                        </div>
                        <span className="font-semibold text-slate-700">{l.progressPercentage}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-700 font-medium">
                      {l.wordsLearned} words
                    </td>
                    <td className="px-4 py-3 text-slate-500">{formatTimeAgo(l.lastActive)}</td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          l.status === 'active'
                            ? 'success'
                            : l.status === 'suspended'
                            ? 'destructive'
                            : 'secondary'
                        }
                        className="text-[10px] capitalize font-medium"
                      >
                        {l.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <a href={`/admin/users/${l.id}`}>
                        <Button variant="ghost" size="sm" className="h-7 text-xs text-blue-600 hover:text-blue-800">
                          View
                        </Button>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
