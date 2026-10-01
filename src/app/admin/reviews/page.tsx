'use client';

import React, { useState } from 'react';
import {
  RefreshCw,
  Sliders,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  ArrowRight,
  Shuffle,
  Save,
} from 'lucide-react';
import { PageHeader } from '@/components/admin/navigation/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAdminStore } from '@/lib/store';

export default function ReviewsPage() {
  const { reviewSettings, updateReviewSettings } = useAdminStore();
  const [form, setForm] = useState(reviewSettings);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateReviewSettings(form);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Review Sessions"
        description="Configure spaced repetition, previous word inclusion rules, and review session automation for TELC Mastery learners."
        actions={
          <div className="flex items-center gap-2">
            <a href="/admin/review-settings">
              <Button variant="outline" className="gap-1.5 text-xs">
                <Sliders className="h-3.5 w-3.5" />
                Global Rules
              </Button>
            </a>
            <Button onClick={handleSave} className="gap-1.5 bg-blue-600 hover:bg-blue-700">
              <Save className="h-4 w-4" />
              Save Review Rules
            </Button>
          </div>
        }
      />

      {isSaved && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          Review session parameters saved and active across active chapters!
        </div>
      )}

      {/* Review Mechanics Card */}
      <Card>
        <CardHeader>
          <CardTitle>Spaced Repetition & Daily Previous Word Injection</CardTitle>
          <p className="text-xs text-slate-500">
            How previous vocabulary words are pulled into daily sessions starting from Day 2
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-200 p-4 space-y-3 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Review Previous Words</h4>
                  <p className="text-[11px] text-slate-500">Inject words from earlier days in chapter</p>
                </div>
                <Switch
                  checked={form.reviewPreviousWords}
                  onCheckedChange={(checked) => setForm({ ...form, reviewPreviousWords: checked })}
                />
              </div>

              <div className="pt-2 border-t border-slate-100">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Selection Strategy
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, selectionStrategy: 'Automatic' })}
                    className={`rounded-lg border p-2 text-left text-xs transition-colors cursor-pointer ${
                      form.selectionStrategy === 'Automatic'
                        ? 'border-blue-600 bg-blue-50 text-blue-800 font-bold'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    <span>Automatic</span>
                    <p className="text-[10px] text-slate-500 font-normal">
                      Picks lowest accuracy & oldest words
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setForm({ ...form, selectionStrategy: 'Manual' })}
                    className={`rounded-lg border p-2 text-left text-xs transition-colors cursor-pointer ${
                      form.selectionStrategy === 'Manual'
                        ? 'border-blue-600 bg-blue-50 text-blue-800 font-bold'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    <span>Manual</span>
                    <p className="text-[10px] text-slate-500 font-normal">
                      Curated priority lists
                    </p>
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 p-4 space-y-3 bg-white">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Maximum Previous Words Per Session
                </label>
                <Input
                  type="number"
                  value={form.maxPreviousWords}
                  onChange={(e) => setForm({ ...form, maxPreviousWords: Number(e.target.value) })}
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  Standard TELC recommendation: 10 words (Total session: 20 new + 10 previous = 30)
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Review Randomization</h4>
                  <p className="text-[11px] text-slate-500">Shuffle previous word card presentation</p>
                </div>
                <Switch
                  checked={form.randomOrder}
                  onCheckedChange={(checked) => setForm({ ...form, randomOrder: checked })}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
