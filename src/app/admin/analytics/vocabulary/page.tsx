'use client';

import React, { useState } from 'react';
import {
  Languages,
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  RotateCcw,
  TrendingDown,
  ArrowUpDown,
} from 'lucide-react';
import { PageHeader } from '@/components/admin/navigation/PageHeader';
import { StatCard } from '@/components/admin/cards/StatCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAdminStore } from '@/lib/store';

export default function VocabularyAnalyticsPage() {
  const { vocabulary } = useAdminStore();
  const [sortKey, setSortKey] = useState<'accuracy' | 'incorrectAnswers' | 'reviewCount'>('accuracy');
  const [sortAsc, setSortAsc] = useState(true);

  // Sorting
  const sortedWords = [...vocabulary].sort((a, b) => {
    const valA = a[sortKey];
    const valB = b[sortKey];
    return sortAsc ? valA - valB : valB - valA;
  });

  const hardestWords = [...vocabulary].sort((a, b) => a.accuracy - b.accuracy).slice(0, 3);
  const mostReviewedWords = [...vocabulary].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <a href="/admin/analytics" className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Analytics
        </a>
      </div>

      <PageHeader
        title="Vocabulary Analytics"
        description="Identify high-friction German vocabulary words, frequent incorrect translation submissions, and review frequency."
      />

      {/* Highlights: Hardest vs Most Reviewed Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Most Difficult Words */}
        <Card className="border-red-200 bg-red-50/20">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-red-900 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                Most Challenging Words (Lowest Accuracy)
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {hardestWords.map((w) => (
              <div
                key={w.id}
                className="flex items-center justify-between p-2.5 rounded-lg border border-red-100 bg-white"
              >
                <div>
                  <p className="font-bold text-slate-900 text-xs">{w.german}</p>
                  <p className="text-[11px] text-slate-500">{w.english}</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-red-600 text-xs">{w.accuracy}%</span>
                  <p className="text-[10px] text-slate-400">{w.incorrectAnswers} incorrect</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Most Reviewed Words */}
        <Card className="border-blue-200 bg-blue-50/20">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-blue-900 flex items-center gap-2">
                <RotateCcw className="h-4 w-4 text-blue-600" />
                Most Frequently Reviewed Words
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {mostReviewedWords.map((w) => (
              <div
                key={w.id}
                className="flex items-center justify-between p-2.5 rounded-lg border border-blue-100 bg-white"
              >
                <div>
                  <p className="font-bold text-slate-900 text-xs">{w.german}</p>
                  <p className="text-[11px] text-slate-500">{w.english}</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-blue-600 text-xs">{w.reviewCount} reviews</span>
                  <p className="text-[10px] text-slate-400">{w.accuracy}% retention</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Main Vocabulary Analytics Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle>Vocabulary Performance Matrix</CardTitle>
            <p className="text-xs text-slate-500">
              Sort by accuracy, incorrect answers, or review count to optimize curriculum definitions
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSortKey('accuracy');
                setSortAsc(!sortAsc);
              }}
              className="text-xs gap-1"
            >
              <ArrowUpDown className="h-3 w-3" />
              Sort by Accuracy
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSortKey('reviewCount');
                setSortAsc(!sortAsc);
              }}
              className="text-xs gap-1"
            >
              <ArrowUpDown className="h-3 w-3" />
              Sort by Review Count
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-y border-slate-200 bg-slate-50 text-slate-500 font-semibold">
                <tr>
                  <th className="px-4 py-3">German Word</th>
                  <th className="px-4 py-3">Translation</th>
                  <th className="px-4 py-3">Chapter</th>
                  <th className="px-4 py-3">Total Attempts</th>
                  <th className="px-4 py-3">Correct</th>
                  <th className="px-4 py-3">Incorrect</th>
                  <th className="px-4 py-3">Accuracy</th>
                  <th className="px-4 py-3">Review Count</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedWords.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-bold text-slate-900">{w.german}</td>
                    <td className="px-4 py-3 text-slate-700">{w.english}</td>
                    <td className="px-4 py-3 text-slate-500">{w.chapterTitle}</td>
                    <td className="px-4 py-3 font-semibold text-slate-800">
                      {w.timesTested.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-emerald-600 font-semibold">
                      {w.correctAnswers.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-red-600 font-semibold">
                      {w.incorrectAnswers.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <div className="h-1.5 w-12 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              w.accuracy >= 85 ? 'bg-emerald-500' : w.accuracy >= 70 ? 'bg-blue-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${w.accuracy}%` }}
                          />
                        </div>
                        <span className="font-bold text-slate-800">{w.accuracy}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-700">
                      {w.reviewCount} reviews
                    </td>
                    <td className="px-4 py-3 text-right">
                      <a href={`/admin/vocabulary/${w.id}`}>
                        <Button variant="ghost" size="sm" className="h-7 text-xs text-blue-600">
                          Inspect
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
