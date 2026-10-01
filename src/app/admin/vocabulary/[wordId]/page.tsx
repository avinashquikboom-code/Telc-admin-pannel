'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Languages,
  Volume2,
  ArrowLeft,
  CheckCircle,
  XCircle,
  TrendingUp,
  RotateCcw,
  BookOpen,
  Trash2,
  Save,
} from 'lucide-react';
import { PageHeader } from '@/components/admin/navigation/PageHeader';
import { StatCard } from '@/components/admin/cards/StatCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ConfirmDialog } from '@/components/ui/dialog';
import { useAdminStore } from '@/lib/store';

export default function VocabularyDetailPage({
  params,
}: {
  params: Promise<{ wordId: string }>;
}) {
  const resolvedParams = use(params);
  const { wordId } = resolvedParams;
  const router = useRouter();
  const { vocabulary, chapters, updateVocabulary, deleteVocabulary } = useAdminStore();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const word = vocabulary.find((v) => v.id === wordId) || vocabulary[0];

  const [formData, setFormData] = useState({
    german: word.german,
    english: word.english,
    article: word.article,
    partOfSpeech: word.partOfSpeech,
    difficulty: word.difficulty,
    exampleGerman: word.exampleGerman,
    exampleEnglish: word.exampleEnglish,
  });

  const playAudio = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word.german);
      utterance.lang = 'de-DE';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    } else {
      alert(`Audio playing for: ${word.german}`);
    }
  };

  const handleSave = () => {
    updateVocabulary(word.id, formData);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <a href="/admin/vocabulary" className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Vocabulary
        </a>
      </div>

      <PageHeader
        title={word.german}
        description={`Translation: ${word.english}`}
        badge={
          <div className="flex items-center gap-2">
            {word.article !== 'none' && (
              <Badge variant="default" className="font-mono text-xs">
                {word.article}
              </Badge>
            )}
            <Badge variant="secondary">{word.partOfSpeech}</Badge>
            <Badge
              variant={
                word.difficulty === 'Easy'
                  ? 'success'
                  : word.difficulty === 'Medium'
                  ? 'warning'
                  : 'destructive'
              }
            >
              {word.difficulty}
            </Badge>
          </div>
        }
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={playAudio} className="gap-1.5 text-xs text-blue-600">
              <Volume2 className="h-3.5 w-3.5" />
              Listen Audio
            </Button>
            <Button
              variant={isEditing ? 'default' : 'outline'}
              size="sm"
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              className={isEditing ? 'bg-blue-600 hover:bg-blue-700' : ''}
            >
              {isEditing ? (
                <>
                  <Save className="mr-1 h-3.5 w-3.5" />
                  Save Changes
                </>
              ) : (
                'Edit Word'
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDeleteModal(true)}
              className="text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        }
      />

      {/* Learning Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <StatCard
          title="Times Learned"
          value={word.timesLearned.toLocaleString()}
          icon={Languages}
          iconColor="bg-blue-50 text-blue-600"
        />
        <StatCard
          title="Times Tested"
          value={word.timesTested.toLocaleString()}
          icon={BookOpen}
          iconColor="bg-purple-50 text-purple-600"
        />
        <StatCard
          title="Correct Answers"
          value={word.correctAnswers.toLocaleString()}
          changeType="positive"
          icon={CheckCircle}
          iconColor="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          title="Incorrect Answers"
          value={word.incorrectAnswers.toLocaleString()}
          changeType="negative"
          icon={XCircle}
          iconColor="bg-red-50 text-red-600"
        />
        <StatCard
          title="Overall Accuracy"
          value={`${word.accuracy}%`}
          icon={TrendingUp}
          iconColor="bg-teal-50 text-teal-600"
        />
      </div>

      {/* Word Details & Example */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Word Attributes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            {isEditing ? (
              <div className="space-y-3">
                <div>
                  <label className="font-semibold text-slate-700">German Word</label>
                  <Input
                    value={formData.german}
                    onChange={(e) => setFormData({ ...formData, german: e.target.value })}
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">English Translation</label>
                  <Input
                    value={formData.english}
                    onChange={(e) => setFormData({ ...formData, english: e.target.value })}
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                    className="w-full rounded-lg border border-slate-300 p-2 text-sm bg-white"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">German Expression:</span>
                  <span className="font-bold text-slate-900 text-sm">{word.german}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">English Translation:</span>
                  <span className="font-semibold text-slate-800">{word.english}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Grammatical Article:</span>
                  <span className="font-mono font-bold text-blue-600">{word.article}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Part of Speech:</span>
                  <span className="font-medium text-slate-800">{word.partOfSpeech}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Curriculum Chapter:</span>
                  <span className="font-semibold text-slate-800">{word.chapterTitle}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Review Occurrences:</span>
                  <span className="font-semibold text-slate-800">{word.reviewCount} sessions</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Audio Player and Contextual Sentences */}
        <Card>
          <CardHeader>
            <CardTitle>Example Context & Audio Player</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            {/* Audio player simulator box */}
            <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 flex items-center justify-between">
              <div>
                <p className="font-bold text-blue-900 text-sm">{word.german}</p>
                <p className="text-[11px] text-blue-600 font-mono">
                  {word.pronunciation || '/standard de-DE/'}
                </p>
              </div>
              <Button onClick={playAudio} className="bg-blue-600 hover:bg-blue-700 text-xs gap-1.5">
                <Volume2 className="h-4 w-4" />
                Play German Pronunciation
              </Button>
            </div>

            {isEditing ? (
              <div className="space-y-3">
                <div>
                  <label className="font-semibold text-slate-700">German Sentence</label>
                  <Textarea
                    value={formData.exampleGerman}
                    onChange={(e) => setFormData({ ...formData, exampleGerman: e.target.value })}
                    rows={2}
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">English Sentence</label>
                  <Textarea
                    value={formData.exampleEnglish}
                    onChange={(e) => setFormData({ ...formData, exampleEnglish: e.target.value })}
                    rows={2}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3 pt-2">
                <div>
                  <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                    German Example:
                  </span>
                  <p className="mt-1 text-sm font-medium text-slate-900 italic bg-slate-50 p-3 rounded-lg border border-slate-200">
                    &quot;{word.exampleGerman}&quot;
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                    English Meaning:
                  </span>
                  <p className="mt-1 text-sm text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200">
                    &quot;{word.exampleEnglish}&quot;
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        title="Delete Vocabulary Word?"
        description={`Are you sure you want to delete "${word.german}"? This word will be removed from all active quizzes and review sessions.`}
        confirmText="Delete Word"
        variant="destructive"
        onConfirm={() => {
          deleteVocabulary(word.id);
          router.push('/admin/vocabulary');
        }}
      />
    </div>
  );
}
