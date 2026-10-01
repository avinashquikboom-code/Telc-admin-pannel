import {
  NotificationEvent,
  NotificationChannelRule,
  NotificationLog,
  EmailConfig,
  WhatsAppConfig,
  Msg91Config,
} from '@/types';
import { EmailProvider } from './providers/email.provider';
import { WhatsAppProvider } from './providers/whatsapp.provider';
import { SmsProvider } from './providers/sms.provider';
import { getIntegrationService } from '../integrations/integration.service';

export interface NotificationRecipient {
  userId: string;
  name: string;
  email?: string;
  phone?: string;
}

export interface NotificationContext {
  courseName?: string;
  chapterName?: string;
  score?: number | string;
  paymentId?: string;
  amount?: number | string;
  reviewDate?: string;
  otpCode?: string;
  customMessage?: string;
}

// Initial Channel rules matrix as required by the prompt
export const defaultNotificationRules: NotificationChannelRule[] = [
  {
    event: 'USER_REGISTERED',
    title: 'User Registration & Welcome',
    description: 'Triggered when a learner creates a new profile in mobile app.',
    email: true,
    whatsapp: true,
    sms: false,
  },
  {
    event: 'OTP_REQUESTED',
    title: 'OTP Authentication',
    description: 'One-time passcode for secure mobile login and profile verification.',
    email: false,
    whatsapp: true,
    sms: true,
  },
  {
    event: 'COURSE_ENROLLED',
    title: 'Course Enrollment',
    description: 'Confirmation and curriculum access instructions after joining a course.',
    email: true,
    whatsapp: true,
    sms: false,
  },
  {
    event: 'LEARNING_REMINDER',
    title: 'Daily Vocabulary Reminder',
    description: 'Scheduled nudges to complete the 4-word learning batch or daily quota.',
    email: false,
    whatsapp: true,
    sms: false,
  },
  {
    event: 'REVIEW_REMINDER',
    title: 'Spaced Review Alert',
    description: 'Notifications for reviewing previously learned words and chapter wraps.',
    email: false,
    whatsapp: true,
    sms: false,
  },
  {
    event: 'TEST_COMPLETED',
    title: 'Test Score & Milestone',
    description: 'Automated evaluation report upon completing cumulative or chapter test.',
    email: true,
    whatsapp: true,
    sms: false,
  },
  {
    event: 'PAYMENT_SUCCESS',
    title: 'Payment Succeeded',
    description: 'Receipt and instant course unlock confirmation upon Razorpay verification.',
    email: true,
    whatsapp: true,
    sms: true,
  },
  {
    event: 'PAYMENT_FAILED',
    title: 'Payment Failed',
    description: 'Payment failure alerts with instant retry instructions.',
    email: true,
    whatsapp: true,
    sms: false,
  },
  {
    event: 'REFUND_COMPLETED',
    title: 'Refund Processed',
    description: 'Notification confirming successful credit note / payment refund.',
    email: true,
    whatsapp: true,
    sms: true,
  },
  {
    event: 'PASSWORD_RESET',
    title: 'Security & Password Reset',
    description: 'Critical authentication alert for account password reset.',
    email: true,
    whatsapp: false,
    sms: true,
  },
];

export class NotificationService {
  private emailProvider: EmailProvider;
  private whatsappProvider: WhatsAppProvider;
  private smsProvider: SmsProvider;
  private rules: Map<NotificationEvent, NotificationChannelRule>;
  private logs: NotificationLog[] = [];

  constructor(
    emailConfig: EmailConfig,
    whatsappConfig: WhatsAppConfig,
    smsConfig: Msg91Config,
    initialRules: NotificationChannelRule[] = defaultNotificationRules
  ) {
    this.emailProvider = new EmailProvider(emailConfig);
    this.whatsappProvider = new WhatsAppProvider(whatsappConfig);
    this.smsProvider = new SmsProvider(smsConfig);
    this.rules = new Map(initialRules.map((r) => [r.event, r]));
    this.seedInitialLogs();
  }

