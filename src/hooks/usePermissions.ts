import { useState, useEffect } from 'react';
import { checkPermission, requestPermission } from '../utils/permissions';

export const usePermission = (permission: 'camera' | 'location' | 'notifications' | 'storage' | 'contacts') => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    checkPermission(permission).then(setHasPermission);
  }, [permission]);

  const request = async () => {
    const granted = await requestPermission(permission);
    setHasPermission(granted);
    return granted;
  };

  return { hasPermission, request };
};
