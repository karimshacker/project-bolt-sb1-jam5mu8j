import React from 'react';
import { QrCode } from 'lucide-react';

interface ScanButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export const ScanButton: React.FC<ScanButtonProps> = ({ onClick, disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center space-x-3"
    >
      <QrCode className="w-6 h-6" />
      <span className="text-lg">Start Scanning</span>
    </button>
  );
};