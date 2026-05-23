'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { QrCode, Camera, Sparkles, Zap, Coffee } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const QRScannerSection: React.FC = () => {
  // Component simplified to show QR code instead of camera scanner

  return (
    <section className="section-padding relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10">
          <QrCode size={100} className="text-purple-600" />
        </div>
        <div className="absolute top-20 right-20">
          <Camera size={80} className="text-purple-600" />
        </div>
        <div className="absolute bottom-20 left-20">
          <Sparkles size={60} className="text-purple-600" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full mb-6"
          >
            <QrCode size={40} className="text-white" />
          </motion.div>

          {/* Heading */}
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 md:mb-8">
            Scan & <span className="text-purple-600">Discover</span>
          </h2>
          
          {/* Description */}
          <p className="text-lg md:text-xl mb-8 md:mb-12 max-w-3xl mx-auto opacity-80" style={{ color: 'var(--color-text)' }}>
            Experience the future of tea shopping with our smart QR scanner. Scan codes to unlock exclusive tea recommendations, 
            personalized offers, and instant access to our AI tea sommelier.
          </p>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-purple-100 dark:border-purple-800"
            >
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Camera className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Instant Scan</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Point your camera and scan any tea-related QR code for immediate recommendations
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-purple-100 dark:border-purple-800"
            >
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Smart AI</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our AI sommelier analyzes the scanned data to provide perfect tea suggestions
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-purple-100 dark:border-purple-800"
            >
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Coffee className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Quick Add</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Instantly add recommended teas to your cart with a single tap
              </p>
            </motion.div>
          </div>

          {/* CTA Button */}
          <Link href="/qr-scanner">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl inline-flex items-center space-x-3 cursor-pointer text-center"
            >
              <QrCode size={24} />
              <span>Try QR Scanner Now</span>
            </motion.div>
          </Link>

          {/* Additional Info */}
          <div className="mt-8 text-sm opacity-60" style={{ color: 'var(--color-text)' }}>
            <p>Click the button above to see the QR code and scan it with your phone!</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default QRScannerSection;
