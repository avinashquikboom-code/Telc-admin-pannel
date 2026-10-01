import { NextRequest, NextResponse } from 'next/server';
import { initialCourses } from '@/lib/mockData';
import { Course } from '@/types';

let coursesDb: Course[] = [...initialCourses];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const level = searchParams.get('level');
  const status = searchParams.get('status');
  const query = searchParams.get('q')?.toLowerCase();

  let filtered = [...coursesDb];
  if (level && level !== 'all') {
    filtered = filtered.filter((c) => c.level === level);
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
    if (!body.title || !body.level) {
      return NextResponse.json({ success: false, error: 'Course name and level are required.' }, { status: 400 });
    }

    const newCourse: Course = {
      id: `course_${Date.now()}`,
      title: body.title,
      level: body.level,
      description: body.description || '',
      translationLanguage: body.translationLanguage || 'English',
      totalChapters: 0,
      totalVocabulary: 0,
      learnersCount: 0,
      completionRate: 0,
      status: body.status || 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    coursesDb = [newCourse, ...coursesDb];
    return NextResponse.json({ success: true, data: newCourse }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Invalid request body' }, { status: 400 });
  }
}
