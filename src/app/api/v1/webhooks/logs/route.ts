import { NextResponse } from 'next/server';
import { getIntegrationService } from '@/services/integrations/integration.service';

export async function GET() {
  const service = getIntegrationService();
  return NextResponse.json({ success: true, data: service.getWebhookLogs() });
}
