'use client';

import React, { useState } from 'react';
import {
  ClipboardCheck,
  Plus,
  ArrowRight,
  Eye,
  Trash2,
  HelpCircle,
  CheckCircle,
  FileQuestion,
  ListOrdered,
} from 'lucide-react';
import { PageHeader } from '@/components/admin/navigation/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { FormDrawer } from '@/components/admin/drawers/FormDrawer';
import { ConfirmationDrawer } from '@/components/admin/drawers/ConfirmationDrawer';
import { useToast } from '@/components/ui/toast';
import { useAdminStore } from '@/lib/store';
import { Test, TestType, TestQuestion } from '@/types';

export default function TestsPage() {
  const { toast } = useToast();
  const { tests, testQuestions, chapters, courses, addTest, deleteTest, addTestQuestion, deleteTestQuestion } =
    useAdminStore();
  const [selectedTab, setSelectedTab] = useState<TestType>('Translation');
  const [showCreateDrawer, setShowCreateDrawer] = useState(false);
  const [selectedTestForQuestions, setSelectedTestForQuestions] = useState<Test | null>(null);
  const [showAddQuestionDrawer, setShowAddQuestionDrawer] = useState(false);
  const [testToDelete, setTestToDelete] = useState<Test | null>(null);

  // New test state
  const [newTestTitle, setNewTestTitle] = useState('');
  const [newTestType, setNewTestType] = useState<TestType>('Translation');
  const [newTestChapterId, setNewTestChapterId] = useState(chapters[0]?.id || 'chap_b1_1');
  const [newTestRandomize, setNewTestRandomize] = useState(true);

  // New question state
  const [newPrompt, setNewPrompt] = useState('');
  const [newCorrectGerman, setNewCorrectGerman] = useState('');
  const [newAcceptedAnswers, setNewAcceptedAnswers] = useState('');
  const [newDifficulty, setNewDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Easy');

  const filteredTests = tests.filter((t) => t.type === selectedTab);

  const handleCreateTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestTitle) return;
    const chap = chapters.find((c) => c.id === newTestChapterId) || chapters[0];
    addTest({
      title: newTestTitle,
      type: newTestType,
      courseId: chap.courseId,
      courseTitle: chap.courseTitle,
      chapterId: chap.id,
      chapterTitle: chap.title,
      questionSelection: 'Automatic',
      randomize: newTestRandomize,
      questionsCount: 20,
      status: 'active',
    });
    toast({
      title: 'Assessment Created',
      description: `"${newTestTitle}" is now ready for learners.`,
      variant: 'success',
    });
    setNewTestTitle('');
    setShowCreateDrawer(false);
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrompt || !newCorrectGerman || !selectedTestForQuestions) return;
    const acceptedList = newAcceptedAnswers
      ? newAcceptedAnswers.split(',').map((a) => a.trim())
      : [newCorrectGerman];

    addTestQuestion({
      testId: selectedTestForQuestions.id,
      englishPrompt: newPrompt,
      correctGerman: newCorrectGerman,
      questionType: 'Translation',
      acceptedAnswers: acceptedList,
      difficulty: newDifficulty,
      orderIndex: testQuestions.length + 1,
    });

    toast({
      title: 'Question Added',
      description: `New question added to ${selectedTestForQuestions.title}.`,
      variant: 'success',
    });

    setNewPrompt('');
    setNewCorrectGerman('');
    setNewAcceptedAnswers('');
    setShowAddQuestionDrawer(false);
  };

  const activeQuestions = selectedTestForQuestions
    ? testQuestions.filter((q) => q.testId === selectedTestForQuestions.id)
    : testQuestions;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tests & Assessments"
        description="Design vocabulary translation quizzes, 4-day cumulative milestones, and comprehensive 50-item chapter examinations."
        actions={
          <Button onClick={() => setShowCreateDrawer(true)} className="gap-1.5 bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4" />
            Create Assessment
          </Button>
        }
      />

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={(val) => setSelectedTab(val as TestType)}>
        <TabsList className="bg-slate-100 p-1">
          <TabsTrigger value="Translation">Translation Quizzes</TabsTrigger>
          <TabsTrigger value="Cumulative">Cumulative Milestones</TabsTrigger>
          <TabsTrigger value="ChapterReview">Chapter Wrap-up Exams</TabsTrigger>
        </TabsList>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTests.map((test) => (
            <Card key={test.id} className="relative flex flex-col justify-between hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <Badge variant="outline" className="text-[10px] uppercase font-bold text-blue-700 bg-blue-50 border-blue-200">
                    {test.type}
                  </Badge>
                  <button
                    onClick={() => setTestToDelete(test)}
                    className="text-slate-400 hover:text-red-600 transition-colors p-1"
                    title="Delete assessment"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <CardTitle className="text-base mt-2">{test.title}</CardTitle>
                <p className="text-xs text-slate-500">
                  {test.chapterTitle} • {test.courseTitle}
                </p>
              </CardHeader>

              <CardContent className="space-y-4 pt-0">
                <div className="grid grid-cols-3 gap-2 rounded-lg bg-slate-50 p-2 text-center text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Questions</span>
                    <span className="font-bold text-slate-800">{test.questionsCount}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Attempts</span>
                    <span className="font-bold text-slate-800">{test.attemptsCount}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Avg Score</span>
                    <span className="font-bold text-emerald-600">{test.averageScore}%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                  <span className="text-slate-500">
                    Selection: <strong className="text-slate-700">{test.questionSelection}</strong>
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedTestForQuestions(test);
                      setShowAddQuestionDrawer(true);
                    }}
                    className="text-xs h-7 gap-1"
                  >
                    <Plus className="h-3 w-3" />
                    Add Question
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Tabs>

      {/* ======================================================== */}
      {/* 1. CREATE ASSESSMENT RIGHT-SIDE DRAWER */}
      {/* ======================================================== */}
      <FormDrawer
        open={showCreateDrawer}
        onOpenChange={setShowCreateDrawer}
        title="Create New Assessment"
        description="Configure quiz type, associated curriculum chapter, and automatic vs manual question pool."
        submitLabel="Create Assessment"
        onSubmit={handleCreateTest}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Assessment Title <span className="text-red-500">*</span>
            </label>
            <Input
              value={newTestTitle}
              onChange={(e) => setNewTestTitle(e.target.value)}
              placeholder="e.g. Kapitel 1 Daily Translation Quiz"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Test Format</label>
            <select
              value={newTestType}
              onChange={(e) => setNewTestType(e.target.value as TestType)}
              className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-700"
            >
              <option value="Translation">Translation Quiz (Recall English &rarr; German)</option>
              <option value="Cumulative">Cumulative Test (Multi-batch milestone)</option>
              <option value="ChapterReview">Chapter Wrap-up Exam (50 questions)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Curriculum Chapter</label>
            <select
              value={newTestChapterId}
              onChange={(e) => setNewTestChapterId(e.target.value)}
              className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-700"
            >
              {chapters.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  Ch. {ch.chapterNumber}: {ch.title} ({ch.courseTitle})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-lg border border-slate-200 bg-slate-50">
            <div>
              <p className="text-xs font-semibold text-slate-800">Randomize Order</p>
              <p className="text-[11px] text-slate-500">Shuffle questions on each learner attempt</p>
            </div>
            <input
              type="checkbox"
              checked={newTestRandomize}
              onChange={(e) => setNewTestRandomize(e.target.checked)}
              className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
            />
          </div>
        </div>
      </FormDrawer>

      {/* ======================================================== */}
      {/* 2. ADD QUESTION RIGHT-SIDE DRAWER */}
      {/* ======================================================== */}
      <FormDrawer
        open={showAddQuestionDrawer}
        onOpenChange={setShowAddQuestionDrawer}
        title="Add Question to Assessment"
        description={selectedTestForQuestions ? `Adding to ${selectedTestForQuestions.title}` : 'Question design'}
        submitLabel="Add Question"
        onSubmit={handleAddQuestion}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              English Prompt <span className="text-red-500">*</span>
            </label>
            <Input
              value={newPrompt}
              onChange={(e) => setNewPrompt(e.target.value)}
              placeholder="e.g. the train station"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Primary German Answer <span className="text-red-500">*</span>
            </label>
            <Input
              value={newCorrectGerman}
              onChange={(e) => setNewCorrectGerman(e.target.value)}
              placeholder="e.g. der Bahnhof"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Alternative Accepted Spellings
            </label>
            <Input
              value={newAcceptedAnswers}
              onChange={(e) => setNewAcceptedAnswers(e.target.value)}
              placeholder="e.g. Bahnhof, Hauptbahnhof"
            />
            <p className="text-[11px] text-slate-400 mt-1">Comma-separated alternative answers scored as 100% correct</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Difficulty</label>
            <select
              value={newDifficulty}
              onChange={(e) => setNewDifficulty(e.target.value as any)}
              className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-700"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>
      </FormDrawer>

      {/* ======================================================== */}
      {/* 3. DELETE CONFIRMATION RIGHT-SIDE DRAWER */}
      {/* ======================================================== */}
      {testToDelete && (
        <ConfirmationDrawer
          open={!!testToDelete}
          onOpenChange={(open) => !open && setTestToDelete(null)}
          title="Delete Assessment?"
          description={`Are you sure you want to delete "${testToDelete.title}"?`}
          confirmText="Delete Assessment"
          variant="destructive"
          onConfirm={() => {
            deleteTest(testToDelete.id);
            toast({
              title: 'Assessment Deleted',
              description: `"${testToDelete.title}" was removed.`,
              variant: 'default',
            });
            setTestToDelete(null);
          }}
        />
      )}
    </div>
  );
}
