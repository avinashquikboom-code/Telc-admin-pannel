import {
  WhatsAppConfig,
  EmailConfig,
  Msg91Config,
  RazorpayConfig,
  WebhookEvent,
} from '@/types';
import { WhatsAppProvider } from '../notification/providers/whatsapp.provider';
import { EmailProvider } from '../notification/providers/email.provider';
import { SmsProvider } from '../notification/providers/sms.provider';
import { RazorpayProvider } from '../payment/providers/razorpay.provider';

export interface SafeMetadataResult {
  provider: string;
  connected: boolean;
  enabled: boolean;
  mode?: string;
  lastChecked: string;
}

export class IntegrationService {
  private whatsappConfig: WhatsAppConfig;
  private emailConfig: EmailConfig;
  private msg91Config: Msg91Config;
  private razorpayConfig: RazorpayConfig;
  private webhookLogs: WebhookEvent[] = [];

  constructor() {
    // Initial server-side configs with defaults
    this.whatsappConfig = {
      enabled: true,
      phoneNumberId: '109849201948102',
      wabaId: '392019482019482',
      accessToken: 'EAAG8401928301923kjsd819230',
      webhookVerifyToken: 'telc_meta_webhook_secret_992',
      apiVersion: 'v21.0',
      defaultTemplate: 'learning_reminder_v1',
      testPhone: '+49 151 23456789',
      features: {
        otp: true,
        welcome: true,
        enrollment: true,
        learningReminder: true,
        reviewReminder: true,
        testCompletion: true,
        paymentConfirmation: true,
        adminTriggered: true,
      },
      status: 'connected',
      lastChecked: new Date().toISOString(),
    };

    this.emailConfig = {
      enabled: true,
      provider: 'smtp',
      smtpHost: 'smtp.mailgun.org',
      smtpPort: 587,
      username: 'postmaster@mg.telcmastery.de',
      password: 'smtp_secure_password_99',
      apiKey: '',
      fromName: 'TELC Mastery Team',
      fromEmail: 'noreply@telcmastery.de',
      replyTo: 'support@telcmastery.de',
      status: 'connected',
      lastChecked: new Date().toISOString(),
    };

    this.msg91Config = {
      enabled: true,
      authKey: '391029Asd920192830192',
      senderId: 'TELCDE',
      dltTemplateId: '1107161829019283',
      otpTemplateId: '1107161829019284',
      countryCode: '91',
      testPhone: '+91 9876543210',
      features: {
        otp: true,
        loginVerification: true,
        passwordReset: true,
        learningNotification: true,
        paymentNotification: true,
        accountNotification: true,
      },
      status: 'connected',
      lastChecked: new Date().toISOString(),
    };

    this.razorpayConfig = {
      enabled: true,
      keyId: 'rzp_test_1DP5mmOlF5G5ag',
      keySecret: 'rzp_sec_kjsd910283019238',
      webhookSecret: 'whsec_telc_razorpay_9921',
      mode: 'test',
      currency: 'EUR',
      status: 'connected',
      lastChecked: new Date().toISOString(),
    };

    this.seedWebhookLogs();
  }

  // --- WhatsApp ---
  public getWhatsAppConfig(mask = true): WhatsAppConfig {
    if (!mask) return { ...this.whatsappConfig };
    return {
      ...this.whatsappConfig,
      accessToken: this.whatsappConfig.accessToken ? '••••••••••••••••••••' : '',
      webhookVerifyToken: this.whatsappConfig.webhookVerifyToken ? '••••••••••••••••' : '',
    };
  }

  public updateWhatsAppConfig(updates: Partial<WhatsAppConfig>) {
    // Don't overwrite with masked placeholders
    const sanitized = { ...updates };
    if (sanitized.accessToken && sanitized.accessToken.includes('•••')) {
      delete sanitized.accessToken;
    }
    if (sanitized.webhookVerifyToken && sanitized.webhookVerifyToken.includes('•••')) {
      delete sanitized.webhookVerifyToken;
    }
    this.whatsappConfig = {
      ...this.whatsappConfig,
      ...sanitized,
      lastChecked: new Date().toISOString(),
    };
    return this.getWhatsAppConfig(true);
  }

  public async testWhatsAppConnection() {
    const provider = new WhatsAppProvider(this.whatsappConfig);
    const result = await provider.testConnection();
    this.whatsappConfig.status = result.success ? 'connected' : 'error';
    this.whatsappConfig.lastChecked = new Date().toISOString();
    return result;
  }

  // --- Email ---
  public getEmailConfig(mask = true): EmailConfig {
    if (!mask) return { ...this.emailConfig };
    return {
      ...this.emailConfig,
      password: this.emailConfig.password ? '••••••••••••' : '',
      apiKey: this.emailConfig.apiKey ? '••••••••••••' : '',
    };
  }

  public updateEmailConfig(updates: Partial<EmailConfig>) {
    const sanitized = { ...updates };
    if (sanitized.password && sanitized.password.includes('•••')) {
      delete sanitized.password;
    }
    if (sanitized.apiKey && sanitized.apiKey.includes('•••')) {
      delete sanitized.apiKey;
    }
    this.emailConfig = {
      ...this.emailConfig,
      ...sanitized,
      lastChecked: new Date().toISOString(),
    };
    return this.getEmailConfig(true);
  }

  public async testEmailConnection() {
    const provider = new EmailProvider(this.emailConfig);
    const result = await provider.testConnection();
    this.emailConfig.status = result.success ? 'connected' : 'error';
    this.emailConfig.lastChecked = new Date().toISOString();
    return result;
  }

