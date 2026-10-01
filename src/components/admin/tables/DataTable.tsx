'use client';

import React, { useState } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  getFilteredRowModel,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronLeft, ChevronRight, Search, ArrowUpDown } from 'lucide-react';
import { TableSkeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/admin/feedback/EmptyState';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  searchPlaceholder?: string;
  isLoading?: boolean;
  filters?: React.ReactNode;
  bulkActions?: (selectedRows: TData[]) => React.ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  onAddFirst?: () => void;
  addFirstLabel?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = 'Filter records...',
  isLoading = false,
  filters,
  bulkActions,
  emptyTitle = 'No records found',
  emptyDescription = 'There are no items to display in this list.',
  onAddFirst,
  addFirstLabel,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      globalFilter,
      rowSelection,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  const selectedRows = table.getFilteredSelectedRowModel().rows.map((r) => r.original);

  if (isLoading) {
    return <TableSkeleton rows={6} cols={columns.length} />;
  }

  return (
    <div className="w-full space-y-4">
      {/* Top Filter and Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          {searchKey && (
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={globalFilter ?? ''}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full rounded-lg border border-slate-200 bg-white py-1.5 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-hidden shadow-xs"
              />
            </div>
          )}
          {filters}
        </div>

        {/* Bulk Actions if rows selected */}
        {selectedRows.length > 0 && bulkActions && (
          <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200">
            <span className="text-xs font-semibold text-blue-800">
              {selectedRows.length} selected
            </span>
            {bulkActions(selectedRows)}
          </div>
        )}
      </div>

      {/* Main Table Container */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-64 p-0 text-center">
                  <EmptyState
                    title={emptyTitle}
                    description={emptyDescription}
                    actionText={addFirstLabel}
                    onAction={onAddFirst}
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination Footer */}
        {table.getRowModel().rows?.length > 0 && (
          <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 bg-slate-50/50">
            <div className="text-xs text-slate-500">
              Showing{' '}
              <span className="font-semibold text-slate-700">
                {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
              </span>{' '}
              to{' '}
              <span className="font-semibold text-slate-700">
                {Math.min(
                  (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                  table.getFilteredRowModel().rows.length
                )}
              </span>{' '}
              of <span className="font-semibold text-slate-700">{table.getFilteredRowModel().rows.length}</span> entries
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="h-8 gap-1 text-xs"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="h-8 gap-1 text-xs"
              >
                Next
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
