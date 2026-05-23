'use client';

import React, { useState } from 'react';
import { QrCode } from 'lucide-react';
import QRScanner from './QRScanner';
import toast from 'react-hot-toast';

const QRScannerWrapper: React.FC = () => {
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const handleScan = (data: string) => {
    // Handle QR code scan result
    console.log('QR Code scanned:', data);
    
    // You can process the QR code data here
    // For example, if it contains tea information or a URL
    if (data.includes('tea-spark') || data.includes('tea')) {
      toast.success('Tea QR code detected! Opening chat...', {
        duration: 3000,
        position: 'top-center',
      });
      // You could trigger the chat to open with specific context
    } else {
      toast.success('QR code scanned successfully!', {
        duration: 2000,
        position: 'top-center',
      });
    }
  };

  return (
    <>
      {/* QR Scanner Toggle Button - More subtle positioning */}
      <button
        onClick={() => setIsScannerOpen(true)}
        className="fixed top-24 right-6 bg-purple-600 hover:bg-purple-700 text-white rounded-full p-3 shadow-lg z-40 transition-all duration-300 hover:scale-110"
        title="Scan QR Code"
      >
        <QrCode size={20} />
      </button>

      {/* QR Scanner Component */}
      <QRScanner 
        isOpen={isScannerOpen} 
        onClose={() => setIsScannerOpen(false)} 
        onScan={handleScan}
      />
    </>
  );
};

export default QRScannerWrapper;
