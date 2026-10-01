import { NextRequest, NextResponse } from 'next/server';
import { getPaymentService } from '@/services/payment/payment.service';
import { getIntegrationService } from '@/services/integrations/integration.service';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature') || '';
    const eventId = req.headers.get('x-razorpay-event-id') || `wh_evt_${Date.now()}`;

    let parsedPayload: any = {};
    try {
      parsedPayload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: 'Malformed JSON payload' }, { status: 400 });
    }

    const paymentService = getPaymentService();
    const integrationService = getIntegrationService();

    const result = paymentService.handleWebhook(eventId, rawBody, signature, parsedPayload);

    // Record into audit log
    integrationService.addWebhookLog({
      event: parsedPayload.event || 'payment.event',
      provider: 'Razorpay',
      status: result.status,
      retryCount: 0,
      payload: parsedPayload,
      response: { status: result.status, message: 'Webhook processed' },
      error: result.error,
    });

    if (result.status === 'SIGNATURE_FAILED') {
      return NextResponse.json({ error: 'Invalid HMAC signature' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      status: result.status,
      message: result.status === 'DUPLICATE_IGNORED' ? 'Ignored duplicate webhook' : 'Webhook handled successfully',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
