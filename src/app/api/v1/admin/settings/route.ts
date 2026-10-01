import { NextRequest, NextResponse } from 'next/server';
import { initialLearningSequence, initialReviewSettings } from '@/lib/mockData';

let settingsDb = {
  general: {
    appName: 'TELC Mastery',
    defaultLanguage: 'German (Deutsch)',
    timezone: 'Europe/Berlin (UTC+01:00)',
    supportEmail: 'support@telcmastery.com',
  },
  learning: initialLearningSequence,
  review: initialReviewSettings,
};

export async function GET() {
  return NextResponse.json({ success: true, data: settingsDb });
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    settingsDb = {
      ...settingsDb,
      ...body,
    };
    return NextResponse.json({ success: true, data: settingsDb, message: 'Settings successfully updated' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update settings' }, { status: 400 });
  }
}
