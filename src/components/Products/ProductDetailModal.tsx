'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, ShoppingCart, Plus, Minus, Loader2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { addToCart } from '@/redux/cartSlice';

export interface CatalogProduct {
  _id: string;
  name: string;
  price: number;
  description?: string;
  images?: string[];
  category?: { name?: string };
  rating?: number;
  reviewsCount?: number;
  availability?: boolean;
}

interface ProductDetailModalProps {
  product: CatalogProduct | null;
  isOpen: boolean;
  onClose: () => void;
}

export function getProductImage(product: CatalogProduct): string {
  return product.images?.[0] || '/images/hero_plate.png';
}

export default function ProductDetailModal({ product, isOpen, onClose }: ProductDetailModalProps) {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  const handleClose = () => {
    setQuantity(1);
    onClose();
  };

  const handleAddToCart = async () => {
    if (!product) return;
    if (product.availability === false) {
      toast.error(`${product.name} is currently unavailable`);
      return;
    }

    setAdding(true);
    try {
      const result = await dispatch(
        addToCart({ teaName: product.name, quantity, price: product.price }) as any
      );
      if (result.meta.requestStatus === 'fulfilled') {
        toast.success(`${product.name} added to cart!`, { position: 'top-center' });
        handleClose();
      } else {
        const msg = (result.payload as string) || `Could not add ${product.name} to cart`;
        toast.error(msg);
      }
    } catch {
      toast.error('Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  if (!product) return null;

  const imageSrc = getProductImage(product);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 shadow-md"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <div className="relative w-full h-56 sm:h-72">
              <Image
                src={imageSrc}
                alt={product.name}
                fill
                className="object-cover rounded-t-3xl"
                unoptimized={imageSrc.startsWith('http')}
              />
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold bg-white/95 dark:bg-slate-800">
                {product.category?.name || 'Treat'}
              </span>
              {product.availability === false && (
                <span className="absolute bottom-4 left-4 px-3 py-1 rounded-full text-xs font-bold bg-red-500 text-white">
                  Out of stock
                </span>
              )}
            </div>

            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white pr-8">
                  {product.name}
                </h2>
                <span className="text-2xl font-bold text-secondary">${product.price?.toFixed(2)}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <Star size={16} className="text-accent fill-accent" />
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {product.rating ?? 4.5}
                </span>
                <span>({product.reviewsCount ?? 100}+ reviews)</span>
              </div>

              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {product.description ||
                  'Handcrafted with premium organic ingredients, baked fresh for the perfect taste in every bite.'}
              </p>

              <div className="flex items-center gap-4 pt-2">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Quantity</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-600 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center font-bold text-slate-900 dark:text-white">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-600 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <span className="text-sm text-slate-500 ml-auto">
                  Subtotal: <strong className="text-secondary">${(product.price * quantity).toFixed(2)}</strong>
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={adding || product.availability === false}
                  className="flex-1 btn-primary flex items-center justify-center gap-2 py-3 disabled:opacity-50"
                >
                  {adding ? <Loader2 size={20} className="animate-spin" /> : <ShoppingCart size={20} />}
                  {adding ? 'Adding...' : 'Add to Cart'}
                </button>
                <Link
                  href="/cart"
                  onClick={handleClose}
                  className="flex-1 btn-outline text-center py-3 flex items-center justify-center"
                >
                  View Cart
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
