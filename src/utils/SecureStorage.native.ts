import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import * as Crypto from 'expo-crypto';

// Key for encryption - in a real app, this should be securely managed
// and not hardcoded. Consider using environment variables or a secure key management service.
const ENCRYPTION_KEY = 'your-secure-encryption-key';

class SecureStorage {
  private static instance: SecureStorage;
  private encryptionKey: string;
  private isInitialized: boolean = false;

  private constructor() {
    this.encryptionKey = ENCRYPTION_KEY;
  }

  public static getInstance(): SecureStorage {
    if (!SecureStorage.instance) {
      SecureStorage.instance = new SecureStorage();
    }
    return SecureStorage.instance;
  }

  /**
   * Initialize the secure storage with an encryption key
   * @param key Optional custom encryption key
   */
  public async initialize(key?: string): Promise<void> {
    if (key) {
      this.encryptionKey = key;
    }
    
    // Generate a key derivation if needed
    if (!this.encryptionKey) {
      this.encryptionKey = await this.generateKey();
    }
    
    this.isInitialized = true;
  }

  /**
   * Generate a secure encryption key
   */
  private async generateKey(): Promise<string> {
    try {
      // Generate a secure random string
      const randomBytes = new Uint8Array(32);
      if (Platform.OS === 'web') {
        // Web implementation
        if (window.crypto && window.crypto.getRandomValues) {
          window.crypto.getRandomValues(randomBytes);
        } else {
          // Fallback for older browsers
          for (let i = 0; i < randomBytes.length; i++) {
            randomBytes[i] = Math.floor(Math.random() * 256);
          }
        }
      } else {
        // React Native implementation
        const randomValues = await Crypto.getRandomBytesAsync(32);
        randomValues.forEach((value: number, index: number) => {
          randomBytes[index] = value;
        });
      }
      
      return Array.from(randomBytes, byte => 
        ('0' + (byte & 0xFF).toString(16)).slice(-2)
      ).join('');
    } catch (error) {
      console.error('Error generating encryption key:', error);
      throw new Error('Failed to generate encryption key');
    }
  }

  /**
   * Encrypt data before storing
   */
  private async encryptData(data: string): Promise<string> {
    try {
      // In a real app, use a proper encryption library like expo-crypto
      // This is a simplified example and not suitable for production
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(data);
      const keyBuffer = encoder.encode(this.encryptionKey);
      
      // Simple XOR encryption (not secure, just for demonstration)
      const result = new Uint8Array(dataBuffer.length);
      for (let i = 0; i < dataBuffer.length; i++) {
        result[i] = dataBuffer[i] ^ keyBuffer[i % keyBuffer.length];
      }
      
      return Array.from(result, byte => 
        ('0' + (byte & 0xFF).toString(16)).slice(-2)
      ).join('');
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  /**
   * Decrypt data after retrieval
   */
  private async decryptData(encryptedData: string): Promise<string> {
    try {
      // Convert hex string back to bytes
      const bytes = new Uint8Array(encryptedData.match(/.{1,2}/g)!.map(byte => 
        parseInt(byte, 16)
      ));
      
      // Simple XOR decryption (matches the encryption)
      const encoder = new TextEncoder();
      const keyBuffer = encoder.encode(this.encryptionKey);
      const result = new Uint8Array(bytes.length);
      
      for (let i = 0; i < bytes.length; i++) {
        result[i] = bytes[i] ^ keyBuffer[i % keyBuffer.length];
      }
      
      return new TextDecoder().decode(result);
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  /**
   * Set a value in secure storage
   */
  public async setItem(key: string, value: string): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    try {
      const encryptedValue = await this.encryptData(value);
      await SecureStore.setItemAsync(key, encryptedValue);
    } catch (error) {
      console.error(`Error setting item ${key}:`, error);
      throw error;
    }
  }

  /**
   * Get a value from secure storage
   */
  public async getItem(key: string): Promise<string | null> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    try {
      const encryptedValue = await SecureStore.getItemAsync(key);
      if (!encryptedValue) return null;
      
      return await this.decryptData(encryptedValue);
    } catch (error) {
      console.error(`Error getting item ${key}:`, error);
      return null;
    }
  }

  /**
   * Remove a value from secure storage
   */
  public async removeItem(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error(`Error removing item ${key}:`, error);
      throw error;
    }
  }

  /**
   * Clear all items from secure storage
   */
  public async clear(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync('auth_token');
      await SecureStore.deleteItemAsync('refresh_token');
      await SecureStore.deleteItemAsync('user_data');
      // Add any other keys you want to clear
    } catch (error) {
      console.error('Error clearing secure storage:', error);
      throw error;
    }
  }

  /**
   * Check if a key exists in secure storage
   */
  public async hasKey(key: string): Promise<boolean> {
    try {
      const value = await SecureStore.getItemAsync(key);
      return value !== null;
    } catch (error) {
      console.error(`Error checking key ${key}:`, error);
      return false;
    }
  }
}

// Export a singleton instance
export const secureStorage = SecureStorage.getInstance();

export default secureStorage;
