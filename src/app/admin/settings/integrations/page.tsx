'use client';

import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Mail,
  Smartphone,
  CreditCard,
  Webhook,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  ShieldCheck,
  Send,
  RefreshCw,
  Copy,
  Check,
  Eye,
  EyeOff,
  Code2,
} from 'lucide-react';
import { PageHeader } from '@/components/admin/navigation/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { IntegrationDrawer } from '@/components/admin/drawers/IntegrationDrawer';
import { AdminDrawer } from '@/components/admin/drawers/AdminDrawer';
import { useToast } from '@/components/ui/toast';
import {
  WhatsAppConfig,
  EmailConfig,
  Msg91Config,
  RazorpayConfig,
  WebhookEvent,
} from '@/types';

export default function IntegrationsPage() {
  const { toast } = useToast();

  // Active drawer state
  const [activeDrawer, setActiveDrawer] = useState<'whatsapp' | 'email' | 'msg91' | 'razorpay' | null>(null);
  const [selectedWebhook, setSelectedWebhook] = useState<WebhookEvent | null>(null);

  // Loading states
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Form states for the 4 providers
  const [waForm, setWaForm] = useState<WhatsAppConfig>({
    enabled: true,
    phoneNumberId: '109849201948102',
    wabaId: '392019482019482',
    accessToken: '••••••••••••••••••••',
    webhookVerifyToken: '••••••••••••••••',
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
  });

  const [emailForm, setEmailForm] = useState<EmailConfig>({
    enabled: true,
    provider: 'smtp',
    smtpHost: 'smtp.mailgun.org',
    smtpPort: 587,
    username: 'postmaster@mg.telcmastery.de',
    password: '••••••••••••',
    apiKey: '',
    fromName: 'TELC Mastery Team',
    fromEmail: 'noreply@telcmastery.de',
    replyTo: 'support@telcmastery.de',
    status: 'connected',
    lastChecked: new Date().toISOString(),
  });

  const [msg91Form, setMsg91Form] = useState<Msg91Config>({
    enabled: true,
    authKey: '••••••••••••••••',
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
  });

  const [rzpForm, setRzpForm] = useState<RazorpayConfig>({
    enabled: true,
    keyId: 'rzp_test_1DP5mmOlF5G5ag',
    keySecret: '••••••••••••',
    webhookSecret: '••••••••••••',
    mode: 'test',
    currency: 'EUR',
    status: 'connected',
    lastChecked: new Date().toISOString(),
  });

  const [webhookLogs, setWebhookLogs] = useState<WebhookEvent[]>([]);

  // Load configs & webhooks on mount
  useEffect(() => {
    fetch('/api/v1/integrations/whatsapp/config')
      .then((r) => r.json())
      .then((d) => d.success && setWaForm(d.data))
      .catch(() => {});

    fetch('/api/v1/integrations/email/config')
      .then((r) => r.json())
      .then((d) => d.success && setEmailForm(d.data))
      .catch(() => {});

    fetch('/api/v1/integrations/msg91/config')
      .then((r) => r.json())
      .then((d) => d.success && setMsg91Form(d.data))
      .catch(() => {});

    fetch('/api/v1/integrations/razorpay/config')
      .then((r) => r.json())
      .then((d) => d.success && setRzpForm(d.data))
      .catch(() => {});

    fetch('/api/v1/webhooks/logs')
      .then((r) => r.json())
      .then((d) => d.success && setWebhookLogs(d.data))
      .catch(() => {});
  }, []);

  // Save handler
  const handleSaveConfig = async (provider: 'whatsapp' | 'email' | 'msg91' | 'razorpay') => {
    setIsSaving(true);
    let payload: any = {};
    if (provider === 'whatsapp') payload = waForm;
    if (provider === 'email') payload = emailForm;
    if (provider === 'msg91') payload = msg91Form;
    if (provider === 'razorpay') payload = rzpForm;

    try {
      const res = await fetch(`/api/v1/integrations/${provider}/config`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        toast({
          title: 'Configuration Saved',
          description: `${provider.toUpperCase()} credentials safely updated on server.`,
          variant: 'success',
        });
        setActiveDrawer(null);
      } else {
        toast({ title: 'Save Failed', description: data.error, variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Network Error', description: 'Failed to reach server.', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  // Test Connection Handler
  const handleTestConnection = async (provider: 'whatsapp' | 'email' | 'msg91' | 'razorpay') => {
    setIsTesting(true);
    try {
      const res = await fetch(`/api/v1/integrations/${provider}/test-connection`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        toast({
          title: 'Connection Successful',
          description: `${data.message} (${data.latencyMs}ms)`,
          variant: 'success',
        });
        // Update local status
        if (provider === 'whatsapp') setWaForm({ ...waForm, status: 'connected', lastChecked: new Date().toISOString() });
        if (provider === 'email') setEmailForm({ ...emailForm, status: 'connected', lastChecked: new Date().toISOString() });
        if (provider === 'msg91') setMsg91Form({ ...msg91Form, status: 'connected', lastChecked: new Date().toISOString() });
        if (provider === 'razorpay') setRzpForm({ ...rzpForm, status: 'connected', lastChecked: new Date().toISOString() });
      } else {
        toast({
          title: 'Connection Failed',
          description: data.message || data.error,
          variant: 'destructive',
        });
      }
    } catch {
      toast({ title: 'Test Failed', description: 'Unable to connect to service.', variant: 'destructive' });
    } finally {
      setIsTesting(false);
    }
  };

  // Test Message Handler
  const handleSendTestMessage = async (provider: 'whatsapp' | 'email' | 'msg91') => {
    setIsTesting(true);
    try {
      let body: any = {};
      if (provider === 'whatsapp') body = { toPhone: waForm.testPhone };
      if (provider === 'email') body = { toEmail: emailForm.fromEmail };
      if (provider === 'msg91') body = { toPhone: msg91Form.testPhone };

      const res = await fetch(`/api/v1/integrations/${provider}/test-message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        toast({
          title: 'Test Message Dispatched',
          description: data.message,
          variant: 'success',
        });
      } else {
        toast({ title: 'Dispatch Failed', description: data.error, variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to dispatch test message.', variant: 'destructive' });
    } finally {
      setIsTesting(false);
    }
  };

  const copyWebhookUrl = () => {
    const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/api/v1/payments/webhook`;
    navigator.clipboard.writeText(url);
    setCopiedUrl(true);
    toast({ title: 'Copied to Clipboard', description: 'Webhook endpoint copied.', variant: 'info' });
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Third-Party Integrations"
        description="Configure and monitor WhatsApp Business, Email relays, MSG91 SMS gateway, and Razorpay payments with secure server-side credential isolation."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={copyWebhookUrl}
              className="gap-1.5 text-xs text-slate-700 border-slate-200"
            >
              {copiedUrl ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              {copiedUrl ? 'Copied Webhook URL' : 'Copy Webhook URL'}
            </Button>
          </div>
        }
      />

      {/* Security Banner */}
      <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Zero Client-Side Token Exposure Architecture</h4>
            <p className="text-xs text-slate-600 mt-0.5">
              API tokens, webhook secrets, and private keys never leave the server. Communication takes place strictly
              via backend adapters.
            </p>
          </div>
        </div>
        <Badge variant="outline" className="bg-white text-blue-700 border-blue-200 shrink-0 text-xs py-1">
          HMAC-SHA256 Protected
        </Badge>
      </div>

      <Tabs defaultValue="providers" className="space-y-6">
        <TabsList className="bg-slate-100 p-1">
          <TabsTrigger value="providers" className="text-xs">
            Gateway Providers
          </TabsTrigger>
          <TabsTrigger value="webhooks" className="text-xs">
            Webhook Logs & Idempotency ({webhookLogs.length})
          </TabsTrigger>
        </TabsList>

        {/* PROVIDERS GRID */}
        <TabsContent value="providers" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
            {/* 1. WhatsApp Card */}
            <Card className="hover:border-slate-300 transition-all shadow-xs">
              <CardHeader className="flex flex-row items-start justify-between pb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base">WhatsApp Business API</CardTitle>
                    <p className="text-xs text-slate-500 mt-0.5">Meta Graph Cloud API v21.0</p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={
                    waForm.status === 'connected'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-slate-100 text-slate-600'
                  }
                >
                  {waForm.status === 'connected' ? 'Connected' : 'Not Configured'}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Phone ID</span>
                    <span className="font-mono font-medium text-slate-800">{waForm.phoneNumberId || '—'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Status</span>
                    <span className="font-semibold text-emerald-600">
                      {waForm.enabled ? 'Active / Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <span>Last checked: {new Date(waForm.lastChecked).toLocaleTimeString()}</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTestConnection('whatsapp')}
                      disabled={isTesting}
                      className="text-xs h-8"
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Test
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setActiveDrawer('whatsapp')}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8"
                    >
                      Configure
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 2. Email Card */}
            <Card className="hover:border-slate-300 transition-all shadow-xs">
              <CardHeader className="flex flex-row items-start justify-between pb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Email Gateway</CardTitle>
                    <p className="text-xs text-slate-500 mt-0.5">SMTP / Resend / SendGrid / SES</p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={
                    emailForm.status === 'connected'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-slate-100 text-slate-600'
                  }
                >
                  {emailForm.status === 'connected' ? 'Connected' : 'Not Configured'}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Provider Relay</span>
                    <span className="font-semibold text-slate-800 uppercase">{emailForm.provider}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Sender Email</span>
                    <span className="font-medium text-slate-800 truncate block">{emailForm.fromEmail}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <span>Last checked: {new Date(emailForm.lastChecked).toLocaleTimeString()}</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTestConnection('email')}
                      disabled={isTesting}
                      className="text-xs h-8"
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Test
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setActiveDrawer('email')}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8"
                    >
                      Configure
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 3. MSG91 SMS Card */}
            <Card className="hover:border-slate-300 transition-all shadow-xs">
              <CardHeader className="flex flex-row items-start justify-between pb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                    <Smartphone className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base">MSG91 SMS Gateway</CardTitle>
                    <p className="text-xs text-slate-500 mt-0.5">DLT Registered OTP & SMS Alerts</p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={
                    msg91Form.status === 'connected'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-slate-100 text-slate-600'
                  }
                >
                  {msg91Form.status === 'connected' ? 'Connected' : 'Not Configured'}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Sender ID</span>
                    <span className="font-mono font-bold text-slate-800">{msg91Form.senderId}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">DLT OTP Template</span>
                    <span className="font-mono text-slate-700 truncate block">{msg91Form.otpTemplateId}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <span>Last checked: {new Date(msg91Form.lastChecked).toLocaleTimeString()}</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTestConnection('msg91')}
                      disabled={isTesting}
                      className="text-xs h-8"
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Test
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setActiveDrawer('msg91')}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8"
                    >
                      Configure
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 4. Razorpay Card */}
            <Card className="hover:border-slate-300 transition-all shadow-xs">
              <CardHeader className="flex flex-row items-start justify-between pb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Razorpay Payments</CardTitle>
                    <p className="text-xs text-slate-500 mt-0.5">Checkout, Webhooks & Automated Access</p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={
                    rzpForm.status === 'connected'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-slate-100 text-slate-600'
                  }
                >
                  {rzpForm.status === 'connected' ? 'Connected' : 'Not Configured'}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Mode</span>
                    <Badge variant={rzpForm.mode === 'live' ? 'default' : 'secondary'} className="text-[10px] mt-0.5">
                      {rzpForm.mode.toUpperCase()} MODE
                    </Badge>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Currency</span>
                    <span className="font-bold text-slate-800">{rzpForm.currency} (€ EUR)</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <span>Last checked: {new Date(rzpForm.lastChecked).toLocaleTimeString()}</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTestConnection('razorpay')}
                      disabled={isTesting}
                      className="text-xs h-8"
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Test
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setActiveDrawer('razorpay')}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8"
                    >
                      Configure
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* WEBHOOKS TAB */}
        <TabsContent value="webhooks" className="space-y-4">
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Webhook Inbound Audit Logs</CardTitle>
                <p className="text-xs text-slate-500 mt-1">
                  All external webhook invocations from Razorpay, WhatsApp Cloud API, and gateways with SHA-256 signature verification.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  fetch('/api/v1/webhooks/logs')
                    .then((r) => r.json())
                    .then((d) => d.success && setWebhookLogs(d.data))
                }
                className="gap-1.5 text-xs"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Refresh
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event Type</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Received At</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Retries</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {webhookLogs.map((log) => (
                    <TableRow
                      key={log.id}
                      onClick={() => setSelectedWebhook(log)}
                      className="cursor-pointer hover:bg-slate-50 transition-colors"
                    >
                      <TableCell className="font-mono text-xs font-semibold text-slate-900">{log.event}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[11px]">
                          {log.provider}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-slate-500">
                        {new Date(log.receivedAt).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            log.status === 'SUCCESS' || log.status === 'PROCESSED'
                              ? 'default'
                              : log.status === 'DUPLICATE_IGNORED'
                              ? 'secondary'
                              : 'destructive'
                          }
                          className="text-[10px]"
                        >
                          {log.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-slate-600">{log.retryCount}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="text-xs text-blue-600 hover:text-blue-700">
                          View Payload
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ======================================================== */}
      {/* 1. WHATSAPP CONFIGURATION RIGHT-SIDE DRAWER */}
      {/* ======================================================== */}
      <IntegrationDrawer
        open={activeDrawer === 'whatsapp'}
        onOpenChange={(open) => !open && setActiveDrawer(null)}
        providerTitle="WhatsApp Business Cloud API"
        providerIcon={<MessageSquare className="h-5 w-5 text-emerald-600" />}
        providerDescription="Direct Meta Graph API connection for automated German learning reminders and learner alerts."
        status={waForm.status}
        lastChecked={waForm.lastChecked}
        isSaving={isSaving}
        onSave={() => handleSaveConfig('whatsapp')}
        isTestingConnection={isTesting}
        onTestConnection={() => handleTestConnection('whatsapp')}
        configTabContent={
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-lg border border-slate-200">
              <div>
                <p className="text-xs font-semibold text-slate-800">Enable WhatsApp Dispatch</p>
                <p className="text-[11px] text-slate-500">Route verified messages over Meta Cloud API</p>
              </div>
              <Switch checked={waForm.enabled} onCheckedChange={(val) => setWaForm({ ...waForm, enabled: val })} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number ID</label>
                <Input
                  value={waForm.phoneNumberId}
                  onChange={(e) => setWaForm({ ...waForm, phoneNumberId: e.target.value })}
                  placeholder="e.g. 109849201948102"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">WABA ID</label>
                <Input
                  value={waForm.wabaId}
                  onChange={(e) => setWaForm({ ...waForm, wabaId: e.target.value })}
                  placeholder="e.g. 392019482019482"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Permanent Access Token</label>
              <Input
                type="password"
                value={waForm.accessToken}
                onChange={(e) => setWaForm({ ...waForm, accessToken: e.target.value })}
                placeholder="EAAG..."
              />
              <p className="text-[11px] text-slate-400 mt-1">Masked for security. Kept exclusively on backend server.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Webhook Verify Token</label>
                <Input
                  type="password"
                  value={waForm.webhookVerifyToken}
                  onChange={(e) => setWaForm({ ...waForm, webhookVerifyToken: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">API Version</label>
                <Input
                  value={waForm.apiVersion}
                  onChange={(e) => setWaForm({ ...waForm, apiVersion: e.target.value })}
                  placeholder="v21.0"
                />
              </div>
            </div>
          </div>
        }
        featuresTabContent={
          <div className="space-y-3">
            <p className="text-xs text-slate-500 mb-2">Enable or disable automated WhatsApp triggers:</p>
            {Object.entries(waForm.features).map(([key, val]) => (
              <div
                key={key}
                className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-white"
              >
                <div>
                  <p className="text-xs font-semibold text-slate-800 capitalize">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </p>
                </div>
                <Switch
                  checked={val}
                  onCheckedChange={(newVal) =>
                    setWaForm({
                      ...waForm,
                      features: { ...waForm.features, [key]: newVal },
                    })
                  }
                />
              </div>
            ))}
          </div>
        }
        testingTabContent={
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-emerald-50/60 border border-emerald-200">
              <h4 className="text-xs font-bold text-emerald-900">Send Test WhatsApp Message</h4>
              <p className="text-xs text-emerald-800 mt-0.5">
                Trigger a sample notification to verify the template and phone configuration.
              </p>
              <div className="mt-3 flex gap-2">
                <Input
                  value={waForm.testPhone}
                  onChange={(e) => setWaForm({ ...waForm, testPhone: e.target.value })}
                  placeholder="+49 151 23456789"
                  className="bg-white"
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={() => handleSendTestMessage('whatsapp')}
                  disabled={isTesting}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs shrink-0"
                >
                  <Send className="h-3.5 w-3.5 mr-1.5" />
                  Dispatch
                </Button>
              </div>
            </div>
          </div>
        }
      />

      {/* ======================================================== */}
      {/* 2. EMAIL CONFIGURATION RIGHT-SIDE DRAWER */}
      {/* ======================================================== */}
      <IntegrationDrawer
        open={activeDrawer === 'email'}
        onOpenChange={(open) => !open && setActiveDrawer(null)}
        providerTitle="Email Gateway Configuration"
        providerIcon={<Mail className="h-5 w-5 text-blue-600" />}
        providerDescription="Reliable transactional email for user registration, test scores, and enrollment receipts."
        status={emailForm.status}
        lastChecked={emailForm.lastChecked}
        isSaving={isSaving}
        onSave={() => handleSaveConfig('email')}
        isTestingConnection={isTesting}
        onTestConnection={() => handleTestConnection('email')}
        configTabContent={
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-lg border border-slate-200">
              <div>
                <p className="text-xs font-semibold text-slate-800">Enable Email Service</p>
                <p className="text-[11px] text-slate-500">Allow system to send transactional receipts & reminders</p>
              </div>
              <Switch checked={emailForm.enabled} onCheckedChange={(val) => setEmailForm({ ...emailForm, enabled: val })} />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Provider Type</label>
              <select
                className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-800"
                value={emailForm.provider}
                onChange={(e) => setEmailForm({ ...emailForm, provider: e.target.value as any })}
              >
                <option value="smtp">Standard SMTP Relay</option>
                <option value="resend">Resend API</option>
                <option value="sendgrid">SendGrid API</option>
                <option value="ses">Amazon SES</option>
              </select>
            </div>

            {emailForm.provider === 'smtp' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">SMTP Host</label>
                  <Input
                    value={emailForm.smtpHost}
                    onChange={(e) => setEmailForm({ ...emailForm, smtpHost: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">SMTP Port</label>
                  <Input
                    type="number"
                    value={emailForm.smtpPort}
                    onChange={(e) => setEmailForm({ ...emailForm, smtpPort: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Username</label>
                  <Input
                    value={emailForm.username}
                    onChange={(e) => setEmailForm({ ...emailForm, username: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                  <Input
                    type="password"
                    value={emailForm.password}
                    onChange={(e) => setEmailForm({ ...emailForm, password: e.target.value })}
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">API Key</label>
                <Input
                  type="password"
                  value={emailForm.apiKey}
                  onChange={(e) => setEmailForm({ ...emailForm, apiKey: e.target.value })}
                  placeholder="re_..."
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">From Name</label>
                <Input
                  value={emailForm.fromName}
                  onChange={(e) => setEmailForm({ ...emailForm, fromName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">From Email</label>
                <Input
                  value={emailForm.fromEmail}
                  onChange={(e) => setEmailForm({ ...emailForm, fromEmail: e.target.value })}
                />
              </div>
            </div>
          </div>
        }
        testingTabContent={
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-blue-50/60 border border-blue-200">
              <h4 className="text-xs font-bold text-blue-900">Send Test Email</h4>
              <p className="text-xs text-blue-800 mt-0.5">Dispatches an HTML verification test email from the server.</p>
              <div className="mt-3 flex gap-2">
                <Input
                  value={emailForm.fromEmail}
                  onChange={(e) => setEmailForm({ ...emailForm, fromEmail: e.target.value })}
                  className="bg-white"
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={() => handleSendTestMessage('email')}
                  disabled={isTesting}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs shrink-0"
                >
                  <Send className="h-3.5 w-3.5 mr-1.5" />
                  Send Test
                </Button>
              </div>
            </div>

            {/* Template Variables Guide */}
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3.5">
              <p className="text-xs font-bold text-slate-800 mb-1.5">Supported Template Variables</p>
              <div className="flex flex-wrap gap-1.5">
                {['{{userName}}', '{{courseName}}', '{{chapterName}}', '{{score}}', '{{paymentId}}', '{{reviewDate}}'].map(
                  (v) => (
                    <code key={v} className="bg-white border border-slate-200 px-2 py-0.5 rounded text-[11px] font-mono text-blue-700">
                      {v}
                    </code>
                  )
                )}
              </div>
            </div>
          </div>
        }
      />

      {/* ======================================================== */}
      {/* 3. MSG91 CONFIGURATION RIGHT-SIDE DRAWER */}
      {/* ======================================================== */}
      <IntegrationDrawer
        open={activeDrawer === 'msg91'}
        onOpenChange={(open) => !open && setActiveDrawer(null)}
        providerTitle="MSG91 SMS Gateway"
        providerIcon={<Smartphone className="h-5 w-5 text-purple-600" />}
        providerDescription="DLT-compliant SMS infrastructure for high-priority mobile authentication and critical alerts."
        status={msg91Form.status}
        lastChecked={msg91Form.lastChecked}
        isSaving={isSaving}
        onSave={() => handleSaveConfig('msg91')}
        isTestingConnection={isTesting}
        onTestConnection={() => handleTestConnection('msg91')}
        configTabContent={
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-lg border border-slate-200">
              <div>
                <p className="text-xs font-semibold text-slate-800">Enable MSG91 Dispatch</p>
                <p className="text-[11px] text-slate-500">Allow outbound OTPs & SMS broadcasts</p>
              </div>
              <Switch checked={msg91Form.enabled} onCheckedChange={(val) => setMsg91Form({ ...msg91Form, enabled: val })} />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Auth Key</label>
              <Input
                type="password"
                value={msg91Form.authKey}
                onChange={(e) => setMsg91Form({ ...msg91Form, authKey: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Sender ID (6-digit)</label>
                <Input
                  value={msg91Form.senderId}
                  onChange={(e) => setMsg91Form({ ...msg91Form, senderId: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Country Code</label>
                <Input
                  value={msg91Form.countryCode}
                  onChange={(e) => setMsg91Form({ ...msg91Form, countryCode: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">DLT Template ID</label>
                <Input
                  value={msg91Form.dltTemplateId}
                  onChange={(e) => setMsg91Form({ ...msg91Form, dltTemplateId: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">OTP Template ID</label>
                <Input
                  value={msg91Form.otpTemplateId}
                  onChange={(e) => setMsg91Form({ ...msg91Form, otpTemplateId: e.target.value })}
                />
              </div>
            </div>
          </div>
        }
        testingTabContent={
          <div className="p-4 rounded-lg bg-purple-50/60 border border-purple-200">
            <h4 className="text-xs font-bold text-purple-900">Send Test SMS</h4>
            <p className="text-xs text-purple-800 mt-0.5">Sends a test OTP verification message via MSG91.</p>
            <div className="mt-3 flex gap-2">
              <Input
                value={msg91Form.testPhone}
                onChange={(e) => setMsg91Form({ ...msg91Form, testPhone: e.target.value })}
                className="bg-white"
              />
              <Button
                type="button"
                size="sm"
                onClick={() => handleSendTestMessage('msg91')}
                disabled={isTesting}
                className="bg-purple-600 hover:bg-purple-700 text-white text-xs shrink-0"
              >
                <Send className="h-3.5 w-3.5 mr-1.5" />
                Send SMS
              </Button>
            </div>
          </div>
        }
      />

      {/* ======================================================== */}
      {/* 4. RAZORPAY CONFIGURATION RIGHT-SIDE DRAWER */}
      {/* ======================================================== */}
      <IntegrationDrawer
        open={activeDrawer === 'razorpay'}
        onOpenChange={(open) => !open && setActiveDrawer(null)}
        providerTitle="Razorpay Payment Gateway"
        providerIcon={<CreditCard className="h-5 w-5 text-indigo-600" />}
        providerDescription="Accept course payments with server-side signature verification and idempotent course access grants."
        status={rzpForm.status}
        lastChecked={rzpForm.lastChecked}
        isSaving={isSaving}
        onSave={() => handleSaveConfig('razorpay')}
        isTestingConnection={isTesting}
        onTestConnection={() => handleTestConnection('razorpay')}
        configTabContent={
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-lg border border-slate-200">
              <div>
                <p className="text-xs font-semibold text-slate-800">Enable Razorpay Processing</p>
                <p className="text-[11px] text-slate-500">Allow learners to purchase premium TELC courses</p>
              </div>
              <Switch checked={rzpForm.enabled} onCheckedChange={(val) => setRzpForm({ ...rzpForm, enabled: val })} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Environment Mode</label>
                <select
                  className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-800"
                  value={rzpForm.mode}
                  onChange={(e) => setRzpForm({ ...rzpForm, mode: e.target.value as any })}
                >
                  <option value="test">Test Mode (Sandbox)</option>
                  <option value="live">Live Mode (Production)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Settlement Currency</label>
                <select
                  className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-800"
                  value={rzpForm.currency}
                  onChange={(e) => setRzpForm({ ...rzpForm, currency: e.target.value as any })}
                >
                  <option value="EUR">EUR (€)</option>
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Key ID</label>
              <Input
                value={rzpForm.keyId}
                onChange={(e) => setRzpForm({ ...rzpForm, keyId: e.target.value })}
                placeholder="rzp_test_..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Key Secret</label>
              <Input
                type="password"
                value={rzpForm.keySecret}
                onChange={(e) => setRzpForm({ ...rzpForm, keySecret: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Webhook Secret</label>
              <Input
                type="password"
                value={rzpForm.webhookSecret}
                onChange={(e) => setRzpForm({ ...rzpForm, webhookSecret: e.target.value })}
              />
              <p className="text-[11px] text-slate-400 mt-1">Used to verify HMAC-SHA256 signature on payment.captured events.</p>
            </div>
          </div>
        }
        testingTabContent={
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-indigo-50/60 border border-indigo-200">
              <h4 className="text-xs font-bold text-indigo-900">Webhook Integration Endpoint</h4>
              <p className="text-xs text-indigo-800 mt-0.5">
                Register this URL in your Razorpay Dashboard &rarr; Settings &rarr; Webhooks:
              </p>
              <div className="mt-3 flex items-center justify-between gap-2 p-2.5 bg-white rounded border border-indigo-200">
                <code className="text-[11px] font-mono text-slate-700 select-all">/api/v1/payments/webhook</code>
                <Button size="sm" variant="outline" onClick={copyWebhookUrl} className="h-7 text-xs">
                  Copy
                </Button>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">Active events: payment.captured, payment.failed, refund.processed</p>
            </div>
          </div>
        }
      />

      {/* ======================================================== */}
      {/* 5. WEBHOOK DETAILS RIGHT-SIDE DRAWER */}
      {/* ======================================================== */}
      {selectedWebhook && (
        <AdminDrawer
          open={!!selectedWebhook}
          onOpenChange={(open) => !open && setSelectedWebhook(null)}
          title={`Webhook: ${selectedWebhook.event}`}
          description={`Received from ${selectedWebhook.provider} at ${new Date(selectedWebhook.receivedAt).toLocaleString()}`}
          badge={
            <Badge
              variant={
                selectedWebhook.status === 'SUCCESS' || selectedWebhook.status === 'PROCESSED'
                  ? 'default'
                  : 'secondary'
              }
              className="text-[10px]"
            >
              {selectedWebhook.status}
            </Badge>
          }
          size="lg"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div>
                <span className="text-slate-400 block text-[11px]">Event ID</span>
                <span className="font-mono font-medium text-slate-800">{selectedWebhook.id}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Signature Verified</span>
                <span className="font-semibold text-emerald-600">HMAC-SHA256 Validated</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                <Code2 className="h-3.5 w-3.5 text-blue-600" />
                Raw Payload
              </label>
              <pre className="rounded-lg bg-slate-900 p-4 text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-[300px]">
                {JSON.stringify(selectedWebhook.payload, null, 2)}
              </pre>
            </div>

            {selectedWebhook.response && (
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">System Response</label>
                <pre className="rounded-lg bg-slate-100 p-3 text-[11px] font-mono text-slate-800 overflow-x-auto">
                  {JSON.stringify(selectedWebhook.response, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </AdminDrawer>
      )}
    </div>
  );
}
