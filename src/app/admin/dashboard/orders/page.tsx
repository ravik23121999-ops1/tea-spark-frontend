'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, RefreshCw, Trash2, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmationModal from '@/components/Common/ConfirmationModal';
import {
  useGetOrdersQuery,
  useUpdateOrderStatusMutation,
  useDeleteOrderMutation,
} from '@/redux/apiSlice';

interface PendingStatusUpdate {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  previousStatus: string;
  newStatus: string;
}

interface PendingDelete {
  id: string;
  orderNumber: string;
  customerName: string;
}

const STATUS_OPTIONS = [
  'pending',
  'confirmed',
  'preparing',
  'ready',
  'completed',
  'cancelled',
] as const;

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  preparing: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  ready: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
};

export default function AdminOrdersPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data: ordersData, isLoading, refetch, isFetching } = useGetOrdersQuery({ page, limit });
  const [updateStatus] = useUpdateOrderStatusMutation();
  const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation();

  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [pendingUpdate, setPendingUpdate] = useState<PendingStatusUpdate | null>(null);
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null);

  const orders = ordersData?.list ?? [];
  const pagination = ordersData?.pagination;
  const totalPages = pagination?.totalPages ?? 1;
  const totalItems = pagination?.totalItems ?? 0;

  const handleStatusSelect = (order: any, newStatus: string) => {
    if (newStatus === order.orderStatus) return;
    setPendingUpdate({
      id: order._id,
      orderNumber: order.orderNumber,
      customerName: order.customer?.name || 'Customer',
      customerEmail: order.customer?.email || '',
      previousStatus: order.orderStatus,
      newStatus,
    });
  };

  const handleConfirmStatusUpdate = async () => {
    if (!pendingUpdate) return;
    setUpdatingId(pendingUpdate.id);
    try {
      const result = await updateStatus({
        id: pendingUpdate.id,
        orderStatus: pendingUpdate.newStatus,
      }).unwrap();
      toast.success(result.message || 'Order status updated');
      setPendingUpdate(null);
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      const result = await deleteOrder(pendingDelete.id).unwrap();
      toast.success(result.message || 'Order deleted');
      setPendingDelete(null);
      if (orders.length === 1 && page > 1) {
        setPage((p) => p - 1);
      }
    } catch {
      toast.error('Failed to delete order');
    }
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold dark:text-white flex items-center gap-2">
            <Package className="text-secondary" />
            Orders
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {totalItems} order{totalItems !== 1 ? 's' : ''} total — customer checkout & test payments.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <span className="font-semibold">Per page</span>
            <select
              value={limit}
              onChange={(e) => handleLimitChange(Number(e.target.value))}
              className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm font-semibold dark:text-white"
            >
              {PAGE_SIZE_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <RefreshCw size={16} className={isFetching ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-secondary" />
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-12 text-center text-slate-500">
          No orders yet. Place a test order from the storefront checkout.
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-left text-slate-500">
                  <th className="p-4 font-semibold">Order</th>
                  <th className="p-4 font-semibold">Customer</th>
                  <th className="p-4 font-semibold">Items</th>
                  <th className="p-4 font-semibold">Total</th>
                  <th className="p-4 font-semibold">Payment</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order: any, i: number) => (
                  <motion.tr
                    key={order._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                  >
                    <td className="p-4 font-mono font-medium dark:text-white">{order.orderNumber}</td>
                    <td className="p-4">
                      <div className="dark:text-white font-medium">{order.customer?.name}</div>
                      <div className="text-xs text-slate-500">{order.customer?.email}</div>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400 max-w-xs">
                      {order.items?.map((item: any) => (
                        <div key={`${order._id}-${item.teaName}`}>
                          {item.teaName} × {item.quantity}
                        </div>
                      ))}
                    </td>
                    <td className="p-4 font-semibold dark:text-white">${order.total?.toFixed(2)}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          order.paymentStatus === 'paid'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                            : order.paymentStatus === 'failed'
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="p-4">
                      <select
                        value={order.orderStatus}
                        disabled={updatingId === order._id || isDeleting}
                        onChange={(e) => handleStatusSelect(order, e.target.value)}
                        className={`text-xs font-semibold rounded-lg px-2 py-1.5 border-0 cursor-pointer ${statusColors[order.orderStatus] || ''}`}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4 text-slate-500 text-xs whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleString()}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        type="button"
                        onClick={() =>
                          setPendingDelete({
                            id: order._id,
                            orderNumber: order.orderNumber,
                            customerName: order.customer?.name || 'Customer',
                          })
                        }
                        disabled={isDeleting || updatingId === order._id}
                        className="inline-flex items-center justify-center p-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-40 transition-colors"
                        title="Delete order"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination && totalItems > 0 && (
            <div className="p-4 sm:p-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-sm text-slate-500 font-medium">
                Showing page{' '}
                <span className="text-slate-900 dark:text-white">{pagination.currentPage}</span> of{' '}
                <span className="text-slate-900 dark:text-white">{totalPages}</span>
                <span className="hidden sm:inline">
                  {' '}
                  ({totalItems} order{totalItems !== 1 ? 's' : ''})
                </span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1 || isFetching}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 transition-all"
                  aria-label="Previous page"
                >
                  <ChevronDown size={20} className="rotate-90" />
                </button>
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-300 min-w-[4rem] text-center">
                  {page} / {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages || isFetching}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 transition-all"
                  aria-label="Next page"
                >
                  <ChevronDown size={20} className="-rotate-90" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <ConfirmationModal
        isOpen={!!pendingUpdate}
        onClose={() => setPendingUpdate(null)}
        onConfirm={handleConfirmStatusUpdate}
        title="Update order status?"
        message={
          pendingUpdate
            ? `Change order ${pendingUpdate.orderNumber} from "${pendingUpdate.previousStatus}" to "${pendingUpdate.newStatus}"?\n\nCustomer: ${pendingUpdate.customerName}${
                pendingUpdate.customerEmail
                  ? `\nAn email notification will be sent to ${pendingUpdate.customerEmail}.`
                  : '\nNo customer email on file — notification will not be sent.'
              }`
            : ''
        }
        confirmText="Update status"
        cancelText="Cancel"
        type={pendingUpdate?.newStatus === 'cancelled' ? 'danger' : 'warning'}
        isLoading={!!updatingId && updatingId === pendingUpdate?.id}
      />

      <ConfirmationModal
        isOpen={!!pendingDelete}
        onClose={() => setPendingDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete order?"
        message={
          pendingDelete
            ? `Permanently delete order ${pendingDelete.orderNumber} for ${pendingDelete.customerName}?\n\nThis cannot be undone.`
            : ''
        }
        confirmText="Delete order"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
