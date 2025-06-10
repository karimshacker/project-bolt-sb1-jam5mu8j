import React, { useRef, useEffect, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';
import { Camera, CameraOff } from 'lucide-react';

interface QRScannerProps {
  onScan: (result: string) => void;
  isActive: boolean;
}

export const QRScanner: React.FC<QRScannerProps> = ({ onScan, isActive }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const codeReader = useRef<BrowserMultiFormatReader | null>(null);
  const scanningTimeout = useRef<number | null>(null);

  useEffect(() => {
    if (isActive && !isScanning) {
      startScanning();
    } else if (!isActive && isScanning) {
      stopScanning();
    }

    return () => {
      stopScanning();
      if (scanningTimeout.current) {
        window.clearTimeout(scanningTimeout.current);
      }
    };
  }, [isActive]);

  const startScanning = async () => {
    try {
      setError(null);
      codeReader.current = new BrowserMultiFormatReader();
      
      const videoInputDevices = await codeReader.current.listVideoInputDevices();
      if (videoInputDevices.length === 0) {
        throw new Error('No camera found');
      }

      const selectedDeviceId = videoInputDevices[0].deviceId;
      
      if (videoRef.current) {
        setIsScanning(true);
        codeReader.current.decodeFromVideoDevice(
          selectedDeviceId,
          videoRef.current,
          (result, error) => {
            if (result) {
              // Stop scanning after successful scan
              stopScanning();
              onScan(result.getText());
            }
          }
        );

        // Set a timeout to stop scanning if it takes too long
        scanningTimeout.current = window.setTimeout(() => {
          if (isScanning) {
            stopScanning();
            setError('Scanning timed out. Please try again.');
          }
        }, 30000); // 30 seconds timeout
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start camera');
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    if (codeReader.current) {
      codeReader.current.reset();
      codeReader.current = null;
    }
    setIsScanning(false);
    if (scanningTimeout.current) {
      window.clearTimeout(scanningTimeout.current);
      scanningTimeout.current = null;
    }
  };

  if (!isActive) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-center mb-4">
          {isScanning ? (
            <Camera className="w-6 h-6 text-green-600 mr-2" />
          ) : (
            <CameraOff className="w-6 h-6 text-gray-400 mr-2" />
          )}
          <h2 className="text-lg font-semibold text-gray-900">
            {isScanning ? 'Scanning...' : 'Camera Ready'}
          </h2>
        </div>
        
        <div className="relative">
          <video
            ref={videoRef}
            className="w-full h-64 bg-gray-900 rounded-lg object-cover"
            playsInline
            muted
          />
          
          {/* Scanning overlay */}
          <div className="absolute inset-0 border-2 border-transparent rounded-lg">
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-indigo-500"></div>
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-indigo-500"></div>
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-indigo-500"></div>
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-indigo-500"></div>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <p className="text-sm text-gray-500 text-center mt-4">
          Position the QR code within the frame to scan
        </p>
      </div>
    </div>
  );
};