  public updateProviders(email: EmailConfig, whatsapp: WhatsAppConfig, sms: Msg91Config) {
    this.emailProvider.updateConfig(email);
    this.whatsappProvider.updateConfig(whatsapp);
    this.smsProvider.updateConfig(sms);
  }

  public getRules(): NotificationChannelRule[] {
    return Array.from(this.rules.values());
  }

  public updateRule(event: NotificationEvent, updates: Partial<NotificationChannelRule>): NotificationChannelRule {
    const existing = this.rules.get(event);
    if (!existing) {
      throw new Error(`Rule for event ${event} not found`);
    }
    const updated = { ...existing, ...updates };
    this.rules.set(event, updated);
    return updated;
  }

  public getLogs(): NotificationLog[] {
    return [...this.logs];
  }

  public async dispatch(
    event: NotificationEvent,
    recipient: NotificationRecipient,
    context: NotificationContext
  ): Promise<{ dispatchedChannels: string[]; logs: NotificationLog[] }> {
    const rule = this.rules.get(event);
    if (!rule) {
      throw new Error(`No notification rule found for event ${event}`);
    }

    const dispatchedChannels: string[] = [];
    const generatedLogs: NotificationLog[] = [];
    const now = new Date().toISOString();

    // 1. Email Channel
    if (rule.email && recipient.email) {
      const emailResult = await this.emailProvider.send({
        to: recipient.email,
        subject: `TELC Mastery: ${rule.title}`,
        html: `<p>Hello ${recipient.name},</p><p>${context.customMessage || `Event: ${rule.title}`}</p>`,
        templateVars: {
          userName: recipient.name,
          courseName: context.courseName || 'TELC German B1',
          chapterName: context.chapterName || 'Kapitel 1',
          score: String(context.score || '100%'),
          paymentId: context.paymentId || 'pay_demo',
          reviewDate: context.reviewDate || new Date().toLocaleDateString(),
        },
      });

      const log: NotificationLog = {
        id: `log_em_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        userId: recipient.userId,
        userName: recipient.name,
        userEmail: recipient.email,
        event,
        channel: 'EMAIL',
        provider: 'Email (SMTP/Resend)',
        status: emailResult.success ? 'DELIVERED' : 'FAILED',
        message: `Sent notification [${rule.title}] to ${recipient.email}`,
        externalMessageId: emailResult.messageId,
        createdAt: now,
        sentAt: emailResult.success ? now : undefined,
        error: emailResult.error,
      };
      this.logs.unshift(log);
      generatedLogs.push(log);
      dispatchedChannels.push('EMAIL');
    }

    // 2. WhatsApp Channel
    if (rule.whatsapp && recipient.phone) {
      const waResult = await this.whatsappProvider.send({
        toPhone: recipient.phone,
        templateName: event.toLowerCase().replace(/_/g, '_'),
        parameters: [recipient.name, context.courseName || 'TELC German', String(context.score || '')],
      });

      const log: NotificationLog = {
        id: `log_wa_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        userId: recipient.userId,
        userName: recipient.name,
        userPhone: recipient.phone,
        event,
        channel: 'WHATSAPP',
        provider: 'WhatsApp Business Cloud API',
        status: waResult.status,
        message: `Template [${event.toLowerCase()}] delivered to ${recipient.phone}`,
        externalMessageId: waResult.messageId,
        createdAt: now,
        sentAt: waResult.success ? now : undefined,
        error: waResult.error,
      };
      this.logs.unshift(log);
      generatedLogs.push(log);
      dispatchedChannels.push('WHATSAPP');
    }

    // 3. SMS Channel
    if (rule.sms && recipient.phone) {
      const smsResult = await this.smsProvider.send({
        toPhone: recipient.phone,
        messageText: `TELC Mastery: ${context.customMessage || rule.title}`,
      });

      const log: NotificationLog = {
        id: `log_sms_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        userId: recipient.userId,
        userName: recipient.name,
        userPhone: recipient.phone,
        event,
        channel: 'SMS',
        provider: 'MSG91 DLT Gateway',
        status: smsResult.status,
        message: `SMS sent to ${recipient.phone}`,
        externalMessageId: smsResult.messageId,
        createdAt: now,
        sentAt: smsResult.success ? now : undefined,
        error: smsResult.error,
      };
      this.logs.unshift(log);
      generatedLogs.push(log);
      dispatchedChannels.push('SMS');
    }

    return { dispatchedChannels, logs: generatedLogs };
  }

  private seedInitialLogs() {
    this.logs = [
      {
        id: 'log_seed_1',
        userId: 'usr_1',
        userName: 'Lukas Schneider',
        userEmail: 'lukas.schneider@example.de',
        userPhone: '+49 151 23456789',
        event: 'PAYMENT_SUCCESS',
        channel: 'WHATSAPP',
        provider: 'WhatsApp Business Cloud API',
        status: 'DELIVERED',
        message: 'Order pay_N92kz81 confirmed. Course: TELC Deutsch B1 Complete unlocked.',
        externalMessageId: 'wamid.HBgL1727801948831',
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        sentAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
      {
        id: 'log_seed_2',
        userId: 'usr_1',
        userName: 'Lukas Schneider',
        userEmail: 'lukas.schneider@example.de',
        event: 'PAYMENT_SUCCESS',
        channel: 'EMAIL',
        provider: 'Email (SMTP/Resend)',
        status: 'DELIVERED',
        message: 'Official Tax Invoice & Enrollment Receipt sent for course B1.',
        externalMessageId: 'msg_email_8820194',
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        sentAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
      {
        id: 'log_seed_3',
        userId: 'usr_2',
        userName: 'Sophie Müller',
        userPhone: '+49 170 98765432',
        event: 'OTP_REQUESTED',
        channel: 'SMS',
        provider: 'MSG91 DLT Gateway',
        status: 'DELIVERED',
        message: 'Your TELC Mastery verification code is 849201. Valid for 10 minutes.',
        externalMessageId: 'msg91_req_78201',
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        sentAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      },
      {
        id: 'log_seed_4',
        userId: 'usr_3',
        userName: 'Matteo Rossi',
        userPhone: '+49 160 55443322',
        event: 'LEARNING_REMINDER',
        channel: 'WHATSAPP',
        provider: 'WhatsApp Business Cloud API',
        status: 'DELIVERED',
        message: 'Hallo Matteo! 4 new words are waiting in Kapitel 2: Reisen & Verkehr.',
        externalMessageId: 'wamid.HBgL1727801900123',
        createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
        sentAt: new Date(Date.now() - 3600000 * 6).toISOString(),
      },
      {
        id: 'log_seed_5',
        userId: 'usr_4',
        userName: 'Anna Kowalska',
        userEmail: 'anna.k@example.pl',
        event: 'TEST_COMPLETED',
        channel: 'EMAIL',
        provider: 'Email (SMTP/Resend)',
        status: 'DELIVERED',
        message: 'Great job Anna! You scored 95% on Kapitel 1 Review Test.',
        externalMessageId: 'msg_email_4910283',
        createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
        sentAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      },
      {
        id: 'log_seed_6',
        userId: 'usr_5',
        userName: 'Carlos Gomez',
        userPhone: '+49 172 11223344',
        event: 'PAYMENT_FAILED',
        channel: 'WHATSAPP',
        provider: 'WhatsApp Business Cloud API',
        status: 'FAILED',
        message: 'Your payment attempt for B2 Advanced Course was declined by issuing bank.',
        externalMessageId: 'wamid.HBgL1727801844911',
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        error: 'Recipient phone number is temporarily unable to receive template messages (131026)',
      },
    ];
  }
}

declare global {
  var __telc_notification_service: NotificationService | undefined;
}

export function getNotificationService(): NotificationService {
  if (!globalThis.__telc_notification_service) {
    const integrationService = getIntegrationService();
    const email = integrationService.getEmailConfig(false);
    const whatsapp = integrationService.getWhatsAppConfig(false);
    const sms = integrationService.getMsg91Config(false);
    globalThis.__telc_notification_service = new NotificationService(email, whatsapp, sms);
  }
  return globalThis.__telc_notification_service;
}
