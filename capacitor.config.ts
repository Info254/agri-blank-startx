import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.agriconnect.app',
  appName: 'agri-connect',
  webDir: 'dist',
  server: {
    url: 'https://bea16074-9ea3-4b44-b46c-e3f827ec5e81.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: false
    }
  }
};

export default config;
