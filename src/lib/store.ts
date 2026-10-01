'use client';

import { useState, useEffect } from 'react';
import {
  AdminUser,
  AdminRole,
  Course,
  Chapter,
  VocabularyWord,
  LearningSessionConfig,
  LearningSequenceRule,
  Test,
  TestQuestion,
  ReviewSettingsConfig,
  Learner,
  NotificationItem,
  PlatformAnalytics,
} from '@/types';
import {
  initialAdminUser,
  initialCourses,
  initialChapters,
  initialVocabulary,
  initialLearningSessions,
  initialLearningSequence,
  initialReviewSettings,
  initialTests,
  initialTestQuestions,
  initialLearners,
  initialNotifications,
  initialAnalytics,
} from './mockData';

// Local storage keys
const STORAGE_KEYS = {
  ADMIN: 'telc_admin_user',
  COURSES: 'telc_admin_courses',
  CHAPTERS: 'telc_admin_chapters',
  VOCABULARY: 'telc_admin_vocabulary',
  LEARNING_SESSIONS: 'telc_admin_learning_sessions',
  LEARNING_SEQUENCE: 'telc_admin_learning_sequence',
  REVIEW_SETTINGS: 'telc_admin_review_settings',
  TESTS: 'telc_admin_tests',
  TEST_QUESTIONS: 'telc_admin_test_questions',
  LEARNERS: 'telc_admin_learners',
  NOTIFICATIONS: 'telc_admin_notifications',
  AUTH_TOKEN: 'telc_admin_token',
};

// Singleton in-memory store fallback for SSR & initial state
let memoryState = {
  adminUser: initialAdminUser,
  courses: initialCourses,
  chapters: initialChapters,
  vocabulary: initialVocabulary,
  learningSessions: initialLearningSessions,
  learningSequence: initialLearningSequence,
  reviewSettings: initialReviewSettings,
  tests: initialTests,
  testQuestions: initialTestQuestions,
  learners: initialLearners,
  notifications: initialNotifications,
  analytics: initialAnalytics,
};

function getStorageItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setStorageItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}

