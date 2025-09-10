// @ts-nocheck
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

class PermissionService {
  private static instance: PermissionService;

  private constructor() {}

  public static getInstance(): PermissionService {
    if (!PermissionService.instance) {
      PermissionService.instance = new PermissionService();
    }
    return PermissionService.instance;
  }

  public async requestPermission(permission: string): Promise<boolean> {
    try {
      let permissionType: any;

      if (Platform.OS === 'ios') {
        permissionType = (PERMISSIONS.IOS as any)[permission];
      } else {
        permissionType = (PERMISSIONS.ANDROID as any)[permission];
      }

      if (!permissionType) {
        console.warn(`Permission ${permission} not found`);
        return false;
      }

      const status = await check(permissionType);
      
      if (status === RESULTS.GRANTED) {
        return true;
      }

      if (status === RESULTS.DENIED) {
        const result = await request(permissionType);
        return result === RESULTS.GRANTED;
      }

      if (status === RESULTS.BLOCKED) {
        this.showSettingsAlert(permission);
        return false;
      }

      return false;
    } catch (error) {
      console.error('Error requesting permission:', error);
      return false;
    }
  }

  private showSettingsAlert(permission: string) {
    Alert.alert(
      'Permission Required',
      `Please enable ${permission} in settings to use this feature.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open Settings', onPress: () => this.openSettings() }
      ]
    );
  }

  private openSettings() {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      Linking.openSettings();
    }
  }
}

export default PermissionService.getInstance();
