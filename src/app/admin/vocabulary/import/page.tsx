'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Upload,
  ArrowLeft,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Download,
} from 'lucide-react';
import { PageHeader } from '@/components/admin/navigation/PageHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAdminStore } from '@/lib/store';
import { GermanArticle, PartOfSpeech, DifficultyLevel } from '@/types';

interface ParsedRecord {
  german_word: string;
  english_translation: string;
  article: string;
  part_of_speech: string;
  difficulty: string;
  chapter_id: string;
  example_german: string;
  example_english: string;
  isValid: boolean;
  isDuplicate: boolean;
  errors: string[];
}

export default function BulkImportVocabularyPage() {
  const router = useRouter();
  const { vocabulary, chapters, bulkAddVocabulary } = useAdminStore();
  const [csvText, setCsvText] = useState('');
  const [parsedRows, setParsedRows] = useState<ParsedRecord[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Sample CSV template generator
  const downloadSampleTemplate = () => {
    const header = 'german_word,english_translation,article,part_of_speech,difficulty,chapter_id,example_german,example_english\n';
    const sample = 'der Schlüssel,Key,der,Noun,Easy,chap_b1_1,Ich habe den Schlüssel an der Rezeption abgegeben.,I handed over the key at the reception.\ndie Rechnung,Bill / Invoice,die,Noun,Medium,chap_b1_1,Könnten Sie mir bitte die Rechnung schicken?,Could you please send me the invoice?\nbestätigen,to confirm,none,Verb,Medium,chap_b1_1,Wir müssen den Termin schriftlich bestätigen.,We must confirm the appointment in writing.\n';
    const blob = new Blob([header + sample], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'telc_vocabulary_import_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleParse = (text: string) => {
    setCsvText(text);
    if (!text.trim()) {
      setParsedRows([]);
      return;
    }

    const lines = text.trim().split('\n');
    const records: ParsedRecord[] = [];

    // Skip header if line starts with german_word
    const startIndex = lines[0].toLowerCase().includes('german_word') ? 1 : 0;

    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const parts = line.split(',').map((p) => p.trim());

      const german = parts[0] || '';
      const english = parts[1] || '';
      const article = parts[2] || 'none';
      const pos = parts[3] || 'Noun';
      const diff = parts[4] || 'Easy';
      const chapId = parts[5] || (chapters[0]?.id ?? 'chap_b1_1');
      const exDe = parts[6] || '';
      const exEn = parts[7] || '';

      const errors: string[] = [];
      if (!german) errors.push('Missing German word');
      if (!english) errors.push('Missing English translation');
      if (!['der', 'die', 'das', 'none'].includes(article.toLowerCase())) {
        errors.push(`Invalid article "${article}" (use der/die/das/none)`);
      }

      // Check duplicates against existing DB and parsed records
      const isDuplicate =
        vocabulary.some((v) => v.german.toLowerCase() === german.toLowerCase()) ||
        records.some((r) => r.german_word.toLowerCase() === german.toLowerCase());

      records.push({
        german_word: german,
        english_translation: english,
        article,
        part_of_speech: pos,
        difficulty: diff,
        chapter_id: chapId,
        example_german: exDe,
        example_english: exEn,
        isValid: errors.length === 0,
        isDuplicate,
        errors,
      });
    }

    setParsedRows(records);
  };

  const validRecords = parsedRows.filter((r) => r.isValid && !r.isDuplicate);
  const invalidRecords = parsedRows.filter((r) => !r.isValid);
  const duplicateRecords = parsedRows.filter((r) => r.isDuplicate);

  const handleImport = async () => {
    if (validRecords.length === 0) return;
    setIsProcessing(true);

    try {
      const payload = validRecords.map((r) => {
        const fullGerman =
          r.article !== 'none' && !r.german_word.toLowerCase().startsWith(r.article)
            ? `${r.article} ${r.german_word}`
            : r.german_word;

        const targetChap = chapters.find((ch) => ch.id === r.chapter_id) || chapters[0];

        return {
          german: fullGerman,
          english: r.english_translation,
          article: r.article as GermanArticle,
          partOfSpeech: r.part_of_speech as PartOfSpeech,
          difficulty: r.difficulty as DifficultyLevel,
          chapterId: targetChap.id,
          chapterTitle: targetChap.title,
          courseId: targetChap.courseId,
          tags: ['Bulk Imported'],
          exampleGerman: r.example_german || `Das Wort heißt ${fullGerman}.`,
          exampleEnglish: r.example_english || `The word means ${r.english_translation}.`,
          status: 'active' as const,
        };
      });

      bulkAddVocabulary(payload);
      setIsSaved(true);
      setTimeout(() => {
        router.push('/admin/vocabulary');
      }, 1200);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
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
        title="Bulk Vocabulary Import"
        description="Batch upload CSV/Excel files into TELC chapters with automatic data integrity and duplicate verification."
        actions={
          <Button variant="outline" size="sm" onClick={downloadSampleTemplate} className="gap-1.5 text-xs">
            <Download className="h-3.5 w-3.5" />
            Download Sample CSV
          </Button>
        }
      />

      {isSaved && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          Successfully imported {validRecords.length} vocabulary words! Redirecting to table...
        </div>
      )}

      {/* CSV Input Card */}
      <Card>
        <CardHeader>
          <CardTitle>CSV Raw Data or Paste</CardTitle>
          <p className="text-xs text-slate-500">
            Paste comma-separated rows or load demo dataset into the parser below:
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <textarea
            value={csvText}
            onChange={(e) => handleParse(e.target.value)}
            placeholder="german_word,english_translation,article,part_of_speech,difficulty,chapter_id,example_german,example_english"
            rows={5}
            className="w-full rounded-lg border border-slate-300 p-3 font-mono text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
          />
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const demo = `der Schlüssel,Key,der,Noun,Easy,chap_b1_1,Ich habe den Schlüssel an der Rezeption abgegeben.,I handed over the key at the reception.\ndie Rechnung,Bill / Invoice,die,Noun,Medium,chap_b1_1,Könnten Sie mir bitte die Rechnung schicken?,Could you please send me the invoice?\nbestätigen,to confirm,none,Verb,Medium,chap_b1_1,Wir müssen den Termin schriftlich bestätigen.,We must confirm the appointment in writing.\nder Antrag,Application / Form,der,Noun,Hard,chap_b1_1,Der Antrag muss bis Freitag vorliegen.,The application must be submitted by Friday.`;
                handleParse(demo);
              }}
              className="text-xs"
            >
              Paste Demo TELC Vocabulary
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Validation Summary Card */}
      {parsedRows.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span className="text-xs font-bold text-emerald-900">Valid Records</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-emerald-700">{validRecords.length}</p>
            <p className="text-[11px] text-emerald-600">Ready to save into chapter</p>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <span className="text-xs font-bold text-amber-900">Duplicates Detected</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-amber-700">{duplicateRecords.length}</p>
            <p className="text-[11px] text-amber-600">Skipped automatically</p>
          </div>

          <div className="rounded-xl border border-red-200 bg-red-50/60 p-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-600" />
              <span className="text-xs font-bold text-red-900">Invalid Records</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-red-700">{invalidRecords.length}</p>
            <p className="text-[11px] text-red-600">Errors need correction</p>
          </div>
        </div>
      )}

      {/* Preview Table */}
      {parsedRows.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Parsed Records Preview</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-y border-slate-200 bg-slate-50 text-slate-500 font-semibold">
                  <tr>
                    <th className="px-4 py-2.5">Status</th>
                    <th className="px-4 py-2.5">German Word</th>
                    <th className="px-4 py-2.5">English Translation</th>
                    <th className="px-4 py-2.5">Article</th>
                    <th className="px-4 py-2.5">Part of Speech</th>
                    <th className="px-4 py-2.5">Difficulty</th>
                    <th className="px-4 py-2.5">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {parsedRows.map((r, i) => (
                    <tr
                      key={i}
                      className={
                        !r.isValid
                          ? 'bg-red-50/40'
                          : r.isDuplicate
                          ? 'bg-amber-50/30'
                          : 'hover:bg-slate-50/50'
                      }
                    >
                      <td className="px-4 py-2.5">
                        {!r.isValid ? (
                          <Badge variant="destructive" className="text-[10px]">
                            Invalid
                          </Badge>
                        ) : r.isDuplicate ? (
                          <Badge variant="warning" className="text-[10px]">
                            Duplicate
                          </Badge>
                        ) : (
                          <Badge variant="success" className="text-[10px]">
                            Valid
                          </Badge>
                        )}
                      </td>
                      <td className="px-4 py-2.5 font-bold text-slate-900">{r.german_word}</td>
                      <td className="px-4 py-2.5 text-slate-700">{r.english_translation}</td>
                      <td className="px-4 py-2.5 font-mono text-blue-600">{r.article}</td>
                      <td className="px-4 py-2.5 text-slate-500">{r.part_of_speech}</td>
                      <td className="px-4 py-2.5">{r.difficulty}</td>
                      <td className="px-4 py-2.5 text-slate-500 text-[11px]">
                        {r.errors.length > 0 ? (
                          <span className="text-red-600">{r.errors.join(', ')}</span>
                        ) : r.isDuplicate ? (
                          <span className="text-amber-700">Already exists in platform</span>
                        ) : (
                          <span className="text-emerald-700">Ready</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Commit Import Button */}
      {parsedRows.length > 0 && (
        <div className="flex items-center justify-between pt-2">
          <a href="/admin/vocabulary">
            <Button variant="outline">Cancel</Button>
          </a>
          <Button
            onClick={handleImport}
            disabled={validRecords.length === 0 || isProcessing}
            isLoading={isProcessing}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Import {validRecords.length} Valid Words
          </Button>
        </div>
      )}
    </div>
  );
}
