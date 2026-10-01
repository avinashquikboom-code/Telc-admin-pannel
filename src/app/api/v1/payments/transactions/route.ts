import { NextRequest, NextResponse } from 'next/server';
import { getPaymentService } from '@/services/payment/payment.service';

export async function GET() {
  const service = getPaymentService();
  return NextResponse.json({ success: true, data: service.getTransactions() });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { transactionId, amount, reason } = body;
    const service = getPaymentService();

    const refunded = await service.refundTransaction(transactionId, amount, reason);
    return NextResponse.json({
      success: true,
      message: `Transaction ${refunded.paymentId} has been successfully refunded.`,
      data: refunded,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
