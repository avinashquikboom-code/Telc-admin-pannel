'use client';

import * as React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetBody, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CheckCircle2, AlertCircle, RefreshCw, Zap, ShieldAlert } from 'lucide-react';

export interface IntegrationDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  providerTitle: string;
  providerIcon?: React.ReactNode;
  providerDescription: string;
  status: 'connected' | 'error' | 'unconfigured';
  lastChecked?: string;
  isTestingConnection?: boolean;
  onTestConnection?: () => void;
  isSaving?: boolean;
  onSave?: (e: React.FormEvent) => void;
  configTabContent: React.ReactNode;
  featuresTabContent?: React.ReactNode;
  testingTabContent?: React.ReactNode;
  logsTabContent?: React.ReactNode;
  size?: 'default' | 'lg' | 'xl';
}

export function IntegrationDrawer({
  open,
  onOpenChange,
  providerTitle,
  providerIcon,
  providerDescription,
  status,
  lastChecked,
  isTestingConnection = false,
  onTestConnection,
  isSaving = false,
  onSave,
  configTabContent,
  featuresTabContent,
  testingTabContent,
  logsTabContent,
  size = 'lg',
}: IntegrationDrawerProps) {
  const [activeTab, setActiveTab] = React.useState('configuration');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      onSave(e);
    }
  };

  const statusBadge = (
    <div className="flex items-center gap-1.5">
      {status === 'connected' && (
        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 gap-1 text-[11px]">
          <CheckCircle2 className="h-3 w-3 text-emerald-600" />
          Connected
        </Badge>
      )}
      {status === 'error' && (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 gap-1 text-[11px]">
          <AlertCircle className="h-3 w-3 text-red-600" />
          Degraded / Error
        </Badge>
      )}
      {status === 'unconfigured' && (
        <Badge variant="outline" className="bg-slate-100 text-slate-600 border-slate-200 gap-1 text-[11px]">
          Not Configured
        </Badge>
      )}
    </div>
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent size={size}>
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          {/* Header */}
          <SheetHeader>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                {providerIcon && (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700">
                    {providerIcon}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <SheetTitle>{providerTitle}</SheetTitle>
                    {statusBadge}
                  </div>
                  <SheetDescription className="mt-0.5">{providerDescription}</SheetDescription>
                </div>
              </div>
            </div>

            {lastChecked && (
              <p className="text-[11px] text-slate-400 mt-1">
                Last checked: <span className="font-medium text-slate-600">{new Date(lastChecked).toLocaleString()}</span>
              </p>
            )}

            {/* Security Notice */}
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-slate-50 border border-slate-200/80 px-3 py-1.5 text-[11px] text-slate-600">
              <ShieldAlert className="h-3.5 w-3.5 text-blue-600 shrink-0" />
              <span>Sensitive tokens and keys remain securely encrypted on the server and are masked in this UI.</span>
            </div>
          </SheetHeader>

          {/* Navigation Tabs */}
          <div className="border-b border-slate-200/80 px-6 pt-2 bg-white">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-slate-100/70 p-1">
                <TabsTrigger value="configuration" className="text-xs">
                  Configuration
                </TabsTrigger>
                {featuresTabContent && (
                  <TabsTrigger value="features" className="text-xs">
                    Features & Triggers
                  </TabsTrigger>
                )}
                {testingTabContent && (
                  <TabsTrigger value="testing" className="text-xs">
                    Test & Diagnostics
                  </TabsTrigger>
                )}
                {logsTabContent && (
                  <TabsTrigger value="logs" className="text-xs">
                    Activity Logs
                  </TabsTrigger>
                )}
              </TabsList>
            </Tabs>
          </div>

          {/* Body */}
          <SheetBody className="pt-4">
            <div className={activeTab === 'configuration' ? 'block' : 'hidden'}>{configTabContent}</div>
            {featuresTabContent && (
              <div className={activeTab === 'features' ? 'block' : 'hidden'}>{featuresTabContent}</div>
            )}
            {testingTabContent && (
              <div className={activeTab === 'testing' ? 'block' : 'hidden'}>{testingTabContent}</div>
            )}
            {logsTabContent && <div className={activeTab === 'logs' ? 'block' : 'hidden'}>{logsTabContent}</div>}
          </SheetBody>

          {/* Footer */}
          <SheetFooter className="justify-between">
            <div>
              {onTestConnection && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onTestConnection}
                  disabled={isTestingConnection || isSaving}
                  className="gap-1.5 text-xs text-slate-700 hover:text-slate-900 border-slate-200"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isTestingConnection ? 'animate-spin text-blue-600' : ''}`} />
                  {isTestingConnection ? 'Testing Connection...' : 'Test Connection'}
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                disabled={isSaving}
              >
                Close
              </Button>
              <Button
                type="submit"
                size="sm"
                isLoading={isSaving}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs gap-1.5"
              >
                <Zap className="h-3.5 w-3.5" />
                Save Configuration
              </Button>
            </div>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
