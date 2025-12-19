import React from 'react';
import { X } from 'lucide-react';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
  message: string;
  type?: AlertType;
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({ 
  message, 
  type = 'success', 
  onClose 
}) => {
  const types: Record<AlertType, string> = {
    success: 'bg-green-100 text-green-800 border-green-500',
    error: 'bg-red-100 text-red-800 border-red-500',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-500',
    info: 'bg-blue-100 text-blue-800 border-blue-500'
  };

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg border-l-4 shadow-lg ${types[type]} flex items-center justify-between gap-4 min-w-80`}>
      <span>{message}</span>
      {onClose && (
        <button onClick={onClose} className="hover:opacity-70">
          <X size={20} />
        </button>
      )}
    </div>
  );
};