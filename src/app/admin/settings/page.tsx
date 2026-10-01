'use client';

import React, { useState } from 'react';
import {
  Settings,
  User,
  Shield,
  Save,
  CheckCircle2,
  Lock,
  Globe,
  Sliders,
  Bell,
  RefreshCw,
} from 'lucide-react';
import { PageHeader } from '@/components/admin/navigation/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useAuth } from '@/lib/auth/authContext';
import { useAdminStore } from '@/lib/store';
import { AdminRole } from '@/types';
import { formatDate } from '@/lib/utils';

export default function SettingsPage() {
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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateLearningSequence(learningForm);
    updateReviewSettings(reviewForm);
    updateAdminProfile(profileForm);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageHeader
        title="Settings & Role Management"
        description="Configure application defaults, learning algorithm parameters, admin credentials, and role-based permissions."
        actions={
          <Button onClick={handleSave} className="gap-1.5 bg-blue-600 hover:bg-blue-700">
            <Save className="h-4 w-4" />
            Save All Settings
          </Button>
        }
      />

      {savedSuccess && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          Settings updated successfully across platform!
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
            <CardHeader>
              <CardTitle>Platform Identification & Localization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Third-Party Integrations quick banner */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-blue-200 bg-blue-50/60">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Third-Party Gateway Integrations</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Configure WhatsApp Business Cloud API, Transactional Email, MSG91 SMS, and Razorpay.
                  </p>
                </div>
                <a href="/admin/settings/integrations">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs gap-1.5">
                    Manage Integrations
                  </Button>
                </a>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Application Name
                  </label>
                  <Input
                    value={generalForm.appName}
                    onChange={(e) => setGeneralForm({ ...generalForm, appName: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Support Contact Email
                  </label>
                  <Input
                    value={generalForm.supportEmail}
                    onChange={(e) =>
                      setGeneralForm({ ...generalForm, supportEmail: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Default Learning Language
                  </label>
                  <Input
                    value={generalForm.defaultLanguage}
                    onChange={(e) =>
                      setGeneralForm({ ...generalForm, defaultLanguage: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Platform Timezone
                  </label>
                  <Input
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
            <CardHeader>
              <CardTitle>Daily Learning Sequence Rules</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Words Per Day (Target)
                  </label>
                  <Input
                    type="number"
                    value={learningForm.dailyTarget}
                    onChange={(e) =>
                      setLearningForm({ ...learningForm, dailyTarget: Number(e.target.value) })
                    }
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Words Per Batch
                  </label>
                  <Input
                    type="number"
                    value={learningForm.wordsPerBatch}
                    onChange={(e) =>
                      setLearningForm({ ...learningForm, wordsPerBatch: Number(e.target.value) })
                    }
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Duration Per Session (Mins)
                  </label>
                  <Input
                    type="number"
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

              <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/50 p-3.5">
                <div>
                  <p className="text-xs font-semibold text-slate-800">Randomize Questions</p>
                  <p className="text-[11px] text-slate-500">
                    Shuffle translation test prompts in mobile sessions
                  </p>
                </div>
                <Switch
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
            <CardHeader>
              <CardTitle>Spaced Repetition & Chapter Rules</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/50 p-3.5">
                <div>
                  <p className="text-xs font-semibold text-slate-800">Review Previous Words</p>
                  <p className="text-[11px] text-slate-500">
                    Inject 10 words from prior sessions into daily learning
                  </p>
                </div>
                <Switch
                  checked={reviewForm.reviewPreviousWords}
                  onCheckedChange={(checked) =>
                    setReviewForm({ ...reviewForm, reviewPreviousWords: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/50 p-3.5">
                <div>
                  <p className="text-xs font-semibold text-slate-800">Chapter Review Stage</p>
                  <p className="text-[11px] text-slate-500">
                    Require randomized 140-word quiz after Day 7 completion
                  </p>
                </div>
                <Switch
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
            <CardHeader>
              <CardTitle>Admin Account Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
                <img
                  src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'}
                  alt={user?.name}
                  className="h-14 w-14 rounded-full object-cover border-2 border-slate-200"
                />
                <div>
                  <p className="font-bold text-slate-900 text-base">{user?.name}</p>
                  <Badge variant="default" className="text-[10px] mt-0.5">
                    {user?.role.replace('_', ' ')}
                  </Badge>
                  <p className="text-xs text-slate-400 mt-1">
                    Last login: {formatDate(user?.lastLogin || new Date().toISOString())}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Admin Full Name
                  </label>
                  <Input
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Admin Email
                  </label>
                  <Input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button
                  variant="outline"
                  onClick={() => alert('Password reset verification link sent to your email.')}
                  className="text-xs gap-1.5"
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
            <CardHeader>
              <CardTitle>Role-Based Permissions & Privilege Matrix</CardTitle>
              <p className="text-xs text-slate-500">
                Section 28 specification: SUPER_ADMIN, CONTENT_ADMIN, SUPPORT_ADMIN
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {(
                  [
                    {
                      role: 'SUPER_ADMIN' as AdminRole,
                      title: 'Super Admin',
                      desc: 'Full unrestricted permissions across learning content, users, notifications, system rules, and database actions.',
                      badge: 'Full Platform Access',
                    },
                    {
                      role: 'CONTENT_ADMIN' as AdminRole,
                      title: 'Content Admin',
                      desc: 'Manages Courses, Chapters, Vocabulary dictionaries, Tests, and Learning Sequence Rules.',
                      badge: 'Content & Curriculum',
                    },
                    {
                      role: 'SUPPORT_ADMIN' as AdminRole,
                      title: 'Support Admin',
                      desc: 'Oversees Learners, Progress verification, Reset actions, Notifications, and Learner Support.',
                      badge: 'Learners & Support',
                    },
                  ]
                ).map((r) => (
                  <div
                    key={r.role}
                    className={`rounded-xl border p-4 space-y-3 transition-all ${
                      user?.role === r.role
                        ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 text-sm">{r.title}</h4>
                      {user?.role === r.role && (
                        <Badge variant="default" className="text-[10px]">
                          Active
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{r.desc}</p>
                    <Button
                      size="sm"
                      variant={user?.role === r.role ? 'default' : 'outline'}
                      onClick={() => switchRole(r.role)}
                      className={`w-full text-xs cursor-pointer ${
                        user?.role === r.role ? 'bg-blue-600 hover:bg-blue-700' : ''
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
    </div>
  );
}
