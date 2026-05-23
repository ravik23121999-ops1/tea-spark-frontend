'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { QrCode, Smartphone, ArrowLeft, Home, Download, Share2 } from 'lucide-react';
import Link from 'next/link';
import QRCode from 'qrcode';
import toast from 'react-hot-toast';

export default function QRScannerPage() {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    generateQRCode();
  }, []);

  const generateQRCode = async () => {
    try {
      // Get the current website URL - in production, this would be your live site
      const websiteUrl = process.env.NODE_ENV === 'production' 
        ? 'https://your-tea-spark-website.com' 
        : 'http://localhost:3001'; // Using the port where Next.js is running
      
      // Generate QR code
      const qrDataUrl = await QRCode.toDataURL(websiteUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#1F2937', // Dark gray
          light: '#FFFFFF', // White
        },
      });
      
      setQrCodeUrl(qrDataUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast.error('Failed to generate QR code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadQR = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.download = 'tea-spark-qr-code.png';
      link.href = qrCodeUrl;
      link.click();
      toast.success('QR Code downloaded!');
    }
  };

  const handleShare = async () => {
    const websiteUrl = process.env.NODE_ENV === 'production' 
      ? 'https://your-tea-spark-website.com' 
      : 'http://localhost:3001';
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Tea Spark - Scan to Visit',
          text: 'Scan this QR code to visit Tea Spark and discover amazing teas!',
          url: websiteUrl,
        });
      } catch (error) {
        console.log('Share cancelled or failed');
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(websiteUrl);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-green-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-purple-100 dark:border-purple-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link 
                href="/"
                className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Home</span>
              </Link>
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Tea Spark QR Scanner
            </h1>
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center space-y-8">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full mx-auto"
            >
              <QrCode size={32} className="text-white" />
            </motion.div>
            
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white">
              Scan to Visit <span className="text-purple-600">Tea Spark</span>
            </h2>
            
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Use your phone's camera to scan this QR code and instantly open Tea Spark on your mobile device. 
              Discover our premium tea collection and get personalized recommendations!
            </p>
          </motion.div>

          {/* QR Code Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 max-w-md mx-auto border border-purple-100 dark:border-purple-800"
          >
            {isLoading ? (
              <div className="w-[300px] h-[300px] flex items-center justify-center bg-gray-100 dark:bg-slate-700 rounded-lg">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              </div>
            ) : qrCodeUrl ? (
              <div className="space-y-6">
                <div className="flex justify-center">
                  <img 
                    src={qrCodeUrl} 
                    alt="Tea Spark QR Code" 
                    className="w-[300px] h-[300px] rounded-lg shadow-lg"
                  />
                </div>
                
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                    Point your phone camera at this code
                  </p>
                  
                  <div className="flex items-center justify-center space-x-2 text-sm text-purple-600 dark:text-purple-400">
                    <Smartphone className="w-4 h-4" />
                    <span>Works with any QR scanner app</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-[300px] h-[300px] flex items-center justify-center bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p className="text-red-600 dark:text-red-400">Failed to generate QR code</p>
              </div>
            )}
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button
              onClick={handleDownloadQR}
              disabled={!qrCodeUrl}
              className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <Download className="w-5 h-5" />
              <span>Download QR Code</span>
            </button>
            
            <button
              onClick={handleShare}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <Share2 className="w-5 h-5" />
              <span>Share Link</span>
            </button>
            
            <Link
              href="/"
              className="flex items-center space-x-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <Home className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
          </motion.div>

          {/* Instructions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6 max-w-2xl mx-auto border border-purple-100 dark:border-purple-800"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">How to Scan:</h3>
            <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">1</div>
                <p>Open your phone's camera app</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">2</div>
                <p>Point it at the QR code above</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">3</div>
                <p>Tap the notification that appears</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">4</div>
                <p>Enjoy Tea Spark on your phone!</p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
