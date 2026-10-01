export type AdminRole = 'SUPER_ADMIN' | 'CONTENT_ADMIN' | 'SUPPORT_ADMIN';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  avatarUrl?: string;
  lastLogin: string;
}

export type CourseLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
export type PublishingStatus = 'draft' | 'published' | 'archived';

export interface Course {
  id: string;
  title: string;
  level: CourseLevel;
  description: string;
  translationLanguage: string;
  totalChapters: number;
  totalVocabulary: number;
  learnersCount: number;
  completionRate: number;
  status: PublishingStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Chapter {
  id: string;
  courseId: string;
  courseTitle?: string;
  chapterNumber: number;
  title: string;
  description: string;
  daysCount: number;
  dailyWordTarget: number;
  reviewEnabled: boolean;
  totalWords: number;
  completedLearners: number;
  status: PublishingStatus;
  createdAt: string;
  updatedAt: string;
}

export type PartOfSpeech = 'Noun' | 'Verb' | 'Adjective' | 'Adverb' | 'Preposition' | 'Phrase';
export type GermanArticle = 'der' | 'die' | 'das' | 'none';
export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

export interface VocabularyWord {
  id: string;
  courseId: string;
  chapterId: string;
  chapterTitle?: string;
  german: string;
  english: string;
  article: GermanArticle;
  partOfSpeech: PartOfSpeech;
  pronunciation?: string;
  audioUrl?: string;
  difficulty: DifficultyLevel;
  tags: string[];
  exampleGerman: string;
  exampleEnglish: string;
  timesLearned: number;
  timesTested: number;
  correctAnswers: number;
  incorrectAnswers: number;
  accuracy: number;
  reviewCount: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface LearningSessionConfig {
  id: string;
  courseId: string;
  chapterId: string;
  dayNumber: number;
  newWordsCount: number;
  previousWordsCount: number;
  totalWordsCount: number;
  durationMinutes: number;
  cumulativeTestEnabled: boolean;
  reviewPreviousEnabled: boolean;
  status: 'active' | 'inactive';
}

export interface LearningSequenceRule {
  wordsPerBatch: number; // e.g. 4
  dailyTarget: number; // e.g. 20
  learningTimeMinutes: number; // e.g. 3
  randomizeQuestions: boolean;
  cumulativeTestEnabled: boolean;
  repeatUntilTarget: boolean;
}

export type TestType = 'Translation' | 'Cumulative' | 'ChapterReview';
export type QuestionSelection = 'Automatic' | 'Manual';

export interface Test {
  id: string;
  title: string;
  type: TestType;
  courseId: string;
  courseTitle?: string;
  chapterId: string;
  chapterTitle?: string;
  questionSelection: QuestionSelection;
  randomize: boolean;
  questionsCount: number;
  attemptsCount: number;
  averageScore: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface TestQuestion {
  id: string;
  testId: string;
  englishPrompt: string;
  correctGerman: string;
  questionType: 'Translation' | 'MultipleChoice';
  acceptedAnswers: string[];
  difficulty: DifficultyLevel;
  orderIndex: number;
}

export interface ReviewSettingsConfig {
  reviewPreviousWords: boolean;
  selectionStrategy: 'Automatic' | 'Manual';
  maxPreviousWords: number;
  reviewFrequency: 'Daily' | 'Custom';
  randomOrder: boolean;
  chapterReview: boolean;
  overallReview: boolean;
  newWordsPerDay: number;
}

export interface Learner {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  courseId: string;
  courseName: string;
  chapterId: string;
  chapterName: string;
  progressPercentage: number;
  wordsLearned: number;
  wordsReviewed: number;
  testsCompleted: number;
  averageScore: number;
  lastActive: string;
  status: 'active' | 'suspended' | 'inactive';
  joinedDate: string;
}

export interface LearnerHistoryItem {
  id: string;
  dayNumber: number;
  date: string;
  newWordsLearned: number;
  wordsReviewed: number;
  testScore: number;
  timeSpentMinutes: number;
  status: 'completed' | 'in_progress' | 'skipped';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  audience: 'All Users' | 'B1 Course' | 'Inactive Users' | 'A2 Course';
  type: 'Push' | 'In-App';
  status: 'Sent' | 'Scheduled';
  scheduledAt?: string;
  sentAt?: string;
  targetCount: number;
  readCount: number;
}

export interface PlatformAnalytics {
  totalLearners: number;
  activeLearners: number;
  totalCourses: number;
  totalChapters: number;
  totalVocabulary: number;
  completedSessions: number;
  learnersGrowth: number;
  sessionsToday: number;
  avgCompletionRate: number;
  dailyActiveLearners: number;
  weeklyActiveLearners: number;
  wordsLearnedTotal: number;
  wordsReviewedTotal: number;
  testsCompletedTotal: number;
  avgTestScore: number;
}
