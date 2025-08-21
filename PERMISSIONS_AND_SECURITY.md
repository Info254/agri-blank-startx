# Permissions and Security Implementation

This document outlines the implementation of runtime permissions, security features, and error handling in the Agri-Tender Connect application.

## Features Implemented

### 1. Runtime Permissions
- **PermissionService**: A singleton service to handle permission requests and checks
- **usePermission Hook**: A React hook for easy permission management in components
- **Permission Types**: Support for camera, location, notifications, storage, and contacts

### 2. Security Features
- **Secure Token Storage**: Using expo-secure-store for secure token storage
- **JWT Handling**: Token validation and refresh logic
- **Session Management**: Automatic session timeout and cleanup
- **Error Boundary**: Global error handling with user-friendly fallback UI

### 3. Offline Support
- Service worker with network-first and cache-first strategies
- Offline fallback page
- Background sync support (placeholder)

## Usage

### Requesting Permissions

```typescript
import { usePermission } from './hooks/usePermissions';

const CameraComponent = () => {
  const { hasPermission, request } = usePermission('camera');

  const handlePress = async () => {
    if (!hasPermission) {
      const granted = await request();
      if (!granted) return;
    }
    // Use the camera
  };

  return (
    <button onClick={handlePress}>
      {hasPermission ? 'Open Camera' : 'Request Camera Permission'}
    </button>
  );
};
```

### Secure Storage

```typescript
import { saveTokens, getToken, clearTokens } from './utils/security';

// Save tokens after login
await saveTokens(accessToken, refreshToken);

// Get the current access token
const token = await getToken();

// Clear tokens on logout
await clearTokens();
```

### Error Boundary

Wrap your app or specific components with the ErrorBoundary:

```tsx
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      {/* Your app content */}
    </ErrorBoundary>
  );
}
```

## Setup

1. Install required dependencies:
   ```bash
   npm install --legacy-peer-deps react-native-permissions expo-secure-store jwt-decode @react-native-community/hooks
   ```

2. For Android, add these permissions to `android/app/src/main/AndroidManifest.xml`:
   ```xml
   <uses-permission android:name="android.permission.CAMERA" />
   <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
   <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
   <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
   <uses-permission android:name="android.permission.READ_CONTACTS" />
   ```

3. For iOS, add these to `ios/YourApp/Info.plist`:
   ```xml
   <key>NSCameraUsageDescription</key>
   <string>We need access to your camera to take photos</string>
   <key>NSLocationWhenInUseUsageDescription</key>
   <string>We need access to your location to show nearby services</string>
   <key>NSPhotoLibraryUsageDescription</key>
   <string>We need access to your photos to upload images</string>
   <key>NSContactsUsageDescription</key>
   <string>We need access to your contacts to help you connect with others</string>
   ```

## Best Practices

1. Always check permissions before using device features
2. Handle permission denials gracefully
3. Provide clear explanations for why permissions are needed
4. Store sensitive data securely
5. Implement proper session management
6. Use the error boundary to catch and handle runtime errors

## Troubleshooting

- If you get React Native version conflicts, use `--legacy-peer-deps`
- For Android, make sure to request runtime permissions on Android 6.0 and above
- For iOS, ensure all required usage descriptions are in Info.plist
- Check the console for specific error messages when permission requests fail
