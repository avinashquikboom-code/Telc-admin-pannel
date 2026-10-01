import { NextRequest, NextResponse } from 'next/server';
import { initialVocabulary } from '@/lib/mockData';

let vocabularyDb = [...initialVocabulary];

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const word = vocabularyDb.find((w) => w.id === id);
  if (!word) {
    return NextResponse.json({ success: false, error: 'Vocabulary word not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: word });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const index = vocabularyDb.findIndex((w) => w.id === id);
  if (index === -1) {
    return NextResponse.json({ success: false, error: 'Vocabulary word not found' }, { status: 404 });
  }

  const updates = await req.json();
  vocabularyDb[index] = {
    ...vocabularyDb[index],
    ...updates,
  };

  return NextResponse.json({ success: true, data: vocabularyDb[index] });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const index = vocabularyDb.findIndex((w) => w.id === id);
  if (index === -1) {
    return NextResponse.json({ success: false, error: 'Vocabulary word not found' }, { status: 404 });
  }

  vocabularyDb = vocabularyDb.filter((w) => w.id !== id);
  return NextResponse.json({ success: true, message: 'Vocabulary word deleted successfully' });
}