// React custom hook for state access & reactivity
export function useAdminStore() {
  const [adminUser, setAdminUserState] = useState<AdminUser>(initialAdminUser);
  const [courses, setCoursesState] = useState<Course[]>(initialCourses);
  const [chapters, setChaptersState] = useState<Chapter[]>(initialChapters);
  const [vocabulary, setVocabularyState] = useState<VocabularyWord[]>(initialVocabulary);
  const [learningSessions, setLearningSessionsState] = useState<LearningSessionConfig[]>(initialLearningSessions);
  const [learningSequence, setLearningSequenceState] = useState<LearningSequenceRule>(initialLearningSequence);
  const [reviewSettings, setReviewSettingsState] = useState<ReviewSettingsConfig>(initialReviewSettings);
  const [tests, setTestsState] = useState<Test[]>(initialTests);
  const [testQuestions, setTestQuestionsState] = useState<TestQuestion[]>(initialTestQuestions);
  const [learners, setLearnersState] = useState<Learner[]>(initialLearners);
  const [notifications, setNotificationsState] = useState<NotificationItem[]>(initialNotifications);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setAdminUserState(getStorageItem(STORAGE_KEYS.ADMIN, initialAdminUser));
    setCoursesState(getStorageItem(STORAGE_KEYS.COURSES, initialCourses));
    setChaptersState(getStorageItem(STORAGE_KEYS.CHAPTERS, initialChapters));
    setVocabularyState(getStorageItem(STORAGE_KEYS.VOCABULARY, initialVocabulary));
    setLearningSessionsState(getStorageItem(STORAGE_KEYS.LEARNING_SESSIONS, initialLearningSessions));
    setLearningSequenceState(getStorageItem(STORAGE_KEYS.LEARNING_SEQUENCE, initialLearningSequence));
    setReviewSettingsState(getStorageItem(STORAGE_KEYS.REVIEW_SETTINGS, initialReviewSettings));
    setTestsState(getStorageItem(STORAGE_KEYS.TESTS, initialTests));
    setTestQuestionsState(getStorageItem(STORAGE_KEYS.TEST_QUESTIONS, initialTestQuestions));
    setLearnersState(getStorageItem(STORAGE_KEYS.LEARNERS, initialLearners));
    setNotificationsState(getStorageItem(STORAGE_KEYS.NOTIFICATIONS, initialNotifications));
    setIsLoaded(true);
  }, []);

  // Course Actions
  const addCourse = (course: Omit<Course, 'id' | 'createdAt' | 'updatedAt' | 'totalChapters' | 'totalVocabulary' | 'learnersCount' | 'completionRate'>) => {
    const newCourse: Course = {
      ...course,
      id: `course_${Date.now()}`,
      totalChapters: 0,
      totalVocabulary: 0,
      learnersCount: 0,
      completionRate: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [newCourse, ...courses];
    setCoursesState(updated);
    setStorageItem(STORAGE_KEYS.COURSES, updated);
    return newCourse;
  };

  const updateCourse = (id: string, updates: Partial<Course>) => {
    const updated = courses.map((c) => (c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c));
    setCoursesState(updated);
    setStorageItem(STORAGE_KEYS.COURSES, updated);
  };

  const deleteCourse = (id: string) => {
    const updated = courses.filter((c) => c.id !== id);
    setCoursesState(updated);
    setStorageItem(STORAGE_KEYS.COURSES, updated);
  };

  const duplicateCourse = (id: string) => {
    const existing = courses.find((c) => c.id === id);
    if (!existing) return;
    const duplicated: Course = {
      ...existing,
      id: `course_${Date.now()}`,
      title: `${existing.title} (Copy)`,
      status: 'draft',
      learnersCount: 0,
      completionRate: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [duplicated, ...courses];
    setCoursesState(updated);
    setStorageItem(STORAGE_KEYS.COURSES, updated);
  };

  // Chapter Actions
  const addChapter = (chapter: Omit<Chapter, 'id' | 'createdAt' | 'updatedAt' | 'totalWords' | 'completedLearners'>) => {
    const newChapter: Chapter = {
      ...chapter,
      id: `chap_${Date.now()}`,
      totalWords: 0,
      completedLearners: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [...chapters, newChapter];
    setChaptersState(updated);
    setStorageItem(STORAGE_KEYS.CHAPTERS, updated);

    // Update course total chapters
    const course = courses.find((c) => c.id === chapter.courseId);
    if (course) {
      updateCourse(course.id, { totalChapters: course.totalChapters + 1 });
    }
    return newChapter;
  };

  const updateChapter = (id: string, updates: Partial<Chapter>) => {
    const updated = chapters.map((ch) => (ch.id === id ? { ...ch, ...updates, updatedAt: new Date().toISOString() } : ch));
    setChaptersState(updated);
    setStorageItem(STORAGE_KEYS.CHAPTERS, updated);
  };

  const deleteChapter = (id: string) => {
    const chapterToDelete = chapters.find((ch) => ch.id === id);
    const updated = chapters.filter((ch) => ch.id !== id);
    setChaptersState(updated);
    setStorageItem(STORAGE_KEYS.CHAPTERS, updated);
    if (chapterToDelete) {
      const course = courses.find((c) => c.id === chapterToDelete.courseId);
      if (course && course.totalChapters > 0) {
        updateCourse(course.id, { totalChapters: course.totalChapters - 1 });
      }
    }
  };

  // Vocabulary Actions
  const addVocabulary = (word: Omit<VocabularyWord, 'id' | 'createdAt' | 'timesLearned' | 'timesTested' | 'correctAnswers' | 'incorrectAnswers' | 'accuracy' | 'reviewCount'>) => {
    const newWord: VocabularyWord = {
      ...word,
      id: `v_${Date.now()}`,
      timesLearned: 0,
      timesTested: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
      accuracy: 100,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
    };
    const updated = [newWord, ...vocabulary];
    setVocabularyState(updated);
    setStorageItem(STORAGE_KEYS.VOCABULARY, updated);

    // Update chapter word count
    const chapter = chapters.find((ch) => ch.id === word.chapterId);
    if (chapter) {
      updateChapter(chapter.id, { totalWords: chapter.totalWords + 1 });
    }
    return newWord;
  };

  const bulkAddVocabulary = (words: Omit<VocabularyWord, 'id' | 'createdAt' | 'timesLearned' | 'timesTested' | 'correctAnswers' | 'incorrectAnswers' | 'accuracy' | 'reviewCount'>[]) => {
    const newWords: VocabularyWord[] = words.map((w, idx) => ({
      ...w,
      id: `v_${Date.now()}_${idx}`,
      timesLearned: 0,
      timesTested: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
      accuracy: 100,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
    }));
    const updated = [...newWords, ...vocabulary];
    setVocabularyState(updated);
    setStorageItem(STORAGE_KEYS.VOCABULARY, updated);
    return newWords;
  };

  const updateVocabulary = (id: string, updates: Partial<VocabularyWord>) => {
    const updated = vocabulary.map((v) => (v.id === id ? { ...v, ...updates } : v));
    setVocabularyState(updated);
    setStorageItem(STORAGE_KEYS.VOCABULARY, updated);
  };

  const deleteVocabulary = (id: string) => {
    const word = vocabulary.find((v) => v.id === id);
    const updated = vocabulary.filter((v) => v.id !== id);
    setVocabularyState(updated);
    setStorageItem(STORAGE_KEYS.VOCABULARY, updated);
    if (word) {
      const chapter = chapters.find((ch) => ch.id === word.chapterId);
      if (chapter && chapter.totalWords > 0) {
        updateChapter(chapter.id, { totalWords: chapter.totalWords - 1 });
      }
    }
  };

  // Learning sequence & session settings
  const updateLearningSequence = (rules: Partial<LearningSequenceRule>) => {
    const updated = { ...learningSequence, ...rules };
    setLearningSequenceState(updated);
    setStorageItem(STORAGE_KEYS.LEARNING_SEQUENCE, updated);
  };

  const updateLearningSession = (id: string, updates: Partial<LearningSessionConfig>) => {
    const updated = learningSessions.map((s) => (s.id === id ? { ...s, ...updates } : s));
    setLearningSessionsState(updated);
    setStorageItem(STORAGE_KEYS.LEARNING_SESSIONS, updated);
  };

  // Review settings
  const updateReviewSettings = (settings: Partial<ReviewSettingsConfig>) => {
    const updated = { ...reviewSettings, ...settings };
    setReviewSettingsState(updated);
    setStorageItem(STORAGE_KEYS.REVIEW_SETTINGS, updated);
  };

  // Tests
  const addTest = (test: Omit<Test, 'id' | 'createdAt' | 'attemptsCount' | 'averageScore'>) => {
    const newTest: Test = {
      ...test,
      id: `test_${Date.now()}`,
      attemptsCount: 0,
      averageScore: 0,
      createdAt: new Date().toISOString(),
    };
    const updated = [newTest, ...tests];
    setTestsState(updated);
    setStorageItem(STORAGE_KEYS.TESTS, updated);
    return newTest;
  };

  const updateTest = (id: string, updates: Partial<Test>) => {
    const updated = tests.map((t) => (t.id === id ? { ...t, ...updates } : t));
    setTestsState(updated);
    setStorageItem(STORAGE_KEYS.TESTS, updated);
  };

  const deleteTest = (id: string) => {
    const updated = tests.filter((t) => t.id !== id);
    setTestsState(updated);
    setStorageItem(STORAGE_KEYS.TESTS, updated);
  };

  // Test Questions
  const addTestQuestion = (question: Omit<TestQuestion, 'id'>) => {
    const newQ: TestQuestion = {
      ...question,
      id: `tq_${Date.now()}`,
    };
    const updated = [...testQuestions, newQ];
    setTestQuestionsState(updated);
    setStorageItem(STORAGE_KEYS.TEST_QUESTIONS, updated);
    return newQ;
  };

  const deleteTestQuestion = (id: string) => {
    const updated = testQuestions.filter((q) => q.id !== id);
    setTestQuestionsState(updated);
    setStorageItem(STORAGE_KEYS.TEST_QUESTIONS, updated);
  };

  // Learners
  const updateLearnerStatus = (id: string, status: 'active' | 'suspended' | 'inactive') => {
    const updated = learners.map((l) => (l.id === id ? { ...l, status } : l));
    setLearnersState(updated);
    setStorageItem(STORAGE_KEYS.LEARNERS, updated);
  };

  const resetLearnerProgress = (id: string) => {
    const updated = learners.map((l) =>
      l.id === id
        ? {
            ...l,
            progressPercentage: 0,
            wordsLearned: 0,
            wordsReviewed: 0,
            testsCompleted: 0,
            averageScore: 0,
          }
        : l
    );
    setLearnersState(updated);
    setStorageItem(STORAGE_KEYS.LEARNERS, updated);
  };

  // Notifications
  const addNotification = (notif: Omit<NotificationItem, 'id' | 'readCount'>) => {
    const newNotif: NotificationItem = {
      ...notif,
      id: `notif_${Date.now()}`,
      readCount: 0,
      sentAt: notif.status === 'Sent' ? new Date().toISOString() : undefined,
    };
    const updated = [newNotif, ...notifications];
    setNotificationsState(updated);
    setStorageItem(STORAGE_KEYS.NOTIFICATIONS, updated);
    return newNotif;
  };

  // Admin user & role switching (for permission testing)
  const updateAdminRole = (role: AdminRole) => {
    const updated = { ...adminUser, role };
    setAdminUserState(updated);
    setStorageItem(STORAGE_KEYS.ADMIN, updated);
  };

  const updateAdminProfile = (updates: Partial<AdminUser>) => {
    const updated = { ...adminUser, ...updates };
    setAdminUserState(updated);
    setStorageItem(STORAGE_KEYS.ADMIN, updated);
  };

  return {
    isLoaded,
    adminUser,
    updateAdminRole,
    updateAdminProfile,
    courses,
    addCourse,
    updateCourse,
    deleteCourse,
    duplicateCourse,
    chapters,
    addChapter,
    updateChapter,
    deleteChapter,
    vocabulary,
    addVocabulary,
    bulkAddVocabulary,
    updateVocabulary,
    deleteVocabulary,
    learningSessions,
    updateLearningSession,
    learningSequence,
    updateLearningSequence,
    reviewSettings,
    updateReviewSettings,
    tests,
    addTest,
    updateTest,
    deleteTest,
    testQuestions,
    addTestQuestion,
    deleteTestQuestion,
    learners,
    updateLearnerStatus,
    resetLearnerProgress,
    notifications,
    addNotification,
    analytics: initialAnalytics,
  };
}
