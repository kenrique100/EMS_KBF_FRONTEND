// src/services/notificationService.ts
let notificationFunction: (message: string, severity: 'success' | 'error' | 'warning' | 'info') => void;

export const registerNotification = (
  fn: typeof notificationFunction
) => {
  notificationFunction = fn;
};

export const notify = (
  message: string,
  severity: 'success' | 'error' | 'warning' | 'info' = 'info'
) => {
  if (notificationFunction) {
    notificationFunction(message, severity);
  } else {
    console.log(`[Notification ${severity}]: ${message}`);
  }
};
