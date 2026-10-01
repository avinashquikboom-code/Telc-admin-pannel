import { NextResponse } from 'next/server';
import { initialAnalytics, activityTrend7Days, initialVocabulary, initialChapters } from '@/lib/mockData';

export async function GET() {
  const vocabularyAccuracy = initialVocabulary.map((v) => ({
    id: v.id,
    word: v.german,
    translation: v.english,
    attempts: v.timesTested,
    correct: v.correctAnswers,
    incorrect: v.incorrectAnswers,
    accuracy: v.accuracy,
    reviewCount: v.reviewCount,
    difficulty: v.difficulty,
  }));

  const chapterFunnels = initialChapters.map((ch) => ({
    id: ch.id,
    title: ch.title,
    enrolled: ch.completedLearners + 200,
    started: ch.completedLearners + 120,
    completed: ch.completedLearners,
    avgScore: 86.5,
    avgDays: 6.8,
  }));

  return NextResponse.json({
    success: true,
    data: {
      metrics: initialAnalytics,
      trend: activityTrend7Days,
      vocabularyStats: vocabularyAccuracy,
      chapterFunnels,
    },
  });
}
