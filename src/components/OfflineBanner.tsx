import React, { useEffect, useState } from 'react';

export const OfflineBanner: React.FC = () => {
  const [offline, setOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setOffline(false);
    const handleOffline = () => setOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!offline) return null;
  return (
    <div style={{ background: '#fbbf24', color: '#1f2937', padding: '8px', textAlign: 'center', position: 'fixed', top: 0, width: '100%', zIndex: 1000 }}>
      You are offline. Some features may be limited. Actions will sync when you reconnect.
    </div>
  );
};
