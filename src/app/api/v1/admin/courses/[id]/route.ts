import { NextRequest, NextResponse } from 'next/server';
import { initialCourses } from '@/lib/mockData';

let coursesDb = [...initialCourses];

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const course = coursesDb.find((c) => c.id === id);
  if (!course) {
    return NextResponse.json({ success: false, error: 'Course not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: course });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const courseIdx = coursesDb.findIndex((c) => c.id === id);
  if (courseIdx === -1) {
    return NextResponse.json({ success: false, error: 'Course not found' }, { status: 404 });
  }

  const updates = await req.json();
  coursesDb[courseIdx] = {
    ...coursesDb[courseIdx],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  return NextResponse.json({ success: true, data: coursesDb[courseIdx] });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const courseIdx = coursesDb.findIndex((c) => c.id === id);
  if (courseIdx === -1) {
    return NextResponse.json({ success: false, error: 'Course not found' }, { status: 404 });
  }

  coursesDb = coursesDb.filter((c) => c.id !== id);
  return NextResponse.json({ success: true, message: 'Course deleted successfully' });
}
