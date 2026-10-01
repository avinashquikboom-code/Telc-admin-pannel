'use client';

import React, { useState, useEffect } from 'react';
import {
  Bell,
  Send,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  Smartphone,
  MessageSquare,
  Mail,
  Filter,
  Search,
  RefreshCw,
  Sliders,
  AlertCircle,
  FileText,
  Plus,
} from 'lucide-react';
import { PageHeader } from '@/components/admin/navigation/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { AdminDrawer } from '@/components/admin/drawers/AdminDrawer';
import { FormDrawer } from '@/components/admin/drawers/FormDrawer';
import { useToast } from '@/components/ui/toast';
import { useAdminStore } from '@/lib/store';
import { NotificationEvent, NotificationChannelRule, NotificationLog } from '@/types';

export default function NotificationsPage() {
  const { toast } = useToast();
  const { notifications, addNotification } = useAdminStore();

  // Create Broadcast Drawer state
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastAudience, setBroadcastAudience] = useState<'All Users' | 'B1 Course' | 'Inactive Users' | 'A2 Course'>('All Users');
  const [broadcastType, setBroadcastType] = useState<'Push' | 'In-App'>('Push');
  const [scheduleOption, setScheduleOption] = useState<'Now' | 'Schedule'>('Now');
  const [scheduledDate, setScheduledDate] = useState('');

  // Logs state
  const [logs, setLogs] = useState<NotificationLog[]>([]);
  const [selectedLog, setSelectedLog] = useState<NotificationLog | null>(null);
  const [channelFilter, setChannelFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [eventFilter, setEventFilter] = useState('ALL');
  const [userSearch, setUserSearch] = useState('');

  // Channel rules state
  const [channelRules, setChannelRules] = useState<NotificationChannelRule[]>([]);
  const [isUpdatingRule, setIsUpdatingRule] = useState(false);

  const fetchLogs = React.useCallback(() => {
    let url = '/api/v1/notifications/service/logs?';
    if (channelFilter !== 'ALL') url += `channel=${channelFilter}&`;
    if (statusFilter !== 'ALL') url += `status=${statusFilter}&`;
    if (eventFilter !== 'ALL') url += `event=${eventFilter}&`;
    if (userSearch) url += `search=${encodeURIComponent(userSearch)}&`;

    fetch(url)
      .then((r) => r.json())
      .then((d) => d.success && setLogs(d.data))
      .catch(() => {});
  }, [channelFilter, statusFilter, eventFilter, userSearch]);

  const fetchRules = React.useCallback(() => {
    fetch('/api/v1/notifications/service/events')
      .then((r) => r.json())
      .then((d) => d.success && setChannelRules(d.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchLogs();
    fetchRules();
  }, [fetchLogs, fetchRules]);

  const handleToggleChannel = async (
    event: NotificationEvent,
    channel: 'email' | 'whatsapp' | 'sms',
    newValue: boolean
  ) => {
    setIsUpdatingRule(true);
    try {
      const res = await fetch('/api/v1/notifications/service/events', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event, [channel]: newValue }),
      });
      const data = await res.json();
      if (data.success) {
        toast({
          title: 'Routing Rule Updated',
          description: `Channel ${channel.toUpperCase()} set to ${newValue ? 'ON' : 'OFF'} for ${event}`,
          variant: 'success',
        });
        fetchRules();
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to update channel routing rule', variant: 'destructive' });
    } finally {
      setIsUpdatingRule(false);
    }
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastMessage) return;

    const targetUsersCount =
      broadcastAudience === 'All Users' ? 2450 : broadcastAudience === 'B1 Course' ? 1250 : 380;

    addNotification({
      title: broadcastTitle,
      message: broadcastMessage,
      audience: broadcastAudience,
      type: broadcastType,
      status: scheduleOption === 'Now' ? 'Sent' : 'Scheduled',
      scheduledAt: scheduleOption === 'Schedule' ? scheduledDate : undefined,
      targetCount: targetUsersCount,
    });

    toast({
      title: 'Broadcast Scheduled',
      description: `Notification successfully queued for ${targetUsersCount} learners.`,
      variant: 'success',
    });

    setBroadcastTitle('');
    setBroadcastMessage('');
    setIsCreateDrawerOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Unified Notification Center"
        description="Multi-channel automated notification orchestration across WhatsApp Business, Transactional Email, MSG91 SMS, and Mobile In-App push."
        actions={
          <Button
            onClick={() => setIsCreateDrawerOpen(true)}
            className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs"
          >
            <Plus className="h-4 w-4" />
            Create Notification
          </Button>
        }
      />

      <Tabs defaultValue="logs" className="space-y-6">
        <TabsList className="bg-slate-100 p-1">
          <TabsTrigger value="logs" className="text-xs">
            Unified Notification Logs ({logs.length})
          </TabsTrigger>
          <TabsTrigger value="matrix" className="text-xs">
            Channel Matrix & Events
          </TabsTrigger>
          <TabsTrigger value="broadcasts" className="text-xs">
            Mobile Push Campaigns ({notifications.length})
          </TabsTrigger>
        </TabsList>

        {/* 1. NOTIFICATION LOGS TAB */}
        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader className="pb-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2.5 flex-1">
                <div className="relative w-full sm:w-60">
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <Input
                    placeholder="Search user, email, phone..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="pl-8 text-xs h-9 bg-white"
                  />
                </div>

                <select
                  value={channelFilter}
                  onChange={(e) => setChannelFilter(e.target.value)}
                  className="h-9 rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-700"
                >
                  <option value="ALL">All Channels</option>
                  <option value="EMAIL">Email</option>
                  <option value="WHATSAPP">WhatsApp</option>
                  <option value="SMS">SMS</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-9 rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-700"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="SENT">Sent</option>
                  <option value="FAILED">Failed</option>
                  <option value="PENDING">Pending</option>
                </select>

                <select
                  value={eventFilter}
                  onChange={(e) => setEventFilter(e.target.value)}
                  className="h-9 rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-700"
                >
                  <option value="ALL">All Events</option>
                  <option value="PAYMENT_SUCCESS">Payment Success</option>
                  <option value="OTP_REQUESTED">OTP Requested</option>
                  <option value="LEARNING_REMINDER">Learning Reminder</option>
                  <option value="TEST_COMPLETED">Test Completed</option>
                  <option value="PAYMENT_FAILED">Payment Failed</option>
                </select>
              </div>

              <Button variant="outline" size="sm" onClick={fetchLogs} className="gap-1.5 text-xs">
                <RefreshCw className="h-3.5 w-3.5" />
                Refresh
              </Button>
            </CardHeader>

            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Channel</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow
                      key={log.id}
                      onClick={() => setSelectedLog(log)}
                      className="cursor-pointer hover:bg-slate-50 transition-colors"
                    >
                      <TableCell>
                        <p className="text-xs font-semibold text-slate-900">{log.userName}</p>
                        <p className="text-[11px] text-slate-400">{log.userEmail || log.userPhone}</p>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-xs font-medium text-slate-800">{log.event}</span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            log.channel === 'WHATSAPP'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : log.channel === 'EMAIL'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-purple-50 text-purple-700 border-purple-200'
                          }
                        >
                          {log.channel}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-slate-600">{log.provider}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            log.status === 'DELIVERED' || log.status === 'SENT'
                              ? 'default'
                              : log.status === 'PENDING'
                              ? 'secondary'
                              : 'destructive'
                          }
                          className="text-[10px]"
                        >
                          {log.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-slate-400">
                        {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLog(log);
                          }}
                          className="text-xs text-blue-600 hover:text-blue-700"
                        >
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 2. CHANNEL MATRIX TAB */}
        <TabsContent value="matrix" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">System Notification Event Matrix</CardTitle>
              <p className="text-xs text-slate-500">
                Configure which external delivery channels are enabled when learners trigger core learning or transaction events.
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {channelRules.map((rule) => (
                  <div
                    key={rule.event}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-200 bg-white gap-4 hover:border-slate-300 transition-all"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-900">{rule.event}</span>
                        <Badge variant="outline" className="text-[10px]">
                          {rule.title}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{rule.description}</p>
                    </div>

                    <div className="flex items-center gap-6 shrink-0">
                      {/* Email Toggle */}
                      <div className="flex items-center gap-2">
                        <Mail className="h-3.5 w-3.5 text-blue-600" />
                        <span className="text-xs font-medium text-slate-700">Email</span>
                        <Switch
                          checked={rule.email}
                          onCheckedChange={(val) => handleToggleChannel(rule.event, 'email', val)}
                          disabled={isUpdatingRule}
                        />
                      </div>

                      {/* WhatsApp Toggle */}
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-3.5 w-3.5 text-emerald-600" />
                        <span className="text-xs font-medium text-slate-700">WhatsApp</span>
                        <Switch
                          checked={rule.whatsapp}
                          onCheckedChange={(val) => handleToggleChannel(rule.event, 'whatsapp', val)}
                          disabled={isUpdatingRule}
                        />
                      </div>

                      {/* SMS Toggle */}
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-3.5 w-3.5 text-purple-600" />
                        <span className="text-xs font-medium text-slate-700">SMS</span>
                        <Switch
                          checked={rule.sms}
                          onCheckedChange={(val) => handleToggleChannel(rule.event, 'sms', val)}
                          disabled={isUpdatingRule}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 3. BROADCASTS TAB */}
        <TabsContent value="broadcasts" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Push & In-App Broadcast History</CardTitle>
                <p className="text-xs text-slate-500">Scheduled campaigns sent to active German language learners.</p>
              </div>
              <Button
                size="sm"
                onClick={() => setIsCreateDrawerOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs gap-1"
              >
                <Plus className="h-3.5 w-3.5" />
                New Broadcast
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Audience</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Target Learners</TableHead>
                    <TableHead>Read Rate</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notifications.map((notif) => (
                    <TableRow key={notif.id}>
                      <TableCell>
                        <p className="text-xs font-semibold text-slate-900">{notif.title}</p>
                        <p className="text-[11px] text-slate-500 truncate max-w-xs">{notif.message}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[11px]">
                          {notif.audience}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-slate-700">{notif.type}</span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={notif.status === 'Sent' ? 'default' : 'secondary'}
                          className="text-[10px]"
                        >
                          {notif.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs font-medium text-slate-800">
                        {notif.targetCount.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-xs text-slate-600">
                        {Math.round((notif.readCount / (notif.targetCount || 1)) * 100)}% ({notif.readCount})
                      </TableCell>
                      <TableCell className="text-xs text-slate-400">
                        {notif.sentAt ? new Date(notif.sentAt).toLocaleDateString() : 'Scheduled'}
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
      {/* 1. CREATE BROADCAST RIGHT-SIDE DRAWER */}
      {/* ======================================================== */}
      <FormDrawer
        open={isCreateDrawerOpen}
        onOpenChange={setIsCreateDrawerOpen}
        title="Create Broadcast Notification"
        description="Push motivational reminders or syllabus announcements directly to mobile devices."
        submitLabel="Send Notification"
        onSubmit={handleSendBroadcast}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <Input
              value={broadcastTitle}
              onChange={(e) => setBroadcastTitle(e.target.value)}
              placeholder="e.g. Daily Streak Alert 🔥"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Message Body <span className="text-red-500">*</span>
            </label>
            <Textarea
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              placeholder="Your 4 new German words for today are ready..."
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Audience</label>
              <select
                value={broadcastAudience}
                onChange={(e) => setBroadcastAudience(e.target.value as any)}
                className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-700"
              >
                <option value="All Users">All Learners (2,450)</option>
                <option value="B1 Course">TELC B1 Learners (1,250)</option>
                <option value="A2 Course">TELC A2 Learners (820)</option>
                <option value="Inactive Users">Inactive (&gt;3 days) (380)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Channel Type</label>
              <select
                value={broadcastType}
                onChange={(e) => setBroadcastType(e.target.value as any)}
                className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-700"
              >
                <option value="Push">Mobile Push</option>
                <option value="In-App">In-App Banner</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Dispatch Timing</label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={scheduleOption === 'Now' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setScheduleOption('Now')}
                className="text-xs"
              >
                Send Immediately
              </Button>
              <Button
                type="button"
                variant={scheduleOption === 'Schedule' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setScheduleOption('Schedule')}
                className="text-xs"
              >
                Schedule Time
              </Button>
            </div>
          </div>

          {scheduleOption === 'Schedule' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Schedule Date & Time</label>
              <Input
                type="datetime-local"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                required
              />
            </div>
          )}
        </div>
      </FormDrawer>

      {/* ======================================================== */}
      {/* 2. NOTIFICATION LOG DETAILS RIGHT-SIDE DRAWER */}
      {/* ======================================================== */}
      {selectedLog && (
        <AdminDrawer
          open={!!selectedLog}
          onOpenChange={(open) => !open && setSelectedLog(null)}
          title="Notification Log"
          description={`Log ID: ${selectedLog.id}`}
          badge={
            <Badge
              variant={
                selectedLog.status === 'DELIVERED' || selectedLog.status === 'SENT'
                  ? 'default'
                  : selectedLog.status === 'PENDING'
                  ? 'secondary'
                  : 'destructive'
              }
              className="text-[10px]"
            >
              {selectedLog.status}
            </Badge>
          }
        >
          <div className="space-y-4">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Learner:</span>
                <span className="font-semibold text-slate-900">{selectedLog.userName}</span>
              </div>
              {selectedLog.userEmail && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Email:</span>
                  <span className="text-slate-700">{selectedLog.userEmail}</span>
                </div>
              )}
              {selectedLog.userPhone && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Phone:</span>
                  <span className="font-mono text-slate-700">{selectedLog.userPhone}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-400">Event:</span>
                <span className="font-mono font-medium text-slate-800">{selectedLog.event}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Channel:</span>
                <Badge variant="outline" className="text-[10px]">
                  {selectedLog.channel}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Provider:</span>
                <span className="text-slate-700">{selectedLog.provider}</span>
              </div>
              {selectedLog.externalMessageId && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Message ID:</span>
                  <span className="font-mono text-[11px] text-slate-600 truncate max-w-[200px]">
                    {selectedLog.externalMessageId}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-400">Created:</span>
                <span className="text-slate-700">{new Date(selectedLog.createdAt).toLocaleString()}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Message Content</label>
              <div className="rounded-lg border border-slate-200 bg-white p-3 text-xs text-slate-700 leading-relaxed">
                {selectedLog.message}
              </div>
            </div>

            {selectedLog.error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                <p className="font-semibold flex items-center gap-1.5 mb-1">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  Provider Delivery Failure
                </p>
                <p className="text-[11px] leading-relaxed">{selectedLog.error}</p>
              </div>
            )}
          </div>
        </AdminDrawer>
      )}
    </div>
  );
}
