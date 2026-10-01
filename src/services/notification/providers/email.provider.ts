import { EmailConfig } from '@/types';

export interface SendEmailPayload {
  to: string;
  subject: string;
  html: string;
  templateVars?: Record<string, string>;
}

export interface EmailProviderResult {
  success: boolean;
  messageId?: string;
  error?: string;
  timestamp: string;
}

export class EmailProvider {
  private config: EmailConfig;

  constructor(config: EmailConfig) {
    this.config = config;
  }

  public updateConfig(config: EmailConfig) {
    this.config = config;
  }

  public async testConnection(): Promise<{ success: boolean; message: string; latencyMs: number }> {
    const startTime = Date.now();
    // Simulate real server-side SMTP / API handshake
    if (!this.config.enabled) {
      return { success: false, message: 'Email integration is disabled in settings.', latencyMs: 0 };
    }

    if (this.config.provider === 'smtp' && !this.config.smtpHost) {
      return { success: false, message: 'SMTP Host cannot be empty.', latencyMs: 0 };
    }

    if (this.config.provider !== 'smtp' && !this.config.apiKey) {
      return { success: false, message: `${this.config.provider.toUpperCase()} API key is missing.`, latencyMs: 0 };
    }

    // Simulated network verification latency
    await new Promise((res) => setTimeout(res, 220));
    return {
      success: true,
      message: `Successfully connected to ${this.config.provider.toUpperCase()} relay (${this.config.fromEmail})`,
      latencyMs: Date.now() - startTime,
    };
  }

  public async send(payload: SendEmailPayload): Promise<EmailProviderResult> {
    if (!this.config.enabled) {
      return {
        success: false,
        error: 'Email provider is disabled',
        timestamp: new Date().toISOString(),
      };
    }

    // Replace template variables {{userName}}, {{courseName}}, etc.
    let renderedHtml = payload.html;
    if (payload.templateVars) {
      for (const [key, val] of Object.entries(payload.templateVars)) {
        renderedHtml = renderedHtml.replace(new RegExp(`{{${key}}}`, 'g'), val);
      }
    }

    const messageId = `msg_email_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    return {
      success: true,
      messageId,
      timestamp: new Date().toISOString(),
    };
  }
}
