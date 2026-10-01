'use client';

import React, { useState } from 'react';
import {
  Save,
  CheckCircle2,
  Lock,
  MessageSquare,
  Mail,
  Smartphone,
  CreditCard,
  Zap,
  RefreshCw,
} from 'lucide-react';
import { PageHeader } from '@/components/admin/navigation/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetBody, SheetFooter } from '@/components/ui/sheet';
import { useAuth } from '@/lib/auth/authContext';
import { useAdminStore } from '@/lib/store';
import { useToast } from '@/components/ui/toast';
import { AdminRole } from '@/types';
import { formatDate } from '@/lib/utils';

export default function SettingsPage() {
  const { toast } = useToast();
  const { user, switchRole } = useAuth();
  const {
    learningSequence,
    updateLearningSequence,
    reviewSettings,
    updateReviewSettings,
    updateAdminProfile,
  } = useAdminStore();

  const [activeTab, setActiveTab] = useState('general');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isIntegrationDrawerOpen, setIsIntegrationDrawerOpen] = useState(false);
  const [isSavingIntegrations, setIsSavingIntegrations] = useState(false);

  // General settings state
  const [generalForm, setGeneralForm] = useState({
    appName: 'TELC Mastery',
    defaultLanguage: 'German (Deutsch)',
    timezone: 'Europe/Berlin (UTC+01:00)',
    supportEmail: 'support@telcmastery.com',
  });

  // Profile form
  const [profileForm, setProfileForm] = useState({
    name: user?.name || 'Marcus Weber',
    email: user?.email || 'admin@telcmastery.com',
  });

  // Learning form
  const [learningForm, setLearningForm] = useState(learningSequence);
  const [reviewForm, setReviewForm] = useState(reviewSettings);

  // Quick Integration settings state for drawer
  const [integrationsForm, setIntegrationsForm] = useState({
    whatsappEnabled: true,
    whatsappPhoneId: '109849201948102',
    emailEnabled: true,
    emailFrom: 'noreply@telcmastery.com',
    msg91Enabled: true,
    msg91SenderId: 'TELCMS',
    razorpayEnabled: true,
    razorpayKeyId: 'rzp_live_94820194820194',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateLearningSequence(learningForm);
    updateReviewSettings(reviewForm);
    updateAdminProfile(profileForm);
    setSavedSuccess(true);
    toast({
      title: 'Settings Saved',
      description: 'Platform settings and profile updated successfully.',
      variant: 'success',
    });
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleSaveIntegrations = () => {
    setIsSavingIntegrations(true);
    setTimeout(() => {
      setIsSavingIntegrations(false);
      setIsIntegrationDrawerOpen(false);
      toast({
        title: 'Integrations Updated',
        description: 'Third-party gateway settings saved successfully.',
        variant: 'success',
      });
    }, 600);
  };

  return (
    <div className="mx-auto w-full max-w-[950px] space-y-5 sm:space-y-6">
      <PageHeader
        title="Settings & Role Management"
        description="Configure application defaults, learning algorithm parameters, admin credentials, and role-based permissions."
        actions={
          <Button
            onClick={handleSave}
            className="w-full sm:w-auto gap-1.5 bg-blue-600 hover:bg-blue-700 text-white justify-center cursor-pointer"
          >
            <Save className="h-4 w-4" />
            Save All Settings
          </Button>
        }
      />

      {savedSuccess && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span className="min-w-0 flex-1">Settings updated successfully across platform!</span>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="learning">Learning Config</TabsTrigger>
          <TabsTrigger value="review">Review Config</TabsTrigger>
          <TabsTrigger value="profile">Admin Profile</TabsTrigger>
          <TabsTrigger value="roles">Role-Based Access</TabsTrigger>
        </TabsList>

        {/* Tab 1: General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-3">
              <CardTitle className="text-base sm:text-lg">Platform Identification & Localization</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
              {/* Third-Party Integrations quick banner: Stacks cleanly on mobile */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-blue-200 bg-blue-50/60 w-full">
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">Third-Party Gateway Integrations</h4>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    Configure WhatsApp Business Cloud API, Transactional Email, MSG91 SMS, and Razorpay.
                  </p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => setIsIntegrationDrawerOpen(true)}
                  className="w-full sm:w-auto shrink-0 bg-blue-600 hover:bg-blue-700 text-white text-xs gap-1.5 cursor-pointer justify-center"
                >
                  <Zap className="h-3.5 w-3.5" />
                  Manage Integrations
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="w-full min-w-0">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Application Name
                  </label>
                  <Input
                    className="w-full min-w-0"
                    value={generalForm.appName}
                    onChange={(e) => setGeneralForm({ ...generalForm, appName: e.target.value })}
                  />
                </div>

                <div className="w-full min-w-0">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Support Contact Email
                  </label>
                  <Input
                    type="email"
                    className="w-full min-w-0"
                    value={generalForm.supportEmail}
                    onChange={(e) =>
                      setGeneralForm({ ...generalForm, supportEmail: e.target.value })
                    }
                  />
                </div>

                <div className="w-full min-w-0">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Default Learning Language
                  </label>
                  <Input
                    className="w-full min-w-0"
                    value={generalForm.defaultLanguage}
                    onChange={(e) =>
                      setGeneralForm({ ...generalForm, defaultLanguage: e.target.value })
                    }
                  />
                </div>

                <div className="w-full min-w-0">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Platform Timezone
                  </label>
                  <Input
                    className="w-full min-w-0"
                    value={generalForm.timezone}
                    onChange={(e) => setGeneralForm({ ...generalForm, timezone: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Learning Configuration */}
        <TabsContent value="learning">
          <Card>
            <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-3">
              <CardTitle className="text-base sm:text-lg">Daily Learning Sequence Rules</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="w-full min-w-0">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Words Per Day (Target)
                  </label>
                  <Input
                    type="number"
                    className="w-full min-w-0"
                    value={learningForm.dailyTarget}
                    onChange={(e) =>
                      setLearningForm({ ...learningForm, dailyTarget: Number(e.target.value) })
                    }
                  />
                </div>

                <div className="w-full min-w-0">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Words Per Batch
                  </label>
                  <Input
                    type="number"
                    className="w-full min-w-0"
                    value={learningForm.wordsPerBatch}
                    onChange={(e) =>
                      setLearningForm({ ...learningForm, wordsPerBatch: Number(e.target.value) })
                    }
                  />
                </div>

                <div className="w-full min-w-0">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Duration Per Session (Mins)
                  </label>
                  <Input
                    type="number"
                    className="w-full min-w-0"
                    value={learningForm.learningTimeMinutes}
                    onChange={(e) =>
                      setLearningForm({
                        ...learningForm,
                        learningTimeMinutes: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex items-start justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50/50 p-3.5 sm:p-4">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-semibold text-slate-800">Randomize Questions</p>
                  <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-relaxed">
                    Shuffle translation test prompts in mobile sessions
                  </p>
                </div>
                <Switch
                  className="shrink-0 mt-0.5"
                  checked={learningForm.randomizeQuestions}
                  onCheckedChange={(checked) =>
                    setLearningForm({ ...learningForm, randomizeQuestions: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Review Configuration */}
        <TabsContent value="review">
          <Card>
            <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-3">
              <CardTitle className="text-base sm:text-lg">Spaced Repetition & Chapter Rules</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
              <div className="flex items-start justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50/50 p-3.5 sm:p-4">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-semibold text-slate-800">Review Previous Words</p>
                  <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-relaxed">
                    Inject 10 words from prior sessions into daily learning
                  </p>
                </div>
                <Switch
                  className="shrink-0 mt-0.5"
                  checked={reviewForm.reviewPreviousWords}
                  onCheckedChange={(checked) =>
                    setReviewForm({ ...reviewForm, reviewPreviousWords: checked })
                  }
                />
              </div>

              <div className="flex items-start justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50/50 p-3.5 sm:p-4">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-semibold text-slate-800">Chapter Review Stage</p>
                  <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-relaxed">
                    Require randomized 140-word quiz after Day 7 completion
                  </p>
                </div>
                <Switch
                  className="shrink-0 mt-0.5"
                  checked={reviewForm.chapterReview}
                  onCheckedChange={(checked) =>
                    setReviewForm({ ...reviewForm, chapterReview: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Admin Profile */}
        <TabsContent value="profile">
          <Card>
            <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-3">
              <CardTitle className="text-base sm:text-lg">Admin Account Profile</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
                <img
                  src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'}
                  alt={user?.name}
                  className="h-14 w-14 rounded-full object-cover border-2 border-slate-200 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-slate-900 text-base">{user?.name}</p>
                  <Badge variant="default" className="text-[10px] mt-0.5">
                    {user?.role.replace('_', ' ')}
                  </Badge>
                  <p className="text-xs text-slate-400 mt-1">
                    Last login: {formatDate(user?.lastLogin || new Date().toISOString())}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="w-full min-w-0">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Admin Full Name
                  </label>
                  <Input
                    className="w-full min-w-0"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  />
                </div>

                <div className="w-full min-w-0">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Admin Email
                  </label>
                  <Input
                    type="email"
                    className="w-full min-w-0"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button
                  variant="outline"
                  onClick={() => alert('Password reset verification link sent to your email.')}
                  className="w-full sm:w-auto text-xs gap-1.5 justify-center cursor-pointer"
                >
                  <Lock className="h-3.5 w-3.5" />
                  Change Password
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 5: Role-Based Access Control (RBAC) */}
        <TabsContent value="roles">
          <Card>
            <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-3">
              <CardTitle className="text-base sm:text-lg">Role-Based Permissions & Privilege Matrix</CardTitle>
              <p className="text-xs text-slate-500">
                Roles configured: SUPER_ADMIN, CONTENT_ADMIN, SUPPORT_ADMIN
              </p>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(
                  [
                    {
                      role: 'SUPER_ADMIN' as AdminRole,
                      title: 'Super Admin',
                      desc: 'Full unrestricted permissions across learning content, users, notifications, system rules, and database actions.',
                    },
                    {
                      role: 'CONTENT_ADMIN' as AdminRole,
                      title: 'Content Admin',
                      desc: 'Manages Courses, Chapters, Vocabulary dictionaries, Tests, and Learning Sequence Rules.',
                    },
                    {
                      role: 'SUPPORT_ADMIN' as AdminRole,
                      title: 'Support Admin',
                      desc: 'Oversees Learners, Progress verification, Reset actions, Notifications, and Learner Support.',
                    },
                  ]
                ).map((r) => (
                  <div
                    key={r.role}
                    className={`rounded-xl border p-4 space-y-3 transition-all flex flex-col justify-between ${
                      user?.role === r.role
                        ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-slate-900 text-sm">{r.title}</h4>
                        {user?.role === r.role && (
                          <Badge variant="default" className="text-[10px]">
                            Active
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{r.desc}</p>
                    </div>
                    <Button
                      size="sm"
                      variant={user?.role === r.role ? 'default' : 'outline'}
                      onClick={() => switchRole(r.role)}
                      className={`w-full text-xs cursor-pointer justify-center ${
                        user?.role === r.role ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''
                      }`}
                    >
                      {user?.role === r.role ? 'Current Active Role' : `Switch to ${r.title}`}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Right-Side Integration Drawer: 420-560px on Desktop, 60-75vw on Tablet, 100vw on Mobile */}
      <Sheet open={isIntegrationDrawerOpen} onOpenChange={setIsIntegrationDrawerOpen}>
        <SheetContent size="lg">
          <div className="flex h-dvh max-h-dvh flex-col">
            <SheetHeader className="shrink-0">
              <SheetTitle>Third-Party Gateway Integrations</SheetTitle>
              <SheetDescription>
                Configure WhatsApp Cloud API, Transactional Email, MSG91 SMS, and Razorpay payment gateway credentials.
              </SheetDescription>
            </SheetHeader>

            <SheetBody className="min-h-0 flex-1 overflow-y-auto space-y-5 p-4 sm:p-6">
              {/* WhatsApp Card */}
              <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3 shadow-xs">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200">
                      <MessageSquare className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">WhatsApp Business Cloud API</h4>
                      <p className="text-[11px] text-slate-500">Automated daily study reminders & OTP verification</p>
                    </div>
                  </div>
                  <Switch
                    checked={integrationsForm.whatsappEnabled}
                    onCheckedChange={(c) => setIntegrationsForm({ ...integrationsForm, whatsappEnabled: c })}
                  />
                </div>
                <div className="pt-1">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Phone Number ID</label>
                  <Input
                    value={integrationsForm.whatsappPhoneId}
                    onChange={(e) => setIntegrationsForm({ ...integrationsForm, whatsappPhoneId: e.target.value })}
                    className="text-xs"
                  />
                </div>
              </div>

              {/* Transactional Email Card */}
              <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3 shadow-xs">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">Transactional Email (Resend/SES)</h4>
                      <p className="text-[11px] text-slate-500">Welcome digests, test score certificates, receipts</p>
                    </div>
                  </div>
                  <Switch
                    checked={integrationsForm.emailEnabled}
                    onCheckedChange={(c) => setIntegrationsForm({ ...integrationsForm, emailEnabled: c })}
                  />
                </div>
                <div className="pt-1">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">From Sender Address</label>
                  <Input
                    type="email"
                    value={integrationsForm.emailFrom}
                    onChange={(e) => setIntegrationsForm({ ...integrationsForm, emailFrom: e.target.value })}
                    className="text-xs"
                  />
                </div>
              </div>

              {/* MSG91 SMS Card */}
              <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3 shadow-xs">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600 border border-purple-200">
                      <Smartphone className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">MSG91 Global SMS</h4>
                      <p className="text-[11px] text-slate-500">Low-latency SMS OTP fallback & urgent alerts</p>
                    </div>
                  </div>
                  <Switch
                    checked={integrationsForm.msg91Enabled}
                    onCheckedChange={(c) => setIntegrationsForm({ ...integrationsForm, msg91Enabled: c })}
                  />
                </div>
                <div className="pt-1">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Sender DLT ID</label>
                  <Input
                    value={integrationsForm.msg91SenderId}
                    onChange={(e) => setIntegrationsForm({ ...integrationsForm, msg91SenderId: e.target.value })}
                    className="text-xs"
                  />
                </div>
              </div>

              {/* Razorpay Card */}
              <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3 shadow-xs">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200">
                      <CreditCard className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">Razorpay Payment Gateway</h4>
                      <p className="text-[11px] text-slate-500">UPI, Cards, Netbanking checkout with webhooks</p>
                    </div>
                  </div>
                  <Switch
                    checked={integrationsForm.razorpayEnabled}
                    onCheckedChange={(c) => setIntegrationsForm({ ...integrationsForm, razorpayEnabled: c })}
                  />
                </div>
                <div className="pt-1">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Razorpay Live Key ID</label>
                  <Input
                    value={integrationsForm.razorpayKeyId}
                    onChange={(e) => setIntegrationsForm({ ...integrationsForm, razorpayKeyId: e.target.value })}
                    className="text-xs"
                  />
                </div>
              </div>
            </SheetBody>

            <SheetFooter className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsIntegrationDrawerOpen(false)}
                className="w-full sm:w-auto text-xs cursor-pointer"
              >
                Close
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleSaveIntegrations}
                disabled={isSavingIntegrations}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-xs gap-1.5 cursor-pointer justify-center"
              >
                {isSavingIntegrations ? (
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Zap className="h-3.5 w-3.5" />
                )}
                Save Configuration
              </Button>
            </SheetFooter>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
