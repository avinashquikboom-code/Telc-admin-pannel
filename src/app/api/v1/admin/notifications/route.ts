import { NextRequest, NextResponse } from 'next/server';
import { initialNotifications } from '@/lib/mockData';
import { NotificationItem } from '@/types';

let notificationsDb: NotificationItem[] = [...initialNotifications];

export async function GET() {
  return NextResponse.json({ success: true, count: notificationsDb.length, data: notificationsDb });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.title || !body.message) {
      return NextResponse.json({ success: false, error: 'Title and message are required' }, { status: 400 });
    }

    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: body.title,
      message: body.message,
      audience: body.audience || 'All Users',
      type: body.type || 'Push',
      status: body.scheduleType === 'Schedule' ? 'Scheduled' : 'Sent',
      scheduledAt: body.scheduleType === 'Schedule' ? body.scheduledAt : undefined,
      sentAt: body.scheduleType !== 'Schedule' ? new Date().toISOString() : undefined,
      targetCount: body.audience === 'All Users' ? 2450 : body.audience === 'B1 Course' ? 1250 : 380,
      readCount: 0,
    };

    notificationsDb = [newNotif, ...notificationsDb];
    return NextResponse.json({ success: true, data: newNotif }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create notification' }, { status: 400 });
  }
}
