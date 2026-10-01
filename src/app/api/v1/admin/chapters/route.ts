import { NextRequest, NextResponse } from 'next/server';
import { initialChapters } from '@/lib/mockData';
import { Chapter } from '@/types';

let chaptersDb: Chapter[] = [...initialChapters];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get('courseId');
  const status = searchParams.get('status');
  const query = searchParams.get('q')?.toLowerCase();

  let filtered = [...chaptersDb];
  if (courseId && courseId !== 'all') {
    filtered = filtered.filter((c) => c.courseId === courseId);
  }
  if (status && status !== 'all') {
    filtered = filtered.filter((c) => c.status === status);
  }
  if (query) {
    filtered = filtered.filter((c) => c.title.toLowerCase().includes(query) || c.description.toLowerCase().includes(query));
  }

  return NextResponse.json({ success: true, count: filtered.length, data: filtered });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.title || !body.courseId) {
      return NextResponse.json({ success: false, error: 'Title and Course ID are required.' }, { status: 400 });
    }

    const newChapter: Chapter = {
      id: `chap_${Date.now()}`,
      courseId: body.courseId,
      courseTitle: body.courseTitle || 'B1 German Vocabulary',
      chapterNumber: Number(body.chapterNumber) || chaptersDb.length + 1,
      title: body.title,
      description: body.description || '',
      daysCount: Number(body.daysCount) || 7,
      dailyWordTarget: Number(body.dailyWordTarget) || 20,
      reviewEnabled: body.reviewEnabled !== undefined ? Boolean(body.reviewEnabled) : true,
      totalWords: 0,
      completedLearners: 0,
      status: body.status || 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    chaptersDb = [...chaptersDb, newChapter];
    return NextResponse.json({ success: true, data: newChapter }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Invalid chapter payload' }, { status: 400 });
  }
}
