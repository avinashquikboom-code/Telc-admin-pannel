import { NextRequest, NextResponse } from 'next/server';
import { getIntegrationService } from '@/services/integrations/integration.service';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;
  const service = getIntegrationService();

  switch (provider.toLowerCase()) {
    case 'whatsapp':
      return NextResponse.json({ success: true, data: service.getWhatsAppConfig(true) });
    case 'email':
      return NextResponse.json({ success: true, data: service.getEmailConfig(true) });
    case 'msg91':
      return NextResponse.json({ success: true, data: service.getMsg91Config(true) });
    case 'razorpay':
      return NextResponse.json({ success: true, data: service.getRazorpayConfig(true) });
    default:
      return NextResponse.json({ success: false, error: 'Unknown integration provider' }, { status: 400 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  try {
    const { provider } = await params;
    const body = await req.json();
    const service = getIntegrationService();

    switch (provider.toLowerCase()) {
      case 'whatsapp': {
        const updated = service.updateWhatsAppConfig(body);
        return NextResponse.json({ success: true, message: 'WhatsApp configuration updated', data: updated });
      }
      case 'email': {
        const updated = service.updateEmailConfig(body);
        return NextResponse.json({ success: true, message: 'Email configuration updated', data: updated });
      }
      case 'msg91': {
        const updated = service.updateMsg91Config(body);
        return NextResponse.json({ success: true, message: 'MSG91 configuration updated', data: updated });
      }
      case 'razorpay': {
        const updated = service.updateRazorpayConfig(body);
        return NextResponse.json({ success: true, message: 'Razorpay configuration updated', data: updated });
      }
      default:
        return NextResponse.json({ success: false, error: 'Unknown integration provider' }, { status: 400 });
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
