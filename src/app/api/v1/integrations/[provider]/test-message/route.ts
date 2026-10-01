import { NextRequest, NextResponse } from 'next/server';
import { getIntegrationService } from '@/services/integrations/integration.service';
import { WhatsAppProvider } from '@/services/notification/providers/whatsapp.provider';
import { EmailProvider } from '@/services/notification/providers/email.provider';
import { SmsProvider } from '@/services/notification/providers/sms.provider';

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
        const config = service.getWhatsAppConfig(false);
        const wa = new WhatsAppProvider(config);
        const result = await wa.send({
          toPhone: body.toPhone || config.testPhone,
          templateName: body.templateName || config.defaultTemplate,
          parameters: ['Test Learner', 'TELC German B1', '100%'],
        });
        return NextResponse.json({
          success: result.success,
          messageId: result.messageId,
          status: result.status,
          message: `WhatsApp test message dispatched to ${body.toPhone || config.testPhone}`,
        });
      }
      case 'email': {
        const config = service.getEmailConfig(false);
        const email = new EmailProvider(config);
        const result = await email.send({
          to: body.toEmail || config.fromEmail,
          subject: 'TELC Mastery — System Test Email',
          html: `<p>This is a verified test email from <strong>TELC Mastery Admin Platform</strong>.</p><p>Server timestamp: ${new Date().toISOString()}</p>`,
        });
        return NextResponse.json({
          success: result.success,
          messageId: result.messageId,
          message: `Test email dispatched to ${body.toEmail || config.fromEmail}`,
        });
      }
      case 'msg91': {
        const config = service.getMsg91Config(false);
        const sms = new SmsProvider(config);
        const result = await sms.send({
          toPhone: body.toPhone || config.testPhone,
          messageText: 'TELC Mastery verification test SMS. Your gateway connection is active.',
        });
        return NextResponse.json({
          success: result.success,
          messageId: result.messageId,
          status: result.status,
          message: `Test SMS dispatched to ${body.toPhone || config.testPhone}`,
        });
      }
      default:
        return NextResponse.json({ success: false, error: 'Unknown provider' }, { status: 400 });
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
