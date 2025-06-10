import React from 'react';
import { XCircle, AlertTriangle, RotateCcw } from 'lucide-react';

interface NotVerifiedPersonProps {
  scannedId: string;
  onContinueScanning: () => void;
}

export const NotVerifiedPerson: React.FC<NotVerifiedPersonProps> = ({ 
  scannedId, 
  onContinueScanning 
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-red-500 to-rose-600 p-6 text-white text-center">
        <XCircle className="w-16 h-16 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Not Verified</h2>
        <p className="text-red-100">Identity could not be confirmed</p>
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-center mb-6">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-red-500" />
          </div>
        </div>
        
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Unknown Identity
          </h3>
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-600 mb-1">Scanned ID:</p>
            <p className="font-mono text-sm text-gray-900 break-all">{scannedId}</p>
          </div>
          <p className="text-sm text-gray-600">
            This QR code is not recognized in our system. Please verify the code and try again.
          </p>
        </div>
        
        <button
          onClick={onContinueScanning}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Try Again</span>
        </button>
      </div>
    </div>
  );
};