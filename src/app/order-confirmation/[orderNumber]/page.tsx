'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { CheckCircle2, XCircle, ArrowLeft, Package } from 'lucide-react';
import Header from '@/components/Header/Header';

const API_BASE = 'http://localhost:8000/api';

interface Order {
  orderNumber: string;
  customer: { name: string; email: string; phone: string; address: string };
  items: { teaName: string; quantity: number; lineTotal: number }[];
  total: number;
  paymentStatus: string;
  orderStatus: string;
  paymentTransactionId?: string;
  paymentError?: string;
  createdAt: string;
}

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderNumber = params.orderNumber as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`${API_BASE}/orders/number/${orderNumber}`);
        const data = await res.json();
        if (data.success) setOrder(data.data);
      } catch {
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };
    if (orderNumber) fetchOrder();
  }, [orderNumber]);

  const paid = order?.paymentStatus === 'paid';

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-12">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
          </div>
        ) : !order ? (
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-6">Order not found.</p>
            <Link href="/" className="text-purple-600 hover:underline">
              Back to home
            </Link>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
            {paid ? (
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            ) : (
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            )}
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {paid ? 'Thank you for your order!' : 'Payment failed'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Order <span className="font-mono font-semibold">{order.orderNumber}</span>
            </p>

            {!paid && order.paymentError && (
              <p className="text-red-600 dark:text-red-400 text-sm mb-4">{order.paymentError}</p>
            )}

            {paid && order.paymentTransactionId && (
              <p className="text-xs text-gray-500 mb-4 font-mono">Txn: {order.paymentTransactionId}</p>
            )}

            <div className="text-left space-y-2 mb-6 text-sm text-gray-700 dark:text-gray-300">
              <p>
                <strong>Status:</strong> {order.orderStatus} · {order.paymentStatus}
              </p>
              <p>
                <strong>Customer:</strong> {order.customer.name} ({order.customer.email})
              </p>
              <ul className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                {order.items.map((item) => (
                  <li key={item.teaName} className="flex justify-between py-1">
                    <span>
                      {item.teaName} × {item.quantity}
                    </span>
                    <span>${item.lineTotal.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <p className="flex justify-between font-bold text-lg pt-2">
                <span>Total</span>
                <span className="text-purple-600">${order.total.toFixed(2)}</span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700"
              >
                <Package className="w-5 h-5" />
                Continue shopping
              </Link>
              {!paid && (
                <Link
                  href="/checkout"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg font-semibold text-gray-700 dark:text-gray-300"
                >
                  Try again
                </Link>
              )}
              <Link
                href="/cart"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-purple-600"
              >
                <ArrowLeft className="w-5 h-5" />
                Cart
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
