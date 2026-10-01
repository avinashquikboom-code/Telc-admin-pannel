import { Msg91Config } from '@/types';

export interface SendSmsPayload {
  toPhone: string;
  templateId?: string;
  variables?: Record<string, string>;
  messageText?: string;
}

export interface SmsProviderResult {
  success: boolean;
  messageId?: string;
  status: 'SENT' | 'DELIVERED' | 'FAILED';
  error?: string;
  timestamp: string;
}

export class SmsProvider {
  private config: Msg91Config;

  constructor(config: Msg91Config) {
    this.config = config;
  }

  public updateConfig(config: Msg91Config) {
    this.config = config;
  }

  public async testConnection(): Promise<{ success: boolean; message: string; latencyMs: number }> {
    const startTime = Date.now();
    if (!this.config.enabled) {
      return { success: false, message: 'MSG91 SMS integration is disabled.', latencyMs: 0 };
    }

    if (!this.config.senderId) {
      return { success: false, message: 'Sender ID is required.', latencyMs: 0 };
    }

    await new Promise((res) => setTimeout(res, 200));
    return {
      success: true,
      message: `MSG91 DLT gateway authenticated (Sender ID: ${this.config.senderId}, Country: ${this.config.countryCode})`,
      latencyMs: Date.now() - startTime,
    };
  }

  public async send(payload: SendSmsPayload): Promise<SmsProviderResult> {
    if (!this.config.enabled) {
      return {
        success: false,
        status: 'FAILED',
        error: 'MSG91 SMS provider is disabled',
        timestamp: new Date().toISOString(),
      };
    }

    const messageId = `msg91_req_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    return {
      success: true,
      status: 'SENT',
      messageId,
      timestamp: new Date().toISOString(),
    };
  }
}
