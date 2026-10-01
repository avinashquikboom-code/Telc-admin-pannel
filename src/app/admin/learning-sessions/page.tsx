'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Layers,
  Sparkles,
  ArrowRight,
  Save,
  CheckCircle2,
  Clock,
  Shuffle,
  RefreshCw,
} from 'lucide-react';
import { PageHeader } from '@/components/admin/navigation/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAdminStore } from '@/lib/store';

export default function LearningSessionsPage() {
  const {
    learningSessions,
    learningSequence,
    updateLearningSequence,
    updateLearningSession,
  } = useAdminStore();

  const [sequenceForm, setSequenceForm] = useState(learningSequence);
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveSequence = (e: React.FormEvent) => {
    e.preventDefault();
    updateLearningSequence(sequenceForm);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Learning Sessions & Sequence"
        description="Configure mobile app daily learning sessions, batch sizes (4 words), and cumulative review test logic."
        actions={
          <Button onClick={handleSaveSequence} className="gap-1.5 bg-blue-600 hover:bg-blue-700">
            <Save className="h-4 w-4" />
            Save Configuration
          </Button>
        }
      />

      {isSaved && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          Learning sequence parameters synchronized to mobile application API!
        </div>
      )}

      {/* Interactive Mobile Learning Cycle Flow Diagram */}
      <Card>
        <CardHeader>
          <CardTitle>TELC Mastery Active Learning Cycle</CardTitle>
          <p className="text-xs text-slate-500">
            This flow governs how the mobile application presents cards and tests to learners each day.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 relative">
            <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4 text-center">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                Step 1
              </span>
              <p className="mt-1 font-bold text-slate-900 text-sm">
                Learn {sequenceForm.wordsPerBatch} Words
              </p>
              <p className="mt-1 text-[11px] text-slate-500">Flashcards with audio and articles</p>
            </div>

            <div className="rounded-xl border border-purple-200 bg-purple-50/70 p-4 text-center">
              <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">
                Step 2
              </span>
              <p className="mt-1 font-bold text-slate-900 text-sm">Translation Test</p>
              <p className="mt-1 text-[11px] text-slate-500">Recall test on current 4 words</p>
            </div>

            <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4 text-center">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                Step 3
              </span>
              <p className="mt-1 font-bold text-slate-900 text-sm">
                + {sequenceForm.wordsPerBatch} New Words
              </p>
              <p className="mt-1 text-[11px] text-slate-500">Second batch of flashcards</p>
            </div>

            <div className="rounded-xl border border-teal-200 bg-teal-50/70 p-4 text-center">
              <span className="text-[10px] font-bold text-teal-600 uppercase tracking-wider">
                Step 4
              </span>
              <p className="mt-1 font-bold text-slate-900 text-sm">Cumulative Test</p>
              <p className="mt-1 text-[11px] text-slate-500">Tests all learned words so far</p>
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-center">
              <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">
                Step 5
              </span>
              <p className="mt-1 font-bold text-slate-900 text-sm">
                Repeat &rarr; {sequenceForm.dailyTarget} Target
              </p>
              <p className="mt-1 text-[11px] text-slate-500">Concludes daily quota</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Admin Sequence Control Form */}
      <Card>
        <CardHeader>
          <CardTitle>Sequence Parameters</CardTitle>
          <p className="text-xs text-slate-500">
            Control the word batches and timing sent to client devices.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Words Per Learning Batch
              </label>
              <Input
                type="number"
                value={sequenceForm.wordsPerBatch}
                onChange={(e) =>
                  setSequenceForm({ ...sequenceForm, wordsPerBatch: Number(e.target.value) })
                }
              />
              <p className="mt-1 text-[11px] text-slate-400">Default: 4 words</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Daily Word Target
              </label>
              <Input
                type="number"
                value={sequenceForm.dailyTarget}
                onChange={(e) =>
                  setSequenceForm({ ...sequenceForm, dailyTarget: Number(e.target.value) })
                }
              />
              <p className="mt-1 text-[11px] text-slate-400">Default: 20 words</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Estimated Duration (Minutes)
              </label>
              <Input
                type="number"
                value={sequenceForm.learningTimeMinutes}
                onChange={(e) =>
                  setSequenceForm({ ...sequenceForm, learningTimeMinutes: Number(e.target.value) })
                }
              />
              <p className="mt-1 text-[11px] text-slate-400">Default: 3 minutes</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/50 p-3.5">
              <div>
                <p className="text-xs font-semibold text-slate-800">Randomize Test Questions</p>
                <p className="text-[11px] text-slate-500">
                  Prevents positional memorization during tests
                </p>
              </div>
              <Switch
                checked={sequenceForm.randomizeQuestions}
                onCheckedChange={(checked) =>
                  setSequenceForm({ ...sequenceForm, randomizeQuestions: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/50 p-3.5">
              <div>
                <p className="text-xs font-semibold text-slate-800">Cumulative Testing</p>
                <p className="text-[11px] text-slate-500">
                  Tests previous batches together after Step 3
                </p>
              </div>
              <Switch
                checked={sequenceForm.cumulativeTestEnabled}
                onCheckedChange={(checked) =>
                  setSequenceForm({ ...sequenceForm, cumulativeTestEnabled: checked })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Sessions Breakdown Table */}
      <Card>
        <CardHeader>
          <CardTitle>Chapter 1 Daily Session Schedule</CardTitle>
          <p className="text-xs text-slate-500">
            Schedule matrix mapping each learning day to new vs previous vocabulary items
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-y border-slate-200 bg-slate-50 text-slate-500 font-semibold">
                <tr>
                  <th className="px-4 py-3">Day</th>
                  <th className="px-4 py-3">New Vocabulary</th>
                  <th className="px-4 py-3">Previous Words (Review)</th>
                  <th className="px-4 py-3">Total Words</th>
                  <th className="px-4 py-3">Duration</th>
                  <th className="px-4 py-3">Cumulative Test</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {learningSessions.map((session) => (
                  <tr key={session.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-bold text-slate-900">Day {session.dayNumber}</td>
                    <td className="px-4 py-3 text-blue-600 font-semibold">
                      {session.newWordsCount} New
                    </td>
                    <td className="px-4 py-3 text-amber-600 font-semibold">
                      {session.previousWordsCount} Previous
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-800">
                      {session.totalWordsCount} Total
                    </td>
                    <td className="px-4 py-3 text-slate-600">{session.durationMinutes} mins</td>
                    <td className="px-4 py-3">
                      <Badge variant={session.cumulativeTestEnabled ? 'success' : 'secondary'}>
                        {session.cumulativeTestEnabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="default" className="capitalize text-[10px]">
                        {session.status}
                      </Badge>
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
