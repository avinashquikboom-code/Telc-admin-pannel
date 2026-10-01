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
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter, ConfirmDialog } from '@/components/ui/dialog';
import { useAdminStore } from '@/lib/store';
import { Test, TestType, TestQuestion } from '@/types';

export default function TestsPage() {
  const { tests, testQuestions, chapters, courses, addTest, deleteTest, addTestQuestion, deleteTestQuestion } =
    useAdminStore();
  const [selectedTab, setSelectedTab] = useState<TestType>('Translation');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTestForQuestions, setSelectedTestForQuestions] = useState<Test | null>(null);
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
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

  const handleCreateTest = () => {
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
    setNewTestTitle('');
    setShowCreateModal(false);
  };

  const handleAddQuestion = () => {
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

    setNewPrompt('');
    setNewCorrectGerman('');
    setNewAcceptedAnswers('');
    setShowAddQuestionModal(false);
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
          <Button onClick={() => setShowCreateModal(true)} className="gap-1.5 bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4" />
            Create Test
          </Button>
        }
      />

      {/* Tabs by Test Type */}
      <Tabs value={selectedTab} onValueChange={(val) => setSelectedTab(val as TestType)}>
        <TabsList>
          <TabsTrigger value="Translation">Vocabulary Tests</TabsTrigger>
          <TabsTrigger value="Cumulative">Cumulative Tests</TabsTrigger>
          <TabsTrigger value="ChapterReview">Chapter Tests</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Test List Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold">
                <tr>
                  <th className="px-4 py-3">Test Name</th>
                  <th className="px-4 py-3">Curriculum Course</th>
                  <th className="px-4 py-3">Chapter</th>
                  <th className="px-4 py-3">Questions</th>
                  <th className="px-4 py-3">Learner Attempts</th>
                  <th className="px-4 py-3">Average Score</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTests.map((test) => (
                  <tr key={test.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3">
                      <p className="font-bold text-slate-900">{test.title}</p>
                      <p className="text-[11px] text-slate-400">
                        {test.randomize ? 'Randomized question order' : 'Fixed sequence'}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{test.courseTitle}</td>
                    <td className="px-4 py-3 text-slate-700">{test.chapterTitle}</td>
                    <td className="px-4 py-3 font-semibold text-slate-800">
                      {test.questionsCount} items
                    </td>
                    <td className="px-4 py-3 text-slate-700">{test.attemptsCount.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className="font-bold text-emerald-600">{test.averageScore}%</span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="success" className="text-[10px]">
                        {test.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedTestForQuestions(test)}
                        className="text-blue-600 hover:text-blue-800 text-xs"
                      >
                        Manage Questions
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setTestToDelete(test)}
                        className="text-red-600 hover:bg-red-50 h-7 w-7"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Selected Test Question Management Section */}
      <Card className="mt-8 border-blue-200">
        <CardHeader className="flex flex-row items-center justify-between pb-3 bg-slate-50/70 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <FileQuestion className="h-5 w-5 text-blue-600" />
              <CardTitle>
                Questions for: {selectedTestForQuestions?.title || 'Chapter 1 Vocabulary Test'}
              </CardTitle>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Accepted translation variations and difficulty weights for automated scoring
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => setShowAddQuestionModal(true)}
            className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            + Add Question
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-white text-slate-500 font-semibold">
                <tr>
                  <th className="px-4 py-2.5">#</th>
                  <th className="px-4 py-2.5">English Prompt</th>
                  <th className="px-4 py-2.5">Expected German Answer</th>
                  <th className="px-4 py-2.5">Accepted Synonyms / Variants</th>
                  <th className="px-4 py-2.5">Difficulty</th>
                  <th className="px-4 py-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activeQuestions.map((q, idx) => (
                  <tr key={q.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-mono text-slate-400">{idx + 1}</td>
                    <td className="px-4 py-3 font-semibold text-slate-900">{q.englishPrompt}</td>
                    <td className="px-4 py-3 font-bold text-blue-600">{q.correctGerman}</td>
                    <td className="px-4 py-3 text-slate-600">
                      <div className="flex flex-wrap gap-1">
                        {q.acceptedAnswers.map((ans, aIdx) => (
                          <span
                            key={aIdx}
                            className="bg-slate-100 px-1.5 py-0.5 rounded text-[11px] font-mono text-slate-700"
                          >
                            {ans}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={q.difficulty === 'Easy' ? 'success' : q.difficulty === 'Medium' ? 'warning' : 'destructive'}
                        className="text-[10px]"
                      >
                        {q.difficulty}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteTestQuestion(q.id)}
                        className="text-red-600 hover:bg-red-50 h-7 w-7"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal: Create Test */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogHeader>
          <DialogTitle>Create New Assessment Test</DialogTitle>
          <DialogDescription>
            Configure an automated examination for daily sessions or chapter milestones.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700">Test Title</label>
            <Input
              value={newTestTitle}
              onChange={(e) => setNewTestTitle(e.target.value)}
              placeholder="e.g. Chapter 2 Comprehensive Exam"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700">Test Type</label>
            <select
              value={newTestType}
              onChange={(e) => setNewTestType(e.target.value as TestType)}
              className="w-full rounded-lg border border-slate-300 p-2 text-sm bg-white"
            >
              <option value="Translation">Translation (Daily Batch Test)</option>
              <option value="Cumulative">Cumulative (Multi-day Milestone)</option>
              <option value="ChapterReview">Chapter Review (Comprehensive Final)</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700">Curriculum Chapter</label>
            <select
              value={newTestChapterId}
              onChange={(e) => setNewTestChapterId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 p-2 text-sm bg-white"
            >
              {chapters.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  Ch. {ch.chapterNumber}: {ch.title}
                </option>
              ))}
            </select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowCreateModal(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreateTest} className="bg-blue-600 hover:bg-blue-700">
            Create Test
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Modal: Add Question */}
      <Dialog open={showAddQuestionModal} onOpenChange={setShowAddQuestionModal}>
        <DialogHeader>
          <DialogTitle>Add Test Question</DialogTitle>
          <DialogDescription>
            Specify prompt, correct German formulation, and acceptable variations.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700">English Prompt</label>
            <Input
              value={newPrompt}
              onChange={(e) => setNewPrompt(e.target.value)}
              placeholder="e.g. Table"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700">Expected German Answer</label>
            <Input
              value={newCorrectGerman}
              onChange={(e) => setNewCorrectGerman(e.target.value)}
              placeholder="e.g. der Tisch"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700">
              Accepted Variations (Comma-separated)
            </label>
            <Input
              value={newAcceptedAnswers}
              onChange={(e) => setNewAcceptedAnswers(e.target.value)}
              placeholder="e.g. der Tisch, Tisch"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700">Difficulty</label>
            <select
              value={newDifficulty}
              onChange={(e) => setNewDifficulty(e.target.value as any)}
              className="w-full rounded-lg border border-slate-300 p-2 text-sm bg-white"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowAddQuestionModal(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddQuestion} className="bg-blue-600 hover:bg-blue-700">
            Save Question
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Delete Test confirmation */}
      <ConfirmDialog
        open={!!testToDelete}
        onOpenChange={(open) => !open && setTestToDelete(null)}
        title="Delete Test?"
        description={`Are you sure you want to delete "${testToDelete?.title}"? All associated questions will also be removed.`}
        confirmText="Delete Test"
        variant="destructive"
        onConfirm={() => {
          if (testToDelete) {
            deleteTest(testToDelete.id);
            setTestToDelete(null);
          }
        }}
      />
    </div>
  );
}
