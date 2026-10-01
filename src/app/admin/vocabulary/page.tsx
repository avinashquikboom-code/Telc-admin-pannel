'use client';

import React, { useState } from 'react';
import Link from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import {
  Languages,
  Plus,
  Upload,
  Volume2,
  Eye,
  Trash2,
  FileSpreadsheet,
  CheckCircle,
} from 'lucide-react';
import { VocabularyWord, PartOfSpeech, DifficultyLevel } from '@/types';
import { useAdminStore } from '@/lib/store';
import { PageHeader } from '@/components/admin/navigation/PageHeader';
import { DataTable } from '@/components/admin/tables/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ConfirmDialog } from '@/components/ui/dialog';

export default function VocabularyPage() {
  const { vocabulary, chapters, deleteVocabulary, updateVocabulary } = useAdminStore();
  const [chapterFilter, setChapterFilter] = useState<string>('all');
  const [posFilter, setPosFilter] = useState<string>('all');
  const [diffFilter, setDiffFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [wordToDelete, setWordToDelete] = useState<VocabularyWord | null>(null);

  // Audio preview playback simulation
  const playAudio = (word: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'de-DE';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    } else {
      alert(`Audio pronunciation for: ${word}`);
    }
  };

  const filteredVocabulary = vocabulary.filter((w) => {
    if (chapterFilter !== 'all' && w.chapterId !== chapterFilter) return false;
    if (posFilter !== 'all' && w.partOfSpeech !== posFilter) return false;
    if (diffFilter !== 'all' && w.difficulty !== diffFilter) return false;
    if (statusFilter !== 'all' && w.status !== statusFilter) return false;
    return true;
  });

  const columns: ColumnDef<VocabularyWord>[] = [
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
              className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
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
                <a
                  href={`/admin/vocabulary/${item.id}`}
                  className="font-semibold text-slate-900 hover:text-blue-600 transition-colors"
                >
                  {item.german.replace(/^(der|die|das)\s+/i, '')}
                </a>
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
        <Badge variant="secondary" className="text-[10px]">
          {row.original.partOfSpeech}
        </Badge>
      ),
    },
    {
      accessorKey: 'difficulty',
      header: 'Difficulty',
      cell: ({ row }) => {
        const diff = row.original.difficulty;
        return (
          <Badge
            variant={diff === 'Easy' ? 'success' : diff === 'Medium' ? 'warning' : 'destructive'}
            className="text-[10px]"
          >
            {diff}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'accuracy',
      header: 'Learner Accuracy',
      cell: ({ row }) => {
        const acc = row.original.accuracy;
        return (
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-12 rounded-full bg-slate-100 overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  acc >= 85 ? 'bg-emerald-500' : acc >= 70 ? 'bg-blue-500' : 'bg-amber-500'
                }`}
                style={{ width: `${acc}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-slate-700">{acc}%</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge variant={status === 'active' ? 'success' : 'secondary'} className="text-[10px]">
            {status}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const word = row.original;
        return (
          <div className="flex items-center gap-1">
            <a href={`/admin/vocabulary/${word.id}`} title="View Details">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600 hover:text-blue-600">
                <Eye className="h-4 w-4" />
              </Button>
            </a>
            <button
              onClick={() => setWordToDelete(word)}
              title="Delete Word"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
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
        title="Vocabulary"
        description="Comprehensive dictionary management with German articles (der/die/das), audio, example sentences, and accuracy metrics."
        actions={
          <div className="flex items-center gap-2">
            <a href="/admin/vocabulary/import">
              <Button variant="outline" className="gap-1.5 text-xs">
                <Upload className="h-3.5 w-3.5" />
                Import CSV / Excel
              </Button>
            </a>
            <a href="/admin/vocabulary/new">
              <Button className="gap-1.5 bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4" />
                Add Word
              </Button>
            </a>
          </div>
        }
      />

      <DataTable
        columns={columns}
        data={filteredVocabulary}
        searchKey="german"
        searchPlaceholder="Search German or English word..."
        filters={
          <div className="flex flex-wrap items-center gap-2">
            {/* Chapter filter */}
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
                    Ch. {ch.chapterNumber}: {ch.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Part of Speech */}
            <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs">
              <span className="text-slate-400">POS:</span>
              <select
                value={posFilter}
                onChange={(e) => setPosFilter(e.target.value)}
                className="bg-transparent font-medium text-slate-700 focus:outline-hidden cursor-pointer"
              >
                <option value="all">All POS</option>
                <option value="Noun">Noun</option>
                <option value="Verb">Verb</option>
                <option value="Adjective">Adjective</option>
                <option value="Adverb">Adverb</option>
                <option value="Phrase">Phrase</option>
              </select>
            </div>

            {/* Difficulty */}
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
        emptyDescription="Add vocabulary words with pronunciation and example sentences to populate this chapter."
        onAddFirst={() => window.location.assign('/admin/vocabulary/new')}
        addFirstLabel="+ Add First Vocabulary Word"
      />

      <ConfirmDialog
        open={!!wordToDelete}
        onOpenChange={(open) => !open && setWordToDelete(null)}
        title="Delete Vocabulary Word?"
        description={`Are you sure you want to delete "${wordToDelete?.german}" (${wordToDelete?.english})? This will also remove it from daily sessions and tests. This action cannot be undone.`}
        confirmText="Delete Word"
        variant="destructive"
        onConfirm={() => {
          if (wordToDelete) {
            deleteVocabulary(wordToDelete.id);
            setWordToDelete(null);
          }
        }}
      />
    </div>
  );
}
