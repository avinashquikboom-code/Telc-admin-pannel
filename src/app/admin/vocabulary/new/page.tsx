'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, Save, Plus, Volume2 } from 'lucide-react';
import { PageHeader } from '@/components/admin/navigation/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAdminStore } from '@/lib/store';
import { GermanArticle, PartOfSpeech, DifficultyLevel } from '@/types';

const vocabSchema = z.object({
  german: z.string().min(1, 'German word is required'),
  english: z.string().min(1, 'English translation is required'),
  article: z.enum(['der', 'die', 'das', 'none']),
  partOfSpeech: z.enum(['Noun', 'Verb', 'Adjective', 'Adverb', 'Preposition', 'Phrase']),
  pronunciation: z.string().optional(),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  chapterId: z.string().min(1, 'Chapter selection is required'),
  tags: z.string().optional(),
  exampleGerman: z.string().min(3, 'German example sentence is required'),
  exampleEnglish: z.string().min(3, 'English translation of the example is required'),
});

type VocabFormData = z.infer<typeof vocabSchema>;

export default function AddVocabularyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultChapterId = searchParams.get('chapterId') || 'chap_b1_1';
  const { chapters, addVocabulary } = useAdminStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VocabFormData>({
    resolver: zodResolver(vocabSchema),
    defaultValues: {
      german: '',
      english: '',
      article: 'der',
      partOfSpeech: 'Noun',
      pronunciation: '',
      difficulty: 'Easy',
      chapterId: defaultChapterId,
      tags: 'Living, Essentials',
      exampleGerman: '',
      exampleEnglish: '',
    },
  });

  const onSubmit = async (data: VocabFormData, addAnother: boolean = false) => {
    setIsSubmitting(true);
    try {
      const selectedChap = chapters.find((ch) => ch.id === data.chapterId);
      const formattedGerman =
        data.article !== 'none' && !data.german.toLowerCase().startsWith(data.article)
          ? `${data.article} ${data.german}`
          : data.german;

      addVocabulary({
        german: formattedGerman,
        english: data.english,
        article: data.article as GermanArticle,
        partOfSpeech: data.partOfSpeech as PartOfSpeech,
        pronunciation: data.pronunciation,
        difficulty: data.difficulty as DifficultyLevel,
        chapterId: data.chapterId,
        chapterTitle: selectedChap?.title || 'Chapter 1',
        courseId: selectedChap?.courseId || 'course_b1',
        tags: data.tags ? data.tags.split(',').map((t) => t.trim()) : [],
        exampleGerman: data.exampleGerman,
        exampleEnglish: data.exampleEnglish,
        status: 'active',
      });

      if (addAnother) {
        setSuccessNotice(`Saved "${formattedGerman}" successfully. You can enter the next word.`);
        reset({
          german: '',
          english: '',
          article: 'der',
          partOfSpeech: 'Noun',
          pronunciation: '',
          difficulty: 'Easy',
          chapterId: data.chapterId,
          tags: data.tags,
          exampleGerman: '',
          exampleEnglish: '',
        });
      } else {
        router.push('/admin/vocabulary');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <a href="/admin/vocabulary" className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Vocabulary
        </a>
      </div>

      <PageHeader
        title="Add Vocabulary Word"
        description="Register a new German word with grammatical article, audio pronunciation, difficulty, and contextual example."
      />

      {successNotice && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800 animate-in fade-in">
          ✓ {successNotice}
        </div>
      )}

      <form className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Word Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Article
                </label>
                <select
                  {...register('article')}
                  className="flex h-9 w-full rounded-lg border border-slate-300 bg-white px-3 py-1 text-sm text-slate-900 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 font-mono"
                >
                  <option value="der">der (Maskulin)</option>
                  <option value="die">die (Feminin)</option>
                  <option value="das">das (Neutral)</option>
                  <option value="none">none (Verbs / Adj)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  German Word <span className="text-red-500">*</span>
                </label>
                <Input
                  {...register('german')}
                  placeholder="e.g. Tisch or der Tisch"
                  error={errors.german?.message}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  English Translation <span className="text-red-500">*</span>
                </label>
                <Input
                  {...register('english')}
                  placeholder="e.g. Table"
                  error={errors.english?.message}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pronunciation (IPA)
                </label>
                <Input
                  {...register('pronunciation')}
                  placeholder="e.g. /tɪʃ/"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Part of Speech <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('partOfSpeech')}
                  className="flex h-9 w-full rounded-lg border border-slate-300 bg-white px-3 py-1 text-sm text-slate-900 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                >
                  <option value="Noun">Noun</option>
                  <option value="Verb">Verb</option>
                  <option value="Adjective">Adjective</option>
                  <option value="Adverb">Adverb</option>
                  <option value="Preposition">Preposition</option>
                  <option value="Phrase">Phrase</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Difficulty Level <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('difficulty')}
                  className="flex h-9 w-full rounded-lg border border-slate-300 bg-white px-3 py-1 text-sm text-slate-900 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Chapter <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('chapterId')}
                  className="flex h-9 w-full rounded-lg border border-slate-300 bg-white px-3 py-1 text-sm text-slate-900 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                >
                  {chapters.map((ch) => (
                    <option key={ch.id} value={ch.id}>
                      Ch. {ch.chapterNumber}: {ch.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tags (Comma separated)
              </label>
              <Input
                {...register('tags')}
                placeholder="e.g. Furniture, Living, House"
              />
            </div>
          </CardContent>
        </Card>

        {/* Example Sentences */}
        <Card>
          <CardHeader>
            <CardTitle>Example Usage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                German Example Sentence <span className="text-red-500">*</span>
              </label>
              <Textarea
                {...register('exampleGerman')}
                placeholder="e.g. Wir setzen uns an den großen Tisch im Esszimmer."
                rows={2}
                error={errors.exampleGerman?.message}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                English Translation of Sentence <span className="text-red-500">*</span>
              </label>
              <Textarea
                {...register('exampleEnglish')}
                placeholder="e.g. We sit down at the large table in the dining room."
                rows={2}
                error={errors.exampleEnglish?.message}
              />
            </div>
          </CardContent>
        </Card>

        {/* Buttons */}
        <div className="flex items-center justify-between pt-2">
          <a href="/admin/vocabulary">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </a>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              isLoading={isSubmitting}
              onClick={handleSubmit((data) => onSubmit(data, true))}
            >
              <Plus className="mr-1 h-3.5 w-3.5" />
              Save & Add Another
            </Button>

            <Button
              type="button"
              isLoading={isSubmitting}
              onClick={handleSubmit((data) => onSubmit(data, false))}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="mr-1.5 h-4 w-4" />
              Save Word
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
