import { NextRequest, NextResponse } from 'next/server';
import { initialVocabulary } from '@/lib/mockData';
import { VocabularyWord } from '@/types';

let vocabularyDb: VocabularyWord[] = [...initialVocabulary];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const chapterId = searchParams.get('chapterId');
  const difficulty = searchParams.get('difficulty');
  const pos = searchParams.get('partOfSpeech');
  const status = searchParams.get('status');
  const query = searchParams.get('q')?.toLowerCase();

  let filtered = [...vocabularyDb];
  if (chapterId && chapterId !== 'all') {
    filtered = filtered.filter((w) => w.chapterId === chapterId);
  }
  if (difficulty && difficulty !== 'all') {
    filtered = filtered.filter((w) => w.difficulty === difficulty);
  }
  if (pos && pos !== 'all') {
    filtered = filtered.filter((w) => w.partOfSpeech === pos);
  }
  if (status && status !== 'all') {
    filtered = filtered.filter((w) => w.status === status);
  }
  if (query) {
    filtered = filtered.filter(
      (w) =>
        w.german.toLowerCase().includes(query) ||
        w.english.toLowerCase().includes(query) ||
        w.exampleGerman.toLowerCase().includes(query)
    );
  }

  return NextResponse.json({ success: true, count: filtered.length, data: filtered });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Check if bulk import or single
    if (Array.isArray(body)) {
      const addedWords: VocabularyWord[] = body.map((item, idx) => ({
        id: `v_${Date.now()}_${idx}`,
        courseId: item.courseId || 'course_b1',
        chapterId: item.chapterId,
        chapterTitle: item.chapterTitle || 'Chapter 1',
        german: item.german,
        english: item.english,
        article: item.article || 'none',
        partOfSpeech: item.partOfSpeech || 'Noun',
        pronunciation: item.pronunciation || '',
        audioUrl: item.audioUrl || '',
        difficulty: item.difficulty || 'Easy',
        tags: item.tags || [],
        exampleGerman: item.exampleGerman || '',
        exampleEnglish: item.exampleEnglish || '',
        timesLearned: 0,
        timesTested: 0,
        correctAnswers: 0,
        incorrectAnswers: 0,
        accuracy: 100,
        reviewCount: 0,
        status: item.status || 'active',
        createdAt: new Date().toISOString(),
      }));

      vocabularyDb = [...addedWords, ...vocabularyDb];
      return NextResponse.json({ success: true, count: addedWords.length, data: addedWords }, { status: 201 });
    }

    if (!body.german || !body.english || !body.chapterId) {
      return NextResponse.json({ success: false, error: 'German word, English translation, and Chapter are required.' }, { status: 400 });
    }

    const newWord: VocabularyWord = {
      id: `v_${Date.now()}`,
      courseId: body.courseId || 'course_b1',
      chapterId: body.chapterId,
      chapterTitle: body.chapterTitle || 'Chapter 1',
      german: body.german,
      english: body.english,
      article: body.article || 'none',
      partOfSpeech: body.partOfSpeech || 'Noun',
      pronunciation: body.pronunciation || '',
      audioUrl: body.audioUrl || '',
      difficulty: body.difficulty || 'Easy',
      tags: body.tags || [],
      exampleGerman: body.exampleGerman || '',
      exampleEnglish: body.exampleEnglish || '',
      timesLearned: 0,
      timesTested: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
      accuracy: 100,
      reviewCount: 0,
      status: body.status || 'active',
      createdAt: new Date().toISOString(),
    };

    vocabularyDb = [newWord, ...vocabularyDb];
    return NextResponse.json({ success: true, data: newWord }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to process vocabulary' }, { status: 400 });
  }
}
