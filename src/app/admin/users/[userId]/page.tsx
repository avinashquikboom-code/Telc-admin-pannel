'use client';

import React, { use, useState } from 'react';
import Link from 'next/navigation';
import {
  User,
  BookOpen,
  Calendar,
  Languages,
  ArrowLeft,
  RotateCcw,
  CheckCircle,
  Clock,
  Award,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { PageHeader } from '@/components/admin/navigation/PageHeader';
import { StatCard } from '@/components/admin/cards/StatCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ConfirmDialog } from '@/components/ui/dialog';
import { useAdminStore } from '@/lib/store';
import { initialLearnerHistory } from '@/lib/mockData';
import { formatDate, formatTimeAgo } from '@/lib/utils';

export default function LearnerDetailPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const resolvedParams = use(params);
  const { userId } = resolvedParams;
  const { learners, resetLearnerProgress } = useAdminStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [showResetModal, setShowResetModal] = useState(false);

  const learner = learners.find((l) => l.id === userId) || learners[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <a href="/admin/users" className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Learners
        </a>
      </div>

      <PageHeader
        title={learner.name}
        description={`Registered Learner (${learner.email})`}
        badge={
          <Badge variant={learner.status === 'active' ? 'success' : 'destructive'} className="capitalize">
            {learner.status}
          </Badge>
        }
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowResetModal(true)}
            className="gap-1.5 text-xs text-red-600 border-red-200 hover:bg-red-50"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset Learning Progress
          </Button>
        }
      />

      {/* Progress Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <StatCard
          title="Overall Progress"
          value={`${learner.progressPercentage}%`}
          icon={TrendingUp}
          iconColor="bg-blue-50 text-blue-600"
        />
        <StatCard
          title="Words Learned"
          value={learner.wordsLearned}
          icon={Languages}
          iconColor="bg-purple-50 text-purple-600"
        />
        <StatCard
          title="Words Reviewed"
          value={learner.wordsReviewed}
          icon={RotateCcw}
          iconColor="bg-amber-50 text-amber-600"
        />
        <StatCard
          title="Tests Completed"
          value={learner.testsCompleted}
          icon={Award}
          iconColor="bg-teal-50 text-teal-600"
        />
        <StatCard
          title="Average Score"
          value={`${learner.averageScore}%`}
          icon={CheckCircle}
          iconColor="bg-emerald-50 text-emerald-600"
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="history">Learning History</TabsTrigger>
          <TabsTrigger value="vocabulary">Vocabulary Words</TabsTrigger>
          <TabsTrigger value="tests">Assessment Tests</TabsTrigger>
          <TabsTrigger value="reviews">Review Logs</TabsTrigger>
        </TabsList>

        {/* Tab 1: Overview Profile */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Learner Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <img
                    src={learner.avatarUrl}
                    alt={learner.name}
                    className="h-12 w-12 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{learner.name}</p>
                    <p className="text-slate-500">{learner.email}</p>
                  </div>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Native / UI Language</span>
                  <span className="font-semibold text-slate-800">English (US)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Enrollment Date</span>
                  <span className="font-semibold text-slate-800">{formatDate(learner.joinedDate)}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500">Last Active Session</span>
                  <span className="font-semibold text-slate-800">{formatTimeAgo(learner.lastActive)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Curriculum Position</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Enrolled Course</span>
                  <span className="font-bold text-blue-600">{learner.courseName}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Current Chapter</span>
                  <span className="font-semibold text-slate-800">{learner.chapterName}</span>
                </div>
                <div>
                  <div className="flex justify-between font-semibold text-slate-700 mb-1">
                    <span>Course Completion</span>
                    <span>{learner.progressPercentage}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${learner.progressPercentage}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 2: Learning History Timeline */}
        <TabsContent value="history" className="space-y-3">
          <Card>
            <CardHeader>
              <CardTitle>Daily Learning Timeline</CardTitle>
              <p className="text-xs text-slate-500">
                Log of completed 20-word sessions and test milestones
              </p>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-y border-slate-200 bg-slate-50 text-slate-500 font-semibold">
                    <tr>
                      <th className="px-4 py-3">Day</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">New Words</th>
                      <th className="px-4 py-3">Reviewed</th>
                      <th className="px-4 py-3">Test Score</th>
                      <th className="px-4 py-3">Duration</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {initialLearnerHistory.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3 font-bold text-slate-900">Day {item.dayNumber}</td>
                        <td className="px-4 py-3 text-slate-600">{item.date}</td>
                        <td className="px-4 py-3 text-blue-600 font-semibold">
                          +{item.newWordsLearned} words
                        </td>
                        <td className="px-4 py-3 text-amber-600 font-semibold">
                          {item.wordsReviewed} words
                        </td>
                        <td className="px-4 py-3 font-bold text-emerald-600">{item.testScore}%</td>
                        <td className="px-4 py-3 text-slate-500">{item.timeSpentMinutes} mins</td>
                        <td className="px-4 py-3">
                          <Badge variant="success" className="text-[10px] capitalize">
                            {item.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Vocabulary */}
        <TabsContent value="vocabulary" className="space-y-3">
          <Card>
            <CardHeader>
              <CardTitle>Mastered Vocabulary Words</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-600">
                {learner.name} has learned <strong>{learner.wordsLearned}</strong> total vocabulary words
                with an average quiz retention accuracy of <strong>{learner.averageScore}%</strong>.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Tests */}
        <TabsContent value="tests" className="space-y-3">
          <Card>
            <CardHeader>
              <CardTitle>Completed Assessment Tests ({learner.testsCompleted})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="font-semibold text-slate-800">Chapter 1 Vocabulary Test</span>
                  <span className="font-bold text-emerald-600">Score: 95%</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="font-semibold text-slate-800">Days 1-4 Cumulative Test</span>
                  <span className="font-bold text-emerald-600">Score: 88%</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="font-semibold text-slate-800">Chapter 2 Vocabulary Test</span>
                  <span className="font-bold text-emerald-600">Score: 92%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 5: Reviews */}
        <TabsContent value="reviews" className="space-y-3">
          <Card>
            <CardHeader>
              <CardTitle>Spaced Repetition Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-600">
                Total review sessions completed: <strong>{learner.wordsReviewed / 10}</strong> sessions.
                Learner has maintained a streak of reviewing previous words every learning session.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Confirmation modal for Reset Progress */}
      <ConfirmDialog
        open={showResetModal}
        onOpenChange={setShowResetModal}
        title="Reset Learner Progress?"
        description={`"This will remove the learner's learning progress." Are you sure you want to reset all progress for ${learner.name}?`}
        confirmText="Reset Progress"
        variant="destructive"
        onConfirm={() => {
          resetLearnerProgress(learner.id);
          setShowResetModal(false);
        }}
      />
    </div>
  );
}
