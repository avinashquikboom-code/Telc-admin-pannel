import { NextRequest, NextResponse } from 'next/server';
import { getIntegrationService } from '@/services/integrations/integration.service';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  try {
    const { provider } = await params;
    const service = getIntegrationService();

    let result;
    switch (provider.toLowerCase()) {
      case 'whatsapp':
        result = await service.testWhatsAppConnection();
        break;
      case 'email':
        result = await service.testEmailConnection();
        break;
      case 'msg91':
        result = await service.testMsg91Connection();
        break;
      case 'razorpay':
        result = await service.testRazorpayConnection();
        break;
      default:
        return NextResponse.json({ success: false, error: 'Unknown provider' }, { status: 400 });
    }

    return NextResponse.json({
      success: result.success,
      message: result.message,
      latencyMs: result.latencyMs,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
