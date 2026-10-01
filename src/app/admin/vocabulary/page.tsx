'use client';

import React, { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import {
  Languages,
  Plus,
  Volume2,
  Edit2,
  Trash2,
  FileSpreadsheet,
} from 'lucide-react';
import { VocabularyWord, PartOfSpeech, DifficultyLevel, GermanArticle } from '@/types';
import { useAdminStore } from '@/lib/store';
import { PageHeader } from '@/components/admin/navigation/PageHeader';
import { DataTable } from '@/components/admin/tables/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormDrawer } from '@/components/admin/drawers/FormDrawer';
import { ConfirmationDrawer } from '@/components/admin/drawers/ConfirmationDrawer';
import { useToast } from '@/components/ui/toast';

export default function VocabularyPage() {
  const { vocabulary, chapters, courses, addVocabulary, updateVocabulary, deleteVocabulary } = useAdminStore();
  const { toast } = useToast();

  const [chapterFilter, setChapterFilter] = useState<string>('all');
  const [posFilter, setPosFilter] = useState<string>('all');
  const [diffFilter, setDiffFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [wordToDelete, setWordToDelete] = useState<VocabularyWord | null>(null);

  // Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingWord, setEditingWord] = useState<VocabularyWord | null>(null);
  const [form, setForm] = useState({
    courseId: courses[0]?.id || '',
    chapterId: chapters[0]?.id || '',
    german: '',
    english: '',
    article: 'none' as GermanArticle,
    partOfSpeech: 'Noun' as PartOfSpeech,
    pronunciation: '',
    difficulty: 'Medium' as DifficultyLevel,
    tags: 'Core, B1',
    exampleGerman: '',
    exampleEnglish: '',
    status: 'active' as 'active' | 'inactive',
  });

  const playAudio = (word: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'de-DE';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleOpenAdd = () => {
    setEditingWord(null);
    setForm({
      courseId: courses[0]?.id || '',
      chapterId: chapters[0]?.id || '',
      german: '',
      english: '',
      article: 'der',
      partOfSpeech: 'Noun',
      pronunciation: '',
      difficulty: 'Medium',
      tags: 'B1, Exam',
      exampleGerman: '',
      exampleEnglish: '',
      status: 'active',
    });
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (word: VocabularyWord) => {
    setEditingWord(word);
    setForm({
      courseId: word.courseId,
      chapterId: word.chapterId,
      german: word.german,
      english: word.english,
      article: word.article,
      partOfSpeech: word.partOfSpeech,
      pronunciation: word.pronunciation || '',
      difficulty: word.difficulty,
      tags: word.tags.join(', '),
      exampleGerman: word.exampleGerman,
      exampleEnglish: word.exampleEnglish,
      status: word.status,
    });
    setIsDrawerOpen(true);
  };

  const handleSaveWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.german || !form.english) return;

    const chapterObj = chapters.find((ch) => ch.id === form.chapterId);
    const chapterTitle = chapterObj ? chapterObj.title : 'Kapitel';

    const wordData = {
      courseId: form.courseId,
      chapterId: form.chapterId,
      chapterTitle,
      german: form.german,
      english: form.english,
      article: form.article,
      partOfSpeech: form.partOfSpeech,
      pronunciation: form.pronunciation,
      difficulty: form.difficulty,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      exampleGerman: form.exampleGerman,
      exampleEnglish: form.exampleEnglish,
      status: form.status,
    };

    if (editingWord) {
      updateVocabulary(editingWord.id, wordData);
      toast({
        title: 'Vocabulary Saved',
        description: `"${form.german}" updated successfully.`,
        variant: 'success',
      });
    } else {
      addVocabulary(wordData);
      toast({
        title: 'Vocabulary Added',
        description: `"${form.german}" added to ${chapterTitle}.`,
        variant: 'success',
      });
    }

    setIsDrawerOpen(false);
  };

  const filteredVocabulary = vocabulary.filter((w) => {
    if (chapterFilter !== 'all' && w.chapterId !== chapterFilter) return false;
    if (posFilter !== 'all' && w.partOfSpeech !== posFilter) return false;
    if (diffFilter !== 'all' && w.difficulty !== diffFilter) return false;
    if (statusFilter !== 'all' && w.status !== statusFilter) return false;
    return true;
  });

  const columns: ColumnDef<VocabularyWord, any>[] = [
    {
      accessorKey: 'german',
      header: 'German Word',
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={() => playAudio(item.german)}
              title="Listen pronunciation"
              className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors cursor-pointer"
            >
              <Volume2 className="h-3.5 w-3.5" />
            </button>
            <div>
              <div className="flex items-center gap-1.5">
                {item.article !== 'none' && (
                  <span className="font-mono text-xs font-bold text-blue-600">
                    {item.article}
                  </span>
                )}
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="font-semibold text-slate-900 hover:text-blue-600 transition-colors text-left cursor-pointer"
                >
                  {item.german.replace(/^(der|die|das)\s+/i, '')}
                </button>
              </div>
              {item.pronunciation && (
                <span className="text-[10px] text-slate-400 font-mono">{item.pronunciation}</span>
              )}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'english',
      header: 'English Translation',
      cell: ({ row }) => (
        <span className="font-medium text-slate-800">{row.original.english}</span>
      ),
    },
    {
      accessorKey: 'chapterTitle',
      header: 'Chapter',
      cell: ({ row }) => (
        <span className="text-slate-600 text-xs">{row.original.chapterTitle || 'Chapter 1'}</span>
      ),
    },
    {
      accessorKey: 'partOfSpeech',
      header: 'Part of Speech',
      cell: ({ row }) => (
        <Badge variant="outline" className="text-slate-600 text-[11px]">
          {row.original.partOfSpeech}
        </Badge>
      ),
    },
    {
      accessorKey: 'difficulty',
      header: 'Difficulty',
      cell: ({ row }) => (
        <Badge
          variant={
            row.original.difficulty === 'Easy'
              ? 'default'
              : row.original.difficulty === 'Medium'
              ? 'secondary'
              : 'destructive'
          }
          className="text-[11px]"
        >
          {row.original.difficulty}
        </Badge>
      ),
    },
    {
      accessorKey: 'accuracy',
      header: 'Accuracy',
      cell: ({ row }) => (
        <span className="text-xs font-semibold text-emerald-600">{row.original.accuracy}%</span>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        const word = row.original;
        return (
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleOpenEdit(word)}
              title="Edit in Right Drawer"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-blue-600 transition-colors cursor-pointer"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setWordToDelete(word)}
              title="Delete Word"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Vocabulary Bank"
        description="Comprehensive German vocabulary database with articles (der/die/das), audio pronunciations, contextual examples, and difficulty tags."
        actions={
          <div className="flex items-center gap-2">
            <a href="/admin/vocabulary/import">
              <Button variant="outline" className="gap-2">
                <FileSpreadsheet className="h-4 w-4" />
                Import CSV
              </Button>
            </a>
            <Button onClick={handleOpenAdd} className="gap-2 bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4" />
              Add Word
            </Button>
          </div>
        }
      />

      <DataTable
        columns={columns}
        data={filteredVocabulary}
        searchKey="german"
        searchPlaceholder="Search German or English vocabulary..."
        filters={
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs">
              <span className="text-slate-400">Chapter:</span>
              <select
                value={chapterFilter}
                onChange={(e) => setChapterFilter(e.target.value)}
                className="bg-transparent font-medium text-slate-700 focus:outline-hidden cursor-pointer"
              >
                <option value="all">All Chapters</option>
                {chapters.map((ch) => (
                  <option key={ch.id} value={ch.id}>
                    Ch. {ch.chapterNumber} — {ch.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs">
              <span className="text-slate-400">Type:</span>
              <select
                value={posFilter}
                onChange={(e) => setPosFilter(e.target.value)}
                className="bg-transparent font-medium text-slate-700 focus:outline-hidden cursor-pointer"
              >
                <option value="all">All Types</option>
                <option value="Noun">Nouns</option>
                <option value="Verb">Verbs</option>
                <option value="Adjective">Adjectives</option>
                <option value="Adverb">Adverbs</option>
                <option value="Preposition">Prepositions</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs">
              <span className="text-slate-400">Difficulty:</span>
              <select
                value={diffFilter}
                onChange={(e) => setDiffFilter(e.target.value)}
                className="bg-transparent font-medium text-slate-700 focus:outline-hidden cursor-pointer"
              >
                <option value="all">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>
        }
        emptyTitle="No vocabulary words found"
        emptyDescription="Add words or import CSV bulk list to populate your learning curriculum."
        onAddFirst={handleOpenAdd}
        addFirstLabel="+ Add First Word"
      />

      {/* ======================================================== */}
      {/* ADD / EDIT VOCABULARY RIGHT-SIDE DRAWER */}
      {/* ======================================================== */}
      <FormDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        title={editingWord ? 'Edit Vocabulary Word' : 'Add Vocabulary Word'}
        description={
          editingWord
            ? `Modify attributes and examples for "${editingWord.german}"`
            : 'Add a new German word with article and examples.'
        }
        submitLabel={editingWord ? 'Save Changes' : 'Add Word'}
        onSubmit={handleSaveWord}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Chapter</label>
              <select
                value={form.chapterId}
                onChange={(e) => setForm({ ...form, chapterId: e.target.value })}
                className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-700"
              >
                {chapters.map((ch) => (
                  <option key={ch.id} value={ch.id}>
                    Ch. {ch.chapterNumber}: {ch.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">German Article</label>
              <select
                value={form.article}
                onChange={(e) => setForm({ ...form, article: e.target.value as GermanArticle })}
                className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-700"
              >
                <option value="none">none (Verb / Adjective)</option>
                <option value="der">der (Masculine)</option>
                <option value="die">die (Feminine)</option>
                <option value="das">das (Neuter)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                German Word <span className="text-red-500">*</span>
              </label>
              <Input
                value={form.german}
                onChange={(e) => setForm({ ...form, german: e.target.value })}
                placeholder="e.g. der Bahnhof"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                English Translation <span className="text-red-500">*</span>
              </label>
              <Input
                value={form.english}
                onChange={(e) => setForm({ ...form, english: e.target.value })}
                placeholder="e.g. train station"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Part of Speech</label>
              <select
                value={form.partOfSpeech}
                onChange={(e) => setForm({ ...form, partOfSpeech: e.target.value as PartOfSpeech })}
                className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-700"
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
              <label className="block text-xs font-semibold text-slate-700 mb-1">Difficulty</label>
              <select
                value={form.difficulty}
                onChange={(e) => setForm({ ...form, difficulty: e.target.value as DifficultyLevel })}
                className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-700"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Pronunciation</label>
              <Input
                value={form.pronunciation}
                onChange={(e) => setForm({ ...form, pronunciation: e.target.value })}
                placeholder="[baːnhoːf]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">German Example Sentence</label>
            <Textarea
              value={form.exampleGerman}
              onChange={(e) => setForm({ ...form, exampleGerman: e.target.value })}
              placeholder="e.g. Wir treffen uns um 10 Uhr am Hauptbahnhof."
              rows={2}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">English Example Translation</label>
            <Textarea
              value={form.exampleEnglish}
              onChange={(e) => setForm({ ...form, exampleEnglish: e.target.value })}
              placeholder="e.g. We meet at 10 o'clock at the central station."
              rows={2}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Tags (Comma-separated)</label>
            <Input
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              placeholder="Travel, B1, Daily Life"
            />
          </div>
        </div>
      </FormDrawer>

      {/* ======================================================== */}
      {/* DELETE CONFIRMATION RIGHT-SIDE DRAWER */}
      {/* ======================================================== */}
      {wordToDelete && (
        <ConfirmationDrawer
          open={!!wordToDelete}
          onOpenChange={(open) => !open && setWordToDelete(null)}
          title="Delete Word?"
          description={`Are you sure you want to delete "${wordToDelete.german}" (${wordToDelete.english})?`}
          confirmText="Delete Word"
          variant="destructive"
          onConfirm={() => {
            deleteVocabulary(wordToDelete.id);
            toast({
              title: 'Word Deleted',
              description: `"${wordToDelete.german}" has been removed.`,
              variant: 'default',
            });
            setWordToDelete(null);
          }}
        />
      )}
    </div>
  );
}
