
/**
 * Mobile App Configuration
 * Ensures compliance with Android and iOS requirements
 */

export const MOBILE_CONFIG = {
  // App Store Metadata
  metadata: {
    version: '2.1.0',
    buildNumber: '1',
    minimumOSVersion: {
      android: '7.0', // API Level 24
      ios: '12.0'
    },
    targetSDK: {
      android: 34, // Android 14
      ios: '17.0'
    }
  },
  
  // Performance Optimizations
  performance: {
    enableServiceWorker: true,
    enablePWA: true,
    enableCodeSplitting: true,
    enableImageOptimization: true,
    enableOfflineMode: true,
    maxBundleSize: '2MB',
    initialLoadTarget: '3s'
  },
  
  // Security Configuration
  security: {
    enforceHTTPS: true,
    enableAppTransportSecurity: true,
    enableNetworkSecurityConfig: true,
    certificatePinning: false, // Set to true in production
    biometricAuth: false // Future feature
  },
  
  // Feature Flags
  features: {
    pushNotifications: true,
    backgroundSync: true,
    geolocation: true,
    camera: false,
    fileSystem: true,
    deviceInfo: true,
    networkInfo: true,
    statusBar: true,
    splashScreen: true
  },
  
  // Accessibility
  accessibility: {
    minimumTouchTarget: '44px',
    colorContrast: 'AAA',
    screenReaderSupport: true,
    keyboardNavigation: true,
    focusManagement: true,
    semanticMarkup: true
  },
  
  // Internationalization
  i18n: {
    defaultLanguage: 'en',
    supportedLanguages: [
      'en', 'sw', 'ki', 'luo', 'kln', 'kam', 'mas', 'mer'
    ],
    rtlSupport: false,
    currencyFormat: 'KES',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: 'en-KE'
  }
};

// App Store Guidelines Compliance
export const STORE_COMPLIANCE = {
  android: {
    targetAPI: 34,
    compileSdkVersion: 34,
    minSdkVersion: 24,
    permissions: [
      'INTERNET',
      'ACCESS_NETWORK_STATE',
      'ACCESS_FINE_LOCATION',
      'ACCESS_COARSE_LOCATION',
      'RECORD_AUDIO',
      'WRITE_EXTERNAL_STORAGE',
      'READ_EXTERNAL_STORAGE',
      'CAMERA'
    ],
    features: [
      'android.hardware.telephony',
      'android.hardware.location',
      'android.hardware.microphone'
    ]
  },
  
  ios: {
    deploymentTarget: '12.0',
    capabilities: [
      'com.apple.developer.networking.wifi-info',
      'com.apple.developer.location.push'
    ],
    permissions: [
      'NSLocationWhenInUseUsageDescription',
      'NSMicrophoneUsageDescription',
      'NSCameraUsageDescription',
      'NSPhotoLibraryUsageDescription'
    ]
  }
};
