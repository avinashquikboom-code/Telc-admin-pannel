import { NextRequest, NextResponse } from 'next/server';
import { initialLearners } from '@/lib/mockData';
import { Learner } from '@/types';

let learnersDb: Learner[] = [...initialLearners];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get('courseId');
  const status = searchParams.get('status');
  const query = searchParams.get('q')?.toLowerCase();

  let filtered = [...learnersDb];
  if (courseId && courseId !== 'all') {
    filtered = filtered.filter((l) => l.courseId === courseId);
  }
  if (status && status !== 'all') {
    filtered = filtered.filter((l) => l.status === status);
  }
  if (query) {
    filtered = filtered.filter((l) => l.name.toLowerCase().includes(query) || l.email.toLowerCase().includes(query));
  }

  return NextResponse.json({ success: true, count: filtered.length, data: filtered });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newLearner: Learner = {
      id: `usr_${Date.now()}`,
      name: body.name,
      email: body.email,
      avatarUrl: body.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      courseId: body.courseId || 'course_b1',
      courseName: body.courseName || 'B1 German Vocabulary',
      chapterId: body.chapterId || 'chap_b1_1',
      chapterName: body.chapterName || 'Chapter 1: Wohnen & Umgebung',
      progressPercentage: 0,
      wordsLearned: 0,
      wordsReviewed: 0,
      testsCompleted: 0,
      averageScore: 0,
      lastActive: new Date().toISOString(),
      status: 'active',
      joinedDate: new Date().toISOString(),
    };

    learnersDb = [newLearner, ...learnersDb];
    return NextResponse.json({ success: true, data: newLearner }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create learner' }, { status: 400 });
  }
}
