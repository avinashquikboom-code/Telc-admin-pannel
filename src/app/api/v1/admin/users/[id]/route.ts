import { NextRequest, NextResponse } from 'next/server';
import { initialLearners, initialLearnerHistory } from '@/lib/mockData';

let learnersDb = [...initialLearners];

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const learner = learnersDb.find((l) => l.id === id);
  if (!learner) {
    return NextResponse.json({ success: false, error: 'Learner not found' }, { status: 404 });
  }
  return NextResponse.json({
    success: true,
    data: {
      profile: learner,
      history: initialLearnerHistory,
    },
  });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const index = learnersDb.findIndex((l) => l.id === id);
  if (index === -1) {
    return NextResponse.json({ success: false, error: 'Learner not found' }, { status: 404 });
  }

  const updates = await req.json();
  learnersDb[index] = {
    ...learnersDb[index],
    ...updates,
  };

  return NextResponse.json({ success: true, data: learnersDb[index] });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  learnersDb = learnersDb.filter((l) => l.id !== id);
  return NextResponse.json({ success: true, message: 'Learner removed' });
}
