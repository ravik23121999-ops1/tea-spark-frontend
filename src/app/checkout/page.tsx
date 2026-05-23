'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, Loader2, ShoppingBag } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import Header from '@/components/Header/Header';
import { RootState } from '@/redux/store';
import { getCart, getSessionId } from '@/redux/cartSlice';

const API_BASE = 'http://localhost:8000/api';

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { cart, loading } = useSelector((state: RootState) => state.cart);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    cardNumber: '4242424242424242',
    cardExpiry: '12/30',
    cardCvv: '123',
  });

  useEffect(() => {
    dispatch(getCart() as any);
  }, [dispatch]);

  useEffect(() => {
    if (!loading && cart && cart.items.length === 0) {
      router.replace('/cart');
    }
  }, [loading, cart, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cart || cart.items.length === 0) return;

    setSubmitting(true);
    try {
      const response = await fetch(`${API_BASE}/orders/place`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: getSessionId(),
          customer: {
            name: form.name,
            email: form.email,
            phone: form.phone,
            address: form.address,
          },
          payment: {
            cardNumber: form.cardNumber,
            expiry: form.cardExpiry,
            cvv: form.cardCvv,
          },
        }),
      });

      const data = await response.json();

      if (data.success && data.data?.order?.orderNumber) {
        toast.success('Order placed successfully!');
        router.push(`/order-confirmation/${data.data.order.orderNumber}`);
        return;
      }

      toast.error(data.message || 'Payment failed. Please try another card.');
      if (data.data?.order?.orderNumber) {
        router.push(`/order-confirmation/${data.data.order.orderNumber}`);
      }
    } catch {
      toast.error('Could not place order. Is the backend running?');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !cart) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex justify-center py-32">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to cart
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.form
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="space-y-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Delivery details</h2>
            {(['name', 'email', 'phone'] as const).map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 capitalize">
                  {field}
                </label>
                <input
                  name={field}
                  type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                  required
                  value={form[field]}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
              <textarea
                name="address"
                required
                rows={3}
                value={form.address}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <h2 className="text-lg font-semibold text-gray-900 dark:text-white pt-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Test payment
            </h2>
            <p className="text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg">
              Test gateway: use any 13+ digit card. Numbers ending in <strong>0000</strong> are declined.
              Default card <strong>4242424242424242</strong> always succeeds.
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Card number</label>
              <input
                name="cardNumber"
                required
                value={form.cardNumber}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expiry</label>
                <input
                  name="cardExpiry"
                  placeholder="MM/YY"
                  value={form.cardExpiry}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CVV</label>
                <input
                  name="cardCvv"
                  value={form.cardCvv}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
            >
              {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShoppingBag className="w-5 h-5" />}
              {submitting ? 'Processing payment...' : `Pay $${cart.total.toFixed(2)}`}
            </button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 h-fit"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order summary</h2>
            <ul className="space-y-3 mb-6">
              {cart.items.map((item) => (
                <li key={item.teaName} className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
                  <span>
                    {item.teaName} × {item.quantity}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between text-lg font-bold text-gray-900 dark:text-white">
              <span>Total</span>
              <span className="text-purple-600">${cart.total.toFixed(2)}</span>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