  // --- MSG91 ---
  public getMsg91Config(mask = true): Msg91Config {
    if (!mask) return { ...this.msg91Config };
    return {
      ...this.msg91Config,
      authKey: this.msg91Config.authKey ? '••••••••••••' : '',
    };
  }

  public updateMsg91Config(updates: Partial<Msg91Config>) {
    const sanitized = { ...updates };
    if (sanitized.authKey && sanitized.authKey.includes('•••')) {
      delete sanitized.authKey;
    }
    this.msg91Config = {
      ...this.msg91Config,
      ...sanitized,
      lastChecked: new Date().toISOString(),
    };
    return this.getMsg91Config(true);
  }

  public async testMsg91Connection() {
    const provider = new SmsProvider(this.msg91Config);
    const result = await provider.testConnection();
    this.msg91Config.status = result.success ? 'connected' : 'error';
    this.msg91Config.lastChecked = new Date().toISOString();
    return result;
  }

  // --- Razorpay ---
  public getRazorpayConfig(mask = true): RazorpayConfig {
    if (!mask) return { ...this.razorpayConfig };
    return {
      ...this.razorpayConfig,
      keySecret: this.razorpayConfig.keySecret ? '••••••••••••' : '',
      webhookSecret: this.razorpayConfig.webhookSecret ? '••••••••••••' : '',
    };
  }

  public updateRazorpayConfig(updates: Partial<RazorpayConfig>) {
    const sanitized = { ...updates };
    if (sanitized.keySecret && sanitized.keySecret.includes('•••')) {
      delete sanitized.keySecret;
    }
    if (sanitized.webhookSecret && sanitized.webhookSecret.includes('•••')) {
      delete sanitized.webhookSecret;
    }
    this.razorpayConfig = {
      ...this.razorpayConfig,
      ...sanitized,
      lastChecked: new Date().toISOString(),
    };
    return this.getRazorpayConfig(true);
  }

  public async testRazorpayConnection() {
    const provider = new RazorpayProvider(this.razorpayConfig);
    const result = await provider.testConnection();
    this.razorpayConfig.status = result.success ? 'connected' : 'error';
    this.razorpayConfig.lastChecked = new Date().toISOString();
    return result;
  }

  // --- Webhooks ---
  public getWebhookLogs(): WebhookEvent[] {
    return [...this.webhookLogs];
  }

  public addWebhookLog(event: Omit<WebhookEvent, 'id' | 'receivedAt'>): WebhookEvent {
    const newLog: WebhookEvent = {
      ...event,
      id: `wh_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      receivedAt: new Date().toISOString(),
    };
    this.webhookLogs.unshift(newLog);
    return newLog;
  }

  private seedWebhookLogs() {
    this.webhookLogs = [
      {
        id: 'wh_rzp_01',
        event: 'payment.captured',
        provider: 'Razorpay',
        receivedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
        status: 'PROCESSED',
        retryCount: 0,
        payload: {
          entity: 'event',
          account_id: 'acc_79182901',
          event: 'payment.captured',
          contains: ['payment'],
          payload: {
            payment: {
              entity: {
                id: 'pay_N92kz81992',
                amount: 8900,
                currency: 'EUR',
                status: 'captured',
                order_id: 'order_TELC_B1_001',
              },
            },
          },
        },
        response: { status: 200, message: 'Course access granted to usr_1' },
      },
      {
        id: 'wh_wa_02',
        event: 'messages.status_delivered',
        provider: 'WhatsApp',
        receivedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        status: 'SUCCESS',
        retryCount: 0,
        payload: {
          object: 'whatsapp_business_account',
          entry: [
            {
              id: '392019482019482',
              changes: [
                {
                  value: {
                    messaging_product: 'whatsapp',
                    statuses: [
                      {
                        id: 'wamid.HBgL1727801948831',
                        status: 'delivered',
                        timestamp: '1727801948',
                        recipient_id: '4915123456789',
                      },
                    ],
                  },
                },
              ],
            },
          ],
        },
        response: { status: 200, message: 'Status updated to DELIVERED' },
      },
      {
        id: 'wh_rzp_dup_03',
        event: 'payment.captured',
        provider: 'Razorpay',
        receivedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        status: 'DUPLICATE_IGNORED',
        retryCount: 1,
        payload: {
          entity: 'event',
          event: 'payment.captured',
          payload: { payment: { entity: { id: 'pay_N92kz81992' } } },
        },
        response: { status: 200, message: 'Duplicate webhook ignored idempotently.' },
      },
      {
        id: 'wh_wa_04',
        event: 'messages.status_failed',
        provider: 'WhatsApp',
        receivedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        status: 'FAILED',
        retryCount: 2,
        payload: {
          object: 'whatsapp_business_account',
          statuses: [
            {
              id: 'wamid.HBgL1727801844911',
              status: 'failed',
              errors: [{ code: 131026, title: 'Message undeliverable' }],
            },
          ],
        },
        error: 'Recipient unable to receive messages (131026)',
      },
    ];
  }
}

// Global Singleton instance for server-side persistence in development
declare global {
  var __telc_integration_service: IntegrationService | undefined;
}

export function getIntegrationService(): IntegrationService {
  if (!globalThis.__telc_integration_service) {
    globalThis.__telc_integration_service = new IntegrationService();
  }
  return globalThis.__telc_integration_service;
}
