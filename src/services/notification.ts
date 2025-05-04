interface NotificationOptions {
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

export const notification = {
  show: (message: string, options: NotificationOptions = {}) => {
    const { type = 'info', duration = 3000 } = options;

    // 在這裡可以使用任何通知庫，例如 toast
    console.log(`[${type.toUpperCase()}] ${message}`);

    // 模擬通知消失
    setTimeout(() => {
      console.log(`Notification dismissed: ${message}`);
    }, duration);
  },
};
