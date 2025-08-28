// src/contexts/NotificationContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import Notification from '../components/common/Notification';

// Tipo só de tipagem (não existe em runtime)
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface NotificationContextProps {
  showNotification: (
    type: NotificationType,
    message: string,
    duration?: number
  ) => void;
  hideNotification: () => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(
  undefined
);

// eslint-disable-next-line react-refresh/only-export-components
export const useNotification = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotification must be used within a NotificationProvider');
  return ctx;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notification, setNotification] = useState<{
    type: NotificationType;
    message: string;
    isVisible: boolean;
    duration: number;
  }>({
    type: 'info',
    message: '',
    isVisible: false,
    duration: 5000,
  });

  const showNotification = (type: NotificationType, message: string, duration = 5000) => {
    setNotification({ type, message, isVisible: true, duration });
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, isVisible: false }));
  };

  return (
    <NotificationContext.Provider value={{ showNotification, hideNotification }}>
      {children}
      <Notification
        type={notification.type}
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={hideNotification}
        duration={notification.duration}
      />
    </NotificationContext.Provider>
  );
};
