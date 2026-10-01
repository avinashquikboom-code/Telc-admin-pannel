import { NextRequest, NextResponse } from 'next/server';
import { initialChapters } from '@/lib/mockData';

let chaptersDb = [...initialChapters];

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const chapter = chaptersDb.find((c) => c.id === id);
  if (!chapter) {
    return NextResponse.json({ success: false, error: 'Chapter not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: chapter });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const index = chaptersDb.findIndex((c) => c.id === id);
  if (index === -1) {
    return NextResponse.json({ success: false, error: 'Chapter not found' }, { status: 404 });
  }

  const updates = await req.json();
  chaptersDb[index] = {
    ...chaptersDb[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  return NextResponse.json({ success: true, data: chaptersDb[index] });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const index = chaptersDb.findIndex((c) => c.id === id);
  if (index === -1) {
    return NextResponse.json({ success: false, error: 'Chapter not found' }, { status: 404 });
  }

  chaptersDb = chaptersDb.filter((c) => c.id !== id);
  return NextResponse.json({ success: true, message: 'Chapter deleted successfully' });
}
