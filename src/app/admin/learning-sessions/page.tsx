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
  Edit2,
  Sliders,
} from 'lucide-react';
import { PageHeader } from '@/components/admin/navigation/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FormDrawer } from '@/components/admin/drawers/FormDrawer';
import { useToast } from '@/components/ui/toast';
import { useAdminStore } from '@/lib/store';
import { LearningSessionConfig } from '@/types';

export default function LearningSessionsPage() {
  const { toast } = useToast();
  const {
    learningSessions,
    learningSequence,
    updateLearningSequence,
    updateLearningSession,
  } = useAdminStore();

  const [sequenceForm, setSequenceForm] = useState(learningSequence);
  const [isSequenceDrawerOpen, setIsSequenceDrawerOpen] = useState(false);

  // Selected session for right drawer editing
  const [selectedSession, setSelectedSession] = useState<LearningSessionConfig | null>(null);
  const [sessionForm, setSessionForm] = useState<Partial<LearningSessionConfig>>({});

  const handleOpenEditSession = (session: LearningSessionConfig) => {
    setSelectedSession(session);
    setSessionForm({
      newWordsCount: session.newWordsCount,
      previousWordsCount: session.previousWordsCount,
      durationMinutes: session.durationMinutes,
      cumulativeTestEnabled: session.cumulativeTestEnabled,
      reviewPreviousEnabled: session.reviewPreviousEnabled,
      status: session.status,
    });
  };

  const handleSaveSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSession) return;

    const totalWords = (sessionForm.newWordsCount || 0) + (sessionForm.previousWordsCount || 0);

    updateLearningSession(selectedSession.id, {
      ...sessionForm,
      totalWordsCount: totalWords,
    });

    toast({
      title: 'Session Configured',
      description: `Day ${selectedSession.dayNumber} parameters updated successfully.`,
      variant: 'success',
    });

    setSelectedSession(null);
  };

  const handleSaveSequence = (e: React.FormEvent) => {
    e.preventDefault();
    updateLearningSequence(sequenceForm);
    toast({
      title: 'Global Sequence Saved',
      description: 'Batch rules and daily targets synchronized with mobile clients.',
      variant: 'success',
    });
    setIsSequenceDrawerOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Learning Sessions & Sequence"
        description="Configure mobile app daily learning sessions, batch sizes (4 words), and cumulative review test logic."
        actions={
          <Button
            onClick={() => setIsSequenceDrawerOpen(true)}
            className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-xs"
          >
            <Sliders className="h-4 w-4" />
            Configure Sequence Rules
          </Button>
        }
      />

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
              <p className="mt-1 text-[11px] text-slate-500">Cumulative test across all batches</p>
            </div>

            <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 text-center">
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                Step 5
              </span>
              <p className="mt-1 font-bold text-slate-900 text-sm">Target Complete</p>
              <p className="mt-1 text-[11px] text-slate-500">Daily target reached: 20 words</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Sessions Breakdown Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle>Chapter 1 Daily Session Schedule</CardTitle>
            <p className="text-xs text-slate-500">
              Schedule matrix mapping each learning day to new vs previous vocabulary items.
            </p>
          </div>
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
                  <th className="px-4 py-3 text-right">Configure</th>
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
                      <Badge variant={session.cumulativeTestEnabled ? 'default' : 'secondary'} className="text-[10px]">
                        {session.cumulativeTestEnabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="default" className="capitalize text-[10px]">
                        {session.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenEditSession(session)}
                        className="text-xs text-blue-600 hover:text-blue-700 h-7"
                      >
                        <Edit2 className="h-3.5 w-3.5 mr-1" />
                        Configure
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ======================================================== */}
      {/* 1. EDIT SESSION CONFIGURATION RIGHT-SIDE DRAWER */}
      {/* ======================================================== */}
      {selectedSession && (
        <FormDrawer
          open={!!selectedSession}
          onOpenChange={(open) => !open && setSelectedSession(null)}
          title={`Configure Session: Day ${selectedSession.dayNumber}`}
          description="Adjust daily word distribution, duration limits, and cumulative testing."
          submitLabel="Save Session"
          onSubmit={handleSaveSession}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">New Words Count</label>
                <Input
                  type="number"
                  value={sessionForm.newWordsCount || 0}
                  onChange={(e) =>
                    setSessionForm({ ...sessionForm, newWordsCount: Number(e.target.value) })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Previous Words Count</label>
                <Input
                  type="number"
                  value={sessionForm.previousWordsCount || 0}
                  onChange={(e) =>
                    setSessionForm({ ...sessionForm, previousWordsCount: Number(e.target.value) })
                  }
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Duration (Minutes)</label>
              <Input
                type="number"
                value={sessionForm.durationMinutes || 0}
                onChange={(e) =>
                  setSessionForm({ ...sessionForm, durationMinutes: Number(e.target.value) })
                }
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-lg border border-slate-200 bg-slate-50">
              <div>
                <p className="text-xs font-semibold text-slate-800">Cumulative Test</p>
                <p className="text-[11px] text-slate-500">Require cumulative evaluation at end of session</p>
              </div>
              <Switch
                checked={sessionForm.cumulativeTestEnabled || false}
                onCheckedChange={(val) => setSessionForm({ ...sessionForm, cumulativeTestEnabled: val })}
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-lg border border-slate-200 bg-slate-50">
              <div>
                <p className="text-xs font-semibold text-slate-800">Review Previous Words</p>
                <p className="text-[11px] text-slate-500">Inject words from earlier days</p>
              </div>
              <Switch
                checked={sessionForm.reviewPreviousEnabled || false}
                onCheckedChange={(val) => setSessionForm({ ...sessionForm, reviewPreviousEnabled: val })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Session Status</label>
              <select
                value={sessionForm.status || 'active'}
                onChange={(e) => setSessionForm({ ...sessionForm, status: e.target.value as any })}
                className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-700"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </FormDrawer>
      )}

      {/* ======================================================== */}
      {/* 2. GLOBAL SEQUENCE RULES RIGHT-SIDE DRAWER */}
      {/* ======================================================== */}
      <FormDrawer
        open={isSequenceDrawerOpen}
        onOpenChange={setIsSequenceDrawerOpen}
        title="Learning Sequence Rules"
        description="Global learning cycle and batch sizes pushed to mobile devices."
        submitLabel="Save Sequence Rules"
        onSubmit={handleSaveSequence}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Words Per Batch</label>
            <Input
              type="number"
              value={sequenceForm.wordsPerBatch}
              onChange={(e) =>
                setSequenceForm({ ...sequenceForm, wordsPerBatch: Number(e.target.value) })
              }
            />
            <p className="mt-1 text-[11px] text-slate-400">Default: 4 words per flashcard batch</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Daily Word Target</label>
            <Input
              type="number"
              value={sequenceForm.dailyTarget}
              onChange={(e) =>
                setSequenceForm({ ...sequenceForm, dailyTarget: Number(e.target.value) })
              }
            />
            <p className="mt-1 text-[11px] text-slate-400">Default: 20 words per day quota</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Learning Time (Minutes)</label>
            <Input
              type="number"
              value={sequenceForm.learningTimeMinutes}
              onChange={(e) =>
                setSequenceForm({ ...sequenceForm, learningTimeMinutes: Number(e.target.value) })
              }
            />
            <p className="mt-1 text-[11px] text-slate-400">Default: 3 minutes per batch</p>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-lg border border-slate-200 bg-slate-50">
            <div>
              <p className="text-xs font-semibold text-slate-800">Randomize Questions</p>
              <p className="text-[11px] text-slate-500">Prevent positional memorization</p>
            </div>
            <Switch
              checked={sequenceForm.randomizeQuestions}
              onCheckedChange={(val) => setSequenceForm({ ...sequenceForm, randomizeQuestions: val })}
            />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-lg border border-slate-200 bg-slate-50">
            <div>
              <p className="text-xs font-semibold text-slate-800">Cumulative Testing</p>
              <p className="text-[11px] text-slate-500">Test cumulative vocabulary after Step 3</p>
            </div>
            <Switch
              checked={sequenceForm.cumulativeTestEnabled}
              onCheckedChange={(val) => setSequenceForm({ ...sequenceForm, cumulativeTestEnabled: val })}
            />
          </div>
        </div>
      </FormDrawer>
    </div>
  );
}
