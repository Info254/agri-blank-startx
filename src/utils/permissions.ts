import { Platform } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

type PermissionType = 'camera' | 'location' | 'notifications' | 'storage' | 'contacts';

const getPlatformPermissions = (permission: PermissionType) => {
  if (Platform.OS === 'ios') {
    return {
      camera: PERMISSIONS.IOS.CAMERA,
      location: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      notifications: PERMISSIONS.IOS.NOTIFICATIONS,
      storage: PERMISSIONS.IOS.PHOTO_LIBRARY,
      contacts: PERMISSIONS.IOS.CONTACTS,
    }[permission];
  } else {
    return {
      camera: PERMISSIONS.ANDROID.CAMERA,
      location: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      notifications: PERMISSIONS.ANDROID.POST_NOTIFICATIONS,
      storage: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      contacts: PERMISSIONS.ANDROID.READ_CONTACTS,
    }[permission];
  }
};

export const checkPermission = async (permission: PermissionType): Promise<boolean> => {
  try {
    const permissionType = getPlatformPermissions(permission);
    if (!permissionType) return false;
    
    const result = await check(permissionType);
    return result === RESULTS.GRANTED;
  } catch (error) {
    console.error('Error checking permission:', error);
    return false;
  }
};

export const requestPermission = async (permission: PermissionType): Promise<boolean> => {
  try {
    const permissionType = getPlatformPermissions(permission);
    if (!permissionType) return false;
    
    const result = await request(permissionType);
    return result === RESULTS.GRANTED;
  } catch (error) {
    console.error('Error requesting permission:', error);
    return false;
  }
};

export const showPermissionRationale = async (
  permission: PermissionType,
  title: string,
  message: string,
  buttonText: string = 'OK'
): Promise<boolean> => {
  console.log(`${title}: ${message}`);
  return requestPermission(permission);
};

export const ensurePermission = async (
  permission: PermissionType,
  rationale?: { title: string; message: string; buttonText?: string }
): Promise<boolean> => {
  const hasPermission = await checkPermission(permission);
  if (hasPermission) return true;
  
  if (rationale) {
    return showPermissionRationale(
      permission,
      rationale.title,
      rationale.message,
      rationale.buttonText
    );
  }
  
  return requestPermission(permission);
};
