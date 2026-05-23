'use client';

import React, { useState, useRef } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { Camera, X, QrCode, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

interface QRScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (data: string) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ isOpen, onClose, onScan }) => {
  const [isScanning, setIsScanning] = useState(true);
  const [lastScanned, setLastScanned] = useState<string | null>(null);
  const [scanSuccess, setScanSuccess] = useState(false);

  const handleScan = (detectedCodes: any[]) => {
    if (detectedCodes && detectedCodes.length > 0) {
      const result = detectedCodes[0].rawValue;
      if (result && result !== lastScanned) {
        setLastScanned(result);
        setScanSuccess(true);
        setIsScanning(false);
        
        // Show success feedback
        toast.success('QR Code scanned successfully!', {
          duration: 2000,
          position: 'top-center',
        });
        
        // Call the onScan callback
        onScan(result);
        
        // Reset after a delay
        setTimeout(() => {
          setScanSuccess(false);
          setLastScanned(null);
          onClose();
        }, 2000);
      }
    }
  };

  const handleError = (error: any) => {
    console.error('QR Scanner Error:', error);
    toast.error('Failed to scan QR code. Please try again.', {
      duration: 3000,
      position: 'top-center',
    });
  };

  const resetScanner = () => {
    setLastScanned(null);
    setScanSuccess(false);
    setIsScanning(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full mx-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 rounded-full p-2">
                  <QrCode className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Scan QR Code</h3>
                  <p className="text-sm text-gray-500">Align the QR code within the frame</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scanner Container */}
            <div className="relative bg-gray-900 rounded-xl overflow-hidden mb-4" style={{ aspectRatio: '1' }}>
              {isScanning && !scanSuccess ? (
                <>
                  <Scanner
                    onScan={handleScan}
                    onError={handleError}
                    styles={{
                      container: {
                        width: '100%',
                        height: '100%',
                      },
                      video: {
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '0.75rem',
                      }
                    }}
                  />
                  
                  {/* Scanning Overlay */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-4 border-2 border-green-400 rounded-lg">
                      <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-400 rounded-tl-lg"></div>
                      <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-400 rounded-tr-lg"></div>
                      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-400 rounded-bl-lg"></div>
                      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-400 rounded-br-lg"></div>
                    </div>
                    
                    {/* Scanning Line Animation */}
                    <div className="absolute top-4 left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent animate-pulse"></div>
                  </div>
                </>
              ) : scanSuccess ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 20 }}
                    className="bg-green-100 rounded-full p-6 mb-4"
                  >
                    <CheckCircle className="w-16 h-16 text-green-600" />
                  </motion.div>
                  <p className="text-white text-lg font-semibold mb-2">Scan Successful!</p>
                  <p className="text-gray-300 text-sm text-center px-4">
                    QR code has been scanned and processed
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <Camera className="w-16 h-16 text-gray-400 mb-4" />
                  <p className="text-gray-400 text-center px-4">
                    Camera access required for QR scanning
                  </p>
                  <button
                    onClick={resetScanner}
                    className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">How to scan:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Position QR code within the frame</li>
                <li>• Ensure good lighting and steady hand</li>
                <li>• Keep the camera at appropriate distance</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex space-x-3 mt-4">
              <button
                onClick={resetScanner}
                disabled={isScanning && !scanSuccess}
                className="flex-1 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors"
              >
                Reset
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-gray-900 hover:bg-gray-800 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QRScanner;
