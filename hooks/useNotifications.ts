import { useState, useCallback } from "react";
import { NotificationProps } from "@/components/ui/Notification";

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);

  const addNotification = useCallback((notification: Omit<NotificationProps, "id" | "onClose">) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification: NotificationProps = {
      ...notification,
      id,
      onClose: () => removeNotification(id),
    };

    setNotifications(prev => [...prev, newNotification]);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const showSuccess = useCallback((title: string, message: string, duration?: number) => {
    addNotification({
      type: "success",
      title,
      message,
      duration,
    });
  }, [addNotification]);

  const showError = useCallback((title: string, message: string, duration?: number) => {
    addNotification({
      type: "error",
      title,
      message,
      duration,
    });
  }, [addNotification]);

  const showInfo = useCallback((title: string, message: string, duration?: number) => {
    addNotification({
      type: "info",
      title,
      message,
      duration,
    });
  }, [addNotification]);

  const showWarning = useCallback((title: string, message: string, duration?: number) => {
    addNotification({
      type: "warning",
      title,
      message,
      duration,
    });
  }, [addNotification]);

  return {
    notifications,
    addNotification,
    removeNotification,
    showSuccess,
    showError,
    showInfo,
    showWarning,
  };
}
