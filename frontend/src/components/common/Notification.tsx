import React, { useState, useEffect } from 'react';
import { FiX, FiCheck, FiInfo, FiAlertTriangle } from 'react-icons/fi';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface NotificationProps {
  type: NotificationType;
  message: string;
  isVisible: boolean;
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
}

const Notification: React.FC<NotificationProps> = ({
  type,
  message,
  isVisible,
  onClose,
  autoClose = true,
  duration = 5000
}) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isVisible && autoClose) {
      const timer = setTimeout(() => {
        setIsClosing(true);
        setTimeout(onClose, 300); // Tempo para a animação de saída
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, autoClose, duration, onClose]);

  if (!isVisible) return null;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300);
  };

  const typeConfig = {
    success: {
      icon: <FiCheck className="w-5 h-5" />,
      bgColor: 'bg-green-100 dark:bg-green-900 dark:bg-opacity-20',
      textColor: 'text-green-800 dark:text-green-300',
      borderColor: 'border-green-400 dark:border-green-700'
    },
    error: {
      icon: <FiX className="w-5 h-5" />,
      bgColor: 'bg-red-100 dark:bg-red-900 dark:bg-opacity-20',
      textColor: 'text-red-800 dark:text-red-300',
      borderColor: 'border-red-400 dark:border-red-700'
    },
    info: {
      icon: <FiInfo className="w-5 h-5" />,
      bgColor: 'bg-blue-100 dark:bg-blue-900 dark:bg-opacity-20',
      textColor: 'text-blue-800 dark:text-blue-300',
      borderColor: 'border-blue-400 dark:border-blue-700'
    },
    warning: {
      icon: <FiAlertTriangle className="w-5 h-5" />,
      bgColor: 'bg-yellow-100 dark:bg-yellow-900 dark:bg-opacity-20',
      textColor: 'text-yellow-800 dark:text-yellow-300',
      borderColor: 'border-yellow-400 dark:border-yellow-700'
    }
  };

  const config = typeConfig[type];

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-center p-4 mb-4 rounded-lg border ${config.bgColor} ${config.textColor} ${config.borderColor} transition-all duration-300 ${isClosing ? 'opacity-0 translate-x-full' : 'opacity-100'}`}
      role="alert"
    >
      <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg">
        {config.icon}
      </div>
      <div className="ml-3 text-sm font-normal">{message}</div>
      <button
        type="button"
        className={`ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex h-8 w-8 ${config.textColor} hover:bg-gray-200 dark:hover:bg-gray-700`}
        onClick={handleClose}
        aria-label="Fechar"
      >
        <span className="sr-only">Fechar</span>
        <FiX className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Notification;