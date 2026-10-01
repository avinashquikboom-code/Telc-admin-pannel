import { NextRequest, NextResponse } from 'next/server';
import { getPaymentService } from '@/services/payment/payment.service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const service = getPaymentService();

    const result = service.verifyAndCompletePayment({
      orderId: body.orderId,
      paymentId: body.paymentId,
      signature: body.signature,
      userId: body.userId,
      userName: body.userName,
      userEmail: body.userEmail,
      courseId: body.courseId,
      courseTitle: body.courseTitle,
      amount: body.amount,
      currency: body.currency,
      method: body.method,
    });

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      courseAccessGranted: result.courseAccessGranted,
      transaction: result.transaction,
      message: 'Payment verified and course access granted successfully.',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
