// src/services/notificationService.ts
type NotificationSeverity = 'success' | 'error' | 'warning' | 'info';

let notificationFunction: ((message: string, severity: NotificationSeverity) => void) | null = null;
const notificationQueue: { message: string; severity: NotificationSeverity }[] = [];

export const registerNotification = (fn: typeof notificationFunction) => {
  notificationFunction = fn;
  // Process any queued notifications
  while (notificationQueue.length > 0 && notificationFunction) {
    const { message, severity } = notificationQueue.shift()!;
    notificationFunction(message, severity);
  }
};

export const unregisterNotification = () => {
  notificationFunction = null;
};

export const notify = (message: string, severity: NotificationSeverity = 'info') => {
  if (notificationFunction) {
    notificationFunction(message, severity);
  } else {
    // Queue the notification if service isn't ready
    notificationQueue.push({ message, severity });
    console.log(`[Notification Queued (${severity})]: ${message}`);
  }
};