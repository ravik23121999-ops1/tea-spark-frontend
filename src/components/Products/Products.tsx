'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Star, ShoppingCart } from 'lucide-react';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { useGetProductsQuery } from '@/redux/apiSlice';
import { addToCart } from '@/redux/cartSlice';
import ProductDetailModal, { CatalogProduct, getProductImage } from './ProductDetailModal';

export default function Products() {
  const dispatch = useDispatch();
  const { data: products, isLoading, isError } = useGetProductsQuery();
  const [selectedProduct, setSelectedProduct] = useState<CatalogProduct | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [quickAddingId, setQuickAddingId] = useState<string | null>(null);

  const openDetails = (product: CatalogProduct) => {
    setSelectedProduct(product);
    setDetailOpen(true);
  };

  const handleQuickAdd = async (e: React.MouseEvent, product: CatalogProduct) => {
    e.stopPropagation();
    if (product.availability === false) {
      toast.error(`${product.name} is unavailable`);
      return;
    }
    setQuickAddingId(product._id);
    try {
      const result = await dispatch(
        addToCart({ teaName: product.name, quantity: 1, price: product.price }) as any
      );
      if (result.meta.requestStatus === 'fulfilled') {
        toast.success(`${product.name} added to cart!`, { position: 'top-center' });
      } else {
        toast.error((result.payload as string) || `Failed to add ${product.name}`);
      }
    } catch {
      toast.error('Failed to add to cart');
    } finally {
      setQuickAddingId(null);
    }
  };

  if (isLoading) {
    return (
      <section id="products" className="section-padding flex justify-center items-center h-96">
        <div className="text-2xl font-bold animate-pulse">Baking fresh treats for you...</div>
      </section>
    );
  }

  if (isError || !products) {
    return (
      <section id="products" className="section-padding flex justify-center items-center h-96">
        <div className="text-xl text-red-500 font-bold">Failed to load our treats. Please try again!</div>
      </section>
    );
  }

  return (
    <section id="products" className="section-padding" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12 md:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4"
          >
            Freshly Baked Every <span className="text-secondary">Morning</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-lg md:text-xl max-w-lg mx-auto"
            style={{ color: 'var(--color-text-light)' }}
          >
            We use only the finest organic ingredients to ensure every bite is a moment of pure bliss.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
          {products.map((product: CatalogProduct, index: number) => {
            const imageSrc = getProductImage(product);
            return (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="glass product-card p-4 md:p-6 rounded-3xl md:rounded-[3rem] relative"
              >
                <div className="relative w-full h-56 md:h-72 mb-5 rounded-2xl md:rounded-3xl overflow-hidden group">
                  <Image
                    src={imageSrc}
                    alt={product.name}
                    fill
                    className="object-cover product-image"
                    unoptimized={imageSrc.startsWith('http')}
                  />
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-0 hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
                  >
                    <button
                      type="button"
                      onClick={(e) => handleQuickAdd(e, product)}
                      disabled={quickAddingId === product._id || product.availability === false}
                      className="btn-primary flex items-center gap-2 disabled:opacity-60"
                    >
                      <ShoppingCart size={18} />
                      {quickAddingId === product._id ? 'Adding...' : 'Quick Add'}
                    </button>
                  </motion.div>
                  <div
                    className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold"
                    style={{ backgroundColor: 'var(--color-white)', border: '1px solid var(--glass-border)' }}
                  >
                    {product.category?.name || 'Treat'}
                  </div>
                </div>

                <div className="flex justify-between items-center mb-2 px-1">
                  <h3 className="text-lg md:text-2xl font-bold">{product.name}</h3>
                  <span className="text-secondary font-bold text-lg md:text-xl">
                    ${product.price?.toFixed(2)}
                  </span>
                </div>

                <div
                  className="flex items-center gap-1 mb-4 px-1 text-sm"
                  style={{ color: 'var(--color-text-light)' }}
                >
                  <Star size={14} className="text-accent" style={{ fill: 'var(--color-accent)' }} />
                  <span className="font-semibold" style={{ color: 'var(--color-text)' }}>
                    {product.rating || 4.5}
                  </span>
                  <span>({product.reviewsCount || 100}+ Reviews)</span>
                </div>

                {product.description && (
                  <p className="text-sm mb-4 px-1 line-clamp-2 opacity-80" style={{ color: 'var(--color-text-light)' }}>
                    {product.description}
                  </p>
                )}

                <motion.button
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => openDetails(product)}
                  className="w-full btn-outline"
                >
                  View Details
                </motion.button>
              </motion.div>
            );
          })}
        </div>
      </div>

      <ProductDetailModal
        product={selectedProduct}
        isOpen={detailOpen}
        onClose={() => {
          setDetailOpen(false);
          setSelectedProduct(null);
        }}
      />
    </section>
  );
}
