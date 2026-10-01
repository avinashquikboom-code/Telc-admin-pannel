import { NextRequest, NextResponse } from 'next/server';
import { getNotificationService } from '@/services/notification/notification.service';

export async function GET() {
  const service = getNotificationService();
  return NextResponse.json({ success: true, data: service.getRules() });
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const service = getNotificationService();
    const updated = service.updateRule(body.event, body);
    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
