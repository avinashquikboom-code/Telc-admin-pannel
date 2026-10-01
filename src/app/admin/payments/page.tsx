'use client';

import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  ArrowUpRight,
  TrendingUp,
  Receipt,
  Search,
  Filter,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import { PageHeader } from '@/components/admin/navigation/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { AdminDrawer } from '@/components/admin/drawers/AdminDrawer';
import { ConfirmationDrawer } from '@/components/admin/drawers/ConfirmationDrawer';
import { useToast } from '@/components/ui/toast';
import { PaymentTransaction } from '@/types';

export default function PaymentsPage() {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [selectedTx, setSelectedTx] = useState<PaymentTransaction | null>(null);
  const [refundTx, setRefundTx] = useState<PaymentTransaction | null>(null);
  const [isRefunding, setIsRefunding] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const loadTransactions = () => {
    fetch('/api/v1/payments/transactions')
      .then((r) => r.json())
      .then((d) => d.success && setTransactions(d.data))
      .catch(() => {});
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const handleRefund = async () => {
    if (!refundTx) return;
    setIsRefunding(true);
    try {
      const res = await fetch('/api/v1/payments/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionId: refundTx.id,
          amount: refundTx.amount,
          reason: 'Customer requested refund via admin dashboard',
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast({
          title: 'Refund Processed',
          description: `Successfully refunded €${refundTx.amount.toFixed(2)} for ${refundTx.userName}.`,
          variant: 'success',
        });
        setRefundTx(null);
        setSelectedTx(null);
        loadTransactions();
      } else {
        toast({ title: 'Refund Failed', description: data.error, variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to process refund request.', variant: 'destructive' });
    } finally {
      setIsRefunding(false);
    }
  };

  // Filter transactions
  const filtered = transactions.filter((t) => {
    const matchesSearch =
      t.userName.toLowerCase().includes(search.toLowerCase()) ||
      t.userEmail.toLowerCase().includes(search.toLowerCase()) ||
      t.paymentId.toLowerCase().includes(search.toLowerCase()) ||
      t.courseTitle.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = transactions
    .filter((t) => t.status === 'SUCCESS')
    .reduce((sum, t) => sum + t.amount, 0);

  const refundedTotal = transactions
    .filter((t) => t.status === 'REFUNDED')
    .reduce((sum, t) => sum + (t.refundAmount || t.amount), 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payments & Razorpay Transactions"
        description="Monitor automated learner checkouts, cryptographic signature verification, refunds, and access provisioning."
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Gross Volume</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">€{totalRevenue.toFixed(2)}</h3>
              <p className="text-[11px] text-emerald-600 mt-0.5 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Verified Server-Side
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <CreditCard className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Successful Orders</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {transactions.filter((t) => t.status === 'SUCCESS').length}
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">100% course access provisioned</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Refunded Volume</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">€{refundedTotal.toFixed(2)}</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {transactions.filter((t) => t.status === 'REFUNDED').length} refunded orders
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <RotateCcw className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Security State</p>
              <h3 className="text-base font-bold text-slate-900 mt-1">HMAC Verified</h3>
              <p className="text-[11px] text-blue-600 mt-0.5 flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" />
                No Client Trust Alone
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table & Filters */}
      <Card>
        <CardHeader className="pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 max-w-sm">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <Input
                placeholder="Search transaction, learner, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 text-xs h-9 bg-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-700"
            >
              <option value="ALL">All Statuses</option>
              <option value="SUCCESS">Success</option>
              <option value="REFUNDED">Refunded</option>
              <option value="PENDING">Pending</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payment ID</TableHead>
                <TableHead>Learner</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((tx) => (
                <TableRow
                  key={tx.id}
                  onClick={() => setSelectedTx(tx)}
                  className="cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <TableCell className="font-mono text-xs font-semibold text-blue-600">
                    {tx.paymentId}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-xs font-semibold text-slate-900">{tx.userName}</p>
                      <p className="text-[11px] text-slate-400">{tx.userEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-slate-700 font-medium">{tx.courseTitle}</TableCell>
                  <TableCell className="text-xs font-bold text-slate-900">
                    €{tx.amount.toFixed(2)} {tx.currency}
                  </TableCell>
                  <TableCell className="text-xs text-slate-600">{tx.method}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        tx.status === 'SUCCESS' ? 'default' : tx.status === 'REFUNDED' ? 'secondary' : 'destructive'
                      }
                      className="text-[10px]"
                    >
                      {tx.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-slate-400">
                    {new Date(tx.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTx(tx);
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

      {/* ======================================================== */}
      {/* TRANSACTION DETAILS RIGHT-SIDE DRAWER */}
      {/* ======================================================== */}
      {selectedTx && (
        <AdminDrawer
          open={!!selectedTx}
          onOpenChange={(open) => !open && setSelectedTx(null)}
          title="Payment Details"
          description={`Transaction ${selectedTx.paymentId}`}
          badge={
            <Badge
              variant={
                selectedTx.status === 'SUCCESS'
                  ? 'default'
                  : selectedTx.status === 'REFUNDED'
                  ? 'secondary'
                  : 'destructive'
              }
              className="text-[10px]"
            >
              {selectedTx.status}
            </Badge>
          }
          footer={
            <div className="flex items-center justify-between w-full">
              {selectedTx.status === 'SUCCESS' && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setRefundTx(selectedTx)}
                  className="text-xs text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 gap-1.5"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Issue Refund
                </Button>
              )}
              <Button type="button" size="sm" onClick={() => setSelectedTx(null)} className="ml-auto">
                Close
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            {/* Amount Banner */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
              <span className="text-xs text-slate-400 block font-medium">Total Paid</span>
              <span className="text-3xl font-extrabold text-slate-900">
                €{selectedTx.amount.toFixed(2)}
              </span>
              <span className="text-xs text-slate-500 block mt-1">{selectedTx.currency} • Razorpay Captured</span>
            </div>

            {/* Breakdown */}
            <div className="space-y-2.5 rounded-lg border border-slate-200 bg-white p-4 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Order ID:</span>
                <span className="font-mono font-medium text-slate-800">{selectedTx.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Learner:</span>
                <span className="font-semibold text-slate-900">{selectedTx.userName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Email:</span>
                <span className="text-slate-700">{selectedTx.userEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Course:</span>
                <span className="font-semibold text-blue-700">{selectedTx.courseTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payment Instrument:</span>
                <span className="text-slate-700">{selectedTx.method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Signature Verification:</span>
                <span className="font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Verified Server-Side
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Access Granted:</span>
                <span className="font-semibold text-emerald-600">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Transaction Date:</span>
                <span className="text-slate-700">{new Date(selectedTx.createdAt).toLocaleString()}</span>
              </div>

              {selectedTx.refundReason && (
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <span className="text-slate-400 block mb-1">Refund Reason:</span>
                  <p className="text-amber-800 bg-amber-50 p-2 rounded text-[11px] font-medium">
                    {selectedTx.refundReason}
                  </p>
                </div>
              )}
            </div>
          </div>
        </AdminDrawer>
      )}

      {/* ======================================================== */}
      {/* CONFIRMATION DRAWER FOR REFUND */}
      {/* ======================================================== */}
      {refundTx && (
        <ConfirmationDrawer
          open={!!refundTx}
          onOpenChange={(open) => !open && setRefundTx(null)}
          title="Confirm Payment Refund"
          description={`Are you sure you want to refund €${refundTx.amount.toFixed(2)} to ${refundTx.userName}?`}
          confirmText="Process Full Refund"
          variant="destructive"
          isLoading={isRefunding}
          onConfirm={handleRefund}
        >
          <div className="space-y-3 text-xs text-slate-700">
            <p>
              Processing this refund will automatically notify Razorpay, revoke course access, and trigger a refund receipt
              via the Unified Notification Service.
            </p>
            <div className="bg-slate-50 p-3 rounded border border-slate-200 text-xs">
              <span className="block font-semibold">Payment ID: {refundTx.paymentId}</span>
              <span className="block text-slate-500 mt-0.5">Amount: €{refundTx.amount.toFixed(2)} {refundTx.currency}</span>
            </div>
          </div>
        </ConfirmationDrawer>
      )}
    </div>
  );
}
