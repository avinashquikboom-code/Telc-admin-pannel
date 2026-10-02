'use client';

import React, { useState } from 'react';
import {
  AlertTriangle,
  Save,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import { PageHeader } from '@/components/admin/navigation/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAdminStore } from '@/lib/store';
import { useToast } from '@/components/ui/toast';

export default function ReviewSettingsPage() {
  const { toast } = useToast();
  const { reviewSettings, updateReviewSettings } = useAdminStore();
  const [form, setForm] = useState(reviewSettings);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateReviewSettings(form);
    setSavedNotice(true);
    toast({
      title: 'Review Settings Saved',
      description: 'Global spaced repetition parameters saved & broadcast to clients.',
      variant: 'success',
    });
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handleResetDefaults = () => {
    const defaults = {
      reviewPreviousWords: true,
      selectionStrategy: 'Automatic' as const,
      maxPreviousWords: 10,
      reviewFrequency: 'Daily' as const,
      randomOrder: true,
      chapterReview: true,
      overallReview: true,
      newWordsPerDay: 20,
    };
    setForm(defaults);
    updateReviewSettings(defaults);
    toast({
      title: 'Defaults Restored',
      description: 'Review settings reset to standard TELC curriculum defaults.',
      variant: 'default',
    });
  };

  return (
    <div className="w-full space-y-5 sm:space-y-6">
      <PageHeader
        title="Review Settings"
        description="Global algorithm parameters governing spaced vocabulary review, chapter wrap-up sessions, and mobile learning targets."
        actions={
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleResetDefaults}
              className="w-full sm:w-auto gap-1.5 text-xs justify-center cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset Defaults
            </Button>
            <Button
              onClick={handleSave}
              className="w-full sm:w-auto gap-1.5 bg-blue-600 hover:bg-blue-700 text-white justify-center cursor-pointer"
            >
              <Save className="h-4 w-4" />
              Save Settings
            </Button>
          </div>
        }
      />

      {/* Warning banner: Stacks cleanly on mobile, horizontal on desktop */}
      <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 w-full">
        <div className="flex flex-col sm:flex-row gap-3 items-start">
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 sm:mt-0.5" />
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-amber-900">Important System Notice</h4>
            <p className="mt-1 text-xs text-amber-800 leading-relaxed">
              &quot;These changes will affect new learning sessions.&quot; Ongoing daily sessions initiated today
              will complete their current quota before applying these updated thresholds tomorrow.
            </p>
          </div>
        </div>
      </div>

      {savedNotice && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span className="min-w-0 flex-1">Global review settings updated successfully and broadcast to mobile clients!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-5 sm:space-y-6">
        <Card>
          <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-3">
            <CardTitle className="text-base sm:text-lg">Daily Quota & Review Allocations</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="w-full min-w-0">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  New Words Per Day
                </label>
                <Input
                  type="number"
                  className="w-full min-w-0"
                  value={form.newWordsPerDay}
                  onChange={(e) => setForm({ ...form, newWordsPerDay: Number(e.target.value) })}
                />
                <p className="mt-1 text-[11px] text-slate-400">Default: 20 words</p>
              </div>

              <div className="w-full min-w-0">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Previous Words Per Day
                </label>
                <Input
                  type="number"
                  className="w-full min-w-0"
                  value={form.maxPreviousWords}
                  onChange={(e) => setForm({ ...form, maxPreviousWords: Number(e.target.value) })}
                />
                <p className="mt-1 text-[11px] text-slate-400">Default: 10 words</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Global Review Stage Toggles */}
        <Card>
          <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-3">
            <CardTitle className="text-base sm:text-lg">Review Stage Toggles</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 space-y-3">
            <div className="flex items-start justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50/50 p-3.5 sm:p-4">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-semibold text-slate-800">Review Previous Vocabulary</p>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Activates daily previous word integration into learning sessions
                </p>
              </div>
              <Switch
                className="shrink-0 mt-0.5"
                checked={form.reviewPreviousWords}
                onCheckedChange={(checked) => setForm({ ...form, reviewPreviousWords: checked })}
              />
            </div>

            <div className="flex items-start justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50/50 p-3.5 sm:p-4">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-semibold text-slate-800">Random Order</p>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Randomize sequence when reviewing previous vocabulary
                </p>
              </div>
              <Switch
                className="shrink-0 mt-0.5"
                checked={form.randomOrder}
                onCheckedChange={(checked) => setForm({ ...form, randomOrder: checked })}
              />
            </div>

            <div className="flex items-start justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50/50 p-3.5 sm:p-4">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-semibold text-slate-800">Chapter Review Stage</p>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Trigger full 140-word randomized review at conclusion of Day 7
                </p>
              </div>
              <Switch
                className="shrink-0 mt-0.5"
                checked={form.chapterReview}
                onCheckedChange={(checked) => setForm({ ...form, chapterReview: checked })}
              />
            </div>

            <div className="flex items-start justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50/50 p-3.5 sm:p-4">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-semibold text-slate-800">Overall Review Stage</p>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Enable multi-chapter curriculum review exams
                </p>
              </div>
              <Switch
                className="shrink-0 mt-0.5"
                checked={form.overallReview}
                onCheckedChange={(checked) => setForm({ ...form, overallReview: checked })}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row justify-end pt-2">
          <Button
            type="submit"
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white justify-center cursor-pointer"
          >
            <Save className="mr-1.5 h-4 w-4" />
            Save Global Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
