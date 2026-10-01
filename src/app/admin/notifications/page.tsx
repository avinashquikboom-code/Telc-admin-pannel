'use client';

import React, { useState } from 'react';
import {
  Bell,
  Send,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  Smartphone,
  MessageSquare,
} from 'lucide-react';
import { PageHeader } from '@/components/admin/navigation/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAdminStore } from '@/lib/store';
import { formatDate } from '@/lib/utils';

export default function NotificationsPage() {
  const { notifications, addNotification } = useAdminStore();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [audience, setAudience] = useState<'All Users' | 'B1 Course' | 'Inactive Users' | 'A2 Course'>('All Users');
  const [type, setType] = useState<'Push' | 'In-App'>('Push');
  const [scheduleOption, setScheduleOption] = useState<'Now' | 'Schedule'>('Now');
  const [scheduledDate, setScheduledDate] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;

    const targetUsersCount =
      audience === 'All Users' ? 2450 : audience === 'B1 Course' ? 1250 : 380;

    addNotification({
      title,
      message,
      audience,
      type,
      status: scheduleOption === 'Now' ? 'Sent' : 'Scheduled',
      scheduledAt: scheduleOption === 'Schedule' ? scheduledDate : undefined,
      targetCount: targetUsersCount,
    });

    setTitle('');
    setMessage('');
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        description="Broadcast push alerts, streak encouragement reminders, and exam announcements directly to mobile client devices."
      />

      {successMsg && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          Notification successfully dispatched to learners!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Form: Send Notification */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Create Notification</CardTitle>
            <p className="text-xs text-slate-500">Draft push or in-app learner notification</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSend} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Notification Title <span className="text-red-500">*</span>
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Daily Streak Reminder 🔥"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Message Body <span className="text-red-500">*</span>
                </label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Keep your German vocabulary sharp! 20 words ready..."
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Delivery Channel
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setType('Push')}
                    className={`flex items-center justify-center gap-1.5 rounded-lg border py-2 text-xs font-semibold transition-colors cursor-pointer ${
                      type === 'Push'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    <Smartphone className="h-3.5 w-3.5" />
                    Push Alert
                  </button>

                  <button
                    type="button"
                    onClick={() => setType('In-App')}
                    className={`flex items-center justify-center gap-1.5 rounded-lg border py-2 text-xs font-semibold transition-colors cursor-pointer ${
                      type === 'In-App'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    In-App Banner
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Audience
                </label>
                <select
                  value={audience}
                  onChange={(e) => setAudience(e.target.value as any)}
                  className="flex h-9 w-full rounded-lg border border-slate-300 bg-white px-3 py-1 text-sm text-slate-900 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                >
                  <option value="All Users">All Registered Users (2,450)</option>
                  <option value="B1 Course">B1 German Vocabulary (1,250)</option>
                  <option value="A2 Course">A2 Essential German (520)</option>
                  <option value="Inactive Users">Inactive Learners (380)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Delivery Timing
                </label>
                <div className="flex items-center gap-3 text-xs mb-2">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="schedule"
                      checked={scheduleOption === 'Now'}
                      onChange={() => setScheduleOption('Now')}
                    />
                    <span>Send Now</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="schedule"
                      checked={scheduleOption === 'Schedule'}
                      onChange={() => setScheduleOption('Schedule')}
                    />
                    <span>Schedule For Later</span>
                  </label>
                </div>

                {scheduleOption === 'Schedule' && (
                  <Input
                    type="datetime-local"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    required
                  />
                )}
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                <Send className="mr-1.5 h-4 w-4" />
                {scheduleOption === 'Now' ? 'Send Immediately' : 'Schedule Notification'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Right Table: Notification History */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Broadcast History</CardTitle>
            <p className="text-xs text-slate-500">Record of sent push notifications and open rates</p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-y border-slate-200 bg-slate-50 text-slate-500 font-semibold">
                  <tr>
                    <th className="px-4 py-3">Notification</th>
                    <th className="px-4 py-3">Audience</th>
                    <th className="px-4 py-3">Channel</th>
                    <th className="px-4 py-3">Delivered</th>
                    <th className="px-4 py-3">Opened</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {notifications.map((n) => (
                    <tr key={n.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3">
                        <p className="font-bold text-slate-900">{n.title}</p>
                        <p className="text-[11px] text-slate-500 line-clamp-1 max-w-xs">{n.message}</p>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="secondary" className="text-[10px]">
                          {n.audience}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-slate-600 font-medium">{n.type}</td>
                      <td className="px-4 py-3 font-semibold text-slate-800">
                        {n.targetCount.toLocaleString()} devices
                      </td>
                      <td className="px-4 py-3 text-emerald-600 font-semibold">
                        {n.readCount > 0 ? `${n.readCount.toLocaleString()} opens` : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={n.status === 'Sent' ? 'success' : 'warning'}
                          className="text-[10px]"
                        >
                          {n.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
