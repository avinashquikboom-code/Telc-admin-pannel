import { RazorpayConfig, PaymentTransaction } from '@/types';
import { RazorpayProvider, VerifySignatureInput } from './providers/razorpay.provider';
import { getIntegrationService } from '../integrations/integration.service';

export interface ProcessPaymentInput {
  orderId: string;
  paymentId: string;
  signature: string;
  userId: string;
  userName: string;
  userEmail: string;
  courseId: string;
  courseTitle: string;
  amount: number;
  currency: string;
  method?: string;
}

export class PaymentService {
  private razorpayProvider: RazorpayProvider;
  private transactions: PaymentTransaction[] = [];
  private processedWebhookIds: Set<string> = new Set(); // Idempotency tracker

  constructor(razorpayConfig: RazorpayConfig) {
    this.razorpayProvider = new RazorpayProvider(razorpayConfig);
    this.seedTransactions();
  }

  public updateConfig(config: RazorpayConfig) {
    this.razorpayProvider.updateConfig(config);
  }

  public getTransactions(): PaymentTransaction[] {
    return [...this.transactions];
  }

  public getTransactionById(id: string): PaymentTransaction | undefined {
    return this.transactions.find((t) => t.id === id || t.paymentId === id);
  }

  /**
   * Verified server-side payment processing:
   * 1. Validate signature HMAC
   * 2. Ensure idempotent recording
   * 3. Return verified course access grant
   */
  public verifyAndCompletePayment(input: ProcessPaymentInput): {
    success: boolean;
    transaction?: PaymentTransaction;
    error?: string;
    courseAccessGranted: boolean;
  } {
    // 1. Verify Signature
    const isValid = this.razorpayProvider.verifyPaymentSignature({
      orderId: input.orderId,
      paymentId: input.paymentId,
      signature: input.signature,
    });

    if (!isValid) {
      return {
        success: false,
        error: 'Invalid Razorpay cryptographic signature. Possible tampering detected.',
        courseAccessGranted: false,
      };
    }

    // 2. Check if already recorded
    const existing = this.transactions.find((t) => t.paymentId === input.paymentId);
    if (existing) {
      return {
        success: true,
        transaction: existing,
        courseAccessGranted: true, // Already granted
      };
    }

    // 3. Record new transaction
    const newTx: PaymentTransaction = {
      id: `tx_${Date.now()}`,
      orderId: input.orderId,
      paymentId: input.paymentId,
      userId: input.userId,
      userName: input.userName,
      userEmail: input.userEmail,
      courseId: input.courseId,
      courseTitle: input.courseTitle,
      amount: input.amount,
      currency: input.currency,
      status: 'SUCCESS',
      method: input.method || 'Credit/Debit Card',
      signatureVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.transactions.unshift(newTx);
    return {
      success: true,
      transaction: newTx,
      courseAccessGranted: true,
    };
  }

  /**
   * Idempotent webhook event processor
   */
  public handleWebhook(
    eventId: string,
    rawBody: string,
    signature: string,
    payload: any
  ): { status: 'PROCESSED' | 'DUPLICATE_IGNORED' | 'SIGNATURE_FAILED' | 'FAILED'; error?: string } {
    // Check idempotency
    if (this.processedWebhookIds.has(eventId)) {
      return { status: 'DUPLICATE_IGNORED' };
    }

    // Verify signature
    const isValid = this.razorpayProvider.verifyWebhookSignature({
      rawBody,
      signature,
    });

    if (!isValid) {
      return { status: 'SIGNATURE_FAILED', error: 'Invalid webhook signature' };
    }

    // Process event payload (e.g. payment.captured, refund.processed)
    const eventType = payload.event;
    if (eventType === 'payment.captured') {
      const paymentEntity = payload.payload?.payment?.entity;
      if (paymentEntity) {
        // Record or update
        const existing = this.transactions.find((t) => t.paymentId === paymentEntity.id);
        if (!existing) {
          this.transactions.unshift({
            id: `tx_${Date.now()}`,
            orderId: paymentEntity.order_id || `ord_${Date.now()}`,
            paymentId: paymentEntity.id,
            userId: paymentEntity.notes?.userId || 'usr_auto',
            userName: paymentEntity.notes?.userName || 'Online Learner',
            userEmail: paymentEntity.email || 'learner@example.com',
            courseId: paymentEntity.notes?.courseId || 'c_1',
            courseTitle: paymentEntity.notes?.courseTitle || 'TELC German B1',
            amount: paymentEntity.amount / 100,
            currency: paymentEntity.currency || 'EUR',
            status: 'SUCCESS',
            method: paymentEntity.method || 'Card/UPI',
            signatureVerified: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
      }
    }

    this.processedWebhookIds.add(eventId);
    return { status: 'PROCESSED' };
  }

  public async refundTransaction(id: string, amount?: number, reason?: string) {
    const txIndex = this.transactions.findIndex((t) => t.id === id || t.paymentId === id);
    if (txIndex === -1) {
      throw new Error('Transaction not found');
    }

    const tx = this.transactions[txIndex];
    const refundAmount = amount || tx.amount;

    await this.razorpayProvider.processRefund(tx.paymentId, refundAmount, reason);

    const updatedTx: PaymentTransaction = {
      ...tx,
      status: 'REFUNDED',
      refundAmount,
      refundReason: reason || 'Customer requested refund via admin dashboard',
      updatedAt: new Date().toISOString(),
    };

    this.transactions[txIndex] = updatedTx;
    return updatedTx;
  }

  private seedTransactions() {
    this.transactions = [
      {
        id: 'tx_101',
        orderId: 'order_TELC_B1_001',
        paymentId: 'pay_N92kz81992',
        userId: 'usr_1',
        userName: 'Lukas Schneider',
        userEmail: 'lukas.schneider@example.de',
        courseId: 'c_1',
        courseTitle: 'TELC Deutsch B1 — Komplettkurs',
        amount: 89.0,
        currency: 'EUR',
        status: 'SUCCESS',
        method: 'Visa •••• 4242 (3D Secure)',
        signatureVerified: true,
        createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
      },
      {
        id: 'tx_102',
        orderId: 'order_TELC_B2_002',
        paymentId: 'pay_M81jx72110',
        userId: 'usr_3',
        userName: 'Matteo Rossi',
        userEmail: 'matteo.rossi@example.it',
        courseId: 'c_2',
        courseTitle: 'TELC Deutsch B2 — Beruf & Prüfung',
        amount: 119.0,
        currency: 'EUR',
        status: 'SUCCESS',
        method: 'Mastercard •••• 5555',
        signatureVerified: true,
        createdAt: new Date(Date.now() - 3600000 * 26).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 26).toISOString(),
      },
      {
        id: 'tx_103',
        orderId: 'order_TELC_A2_003',
        paymentId: 'pay_K70hy61009',
        userId: 'usr_4',
        userName: 'Anna Kowalska',
        userEmail: 'anna.k@example.pl',
        courseId: 'c_3',
        courseTitle: 'TELC Deutsch A2 — Grundstufe',
        amount: 59.0,
        currency: 'EUR',
        status: 'SUCCESS',
        method: 'PayPal / SEPA',
        signatureVerified: true,
        createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
      },
      {
        id: 'tx_104',
        orderId: 'order_TELC_B1_004',
        paymentId: 'pay_J60gx50998',
        userId: 'usr_5',
        userName: 'Carlos Gomez',
        userEmail: 'carlos.g@example.es',
        courseId: 'c_1',
        courseTitle: 'TELC Deutsch B1 — Komplettkurs',
        amount: 89.0,
        currency: 'EUR',
        status: 'REFUNDED',
        method: 'Visa •••• 1881',
        signatureVerified: true,
        refundAmount: 89.0,
        refundReason: 'Accidental duplicate purchase by learner',
        createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 70).toISOString(),
      },
    ];
  }
}

declare global {
  var __telc_payment_service: PaymentService | undefined;
}

export function getPaymentService(): PaymentService {
  if (!globalThis.__telc_payment_service) {
    const integrationService = getIntegrationService();
    const config = integrationService.getRazorpayConfig(false);
    globalThis.__telc_payment_service = new PaymentService(config);
  }
  return globalThis.__telc_payment_service;
}
