import React from 'react';
import Notification from './Notification';


const NotificationContainer = ({
  notifications = [],
  onRemove
}) => {
  if (!notifications.length) return null;

  return (
    <div className="fixed z-50 top-4 inset-x-0 flex justify-center pointer-events-none" role="status" aria-live="polite">
      <div className="w-full max-w-sm px-4 space-y-2 pointer-events-auto">
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            message={notification.message}
            type={notification.type}
            isVisible={notification.isVisible}
            autoCloseTime={notification.autoCloseTime}
            onClose={() => onRemove(notification.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default NotificationContainer;
