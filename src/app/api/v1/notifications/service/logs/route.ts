import { NextRequest, NextResponse } from 'next/server';
import { getNotificationService } from '@/services/notification/notification.service';

export async function GET(req: NextRequest) {
  const service = getNotificationService();
  const searchParams = req.nextUrl.searchParams;
  const channel = searchParams.get('channel');
  const status = searchParams.get('status');
  const event = searchParams.get('event');
  const search = searchParams.get('search');

  let logs = service.getLogs();

  if (channel && channel !== 'ALL') {
    logs = logs.filter((l) => l.channel === channel);
  }
  if (status && status !== 'ALL') {
    logs = logs.filter((l) => l.status === status);
  }
  if (event && event !== 'ALL') {
    logs = logs.filter((l) => l.event === event);
  }
  if (search) {
    const q = search.toLowerCase();
    logs = logs.filter(
      (l) =>
        l.userName.toLowerCase().includes(q) ||
        (l.userEmail && l.userEmail.toLowerCase().includes(q)) ||
        (l.userPhone && l.userPhone.includes(q)) ||
        l.message.toLowerCase().includes(q)
    );
  }

  return NextResponse.json({ success: true, count: logs.length, data: logs });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const service = getNotificationService();

    const { event, recipient, context } = body;
    const result = await service.dispatch(event, recipient, context || {});

    return NextResponse.json({
      success: true,
      message: `Dispatched across channels: ${result.dispatchedChannels.join(', ')}`,
      data: result,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
