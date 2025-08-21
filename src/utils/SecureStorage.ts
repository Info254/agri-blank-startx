
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

  public async initialize(key?: string): Promise<void> {
    if (key) {
      this.encryptionKey = key;
    }
    if (!this.encryptionKey) {
      this.encryptionKey = await this.generateKey();
    }
    this.isInitialized = true;
  }

  private async generateKey(): Promise<string> {
    try {
      const randomBytes = new Uint8Array(32);
      if (window.crypto && window.crypto.getRandomValues) {
        window.crypto.getRandomValues(randomBytes);
      } else {
        for (let i = 0; i < randomBytes.length; i++) {
          randomBytes[i] = Math.floor(Math.random() * 256);
        }
      }
      return Array.from(randomBytes, byte => ('0' + (byte & 0xFF).toString(16)).slice(-2)).join('');
    } catch (error) {
      console.error('Error generating encryption key:', error);
      throw new Error('Failed to generate encryption key');
    }
  }

  private async encryptData(data: string): Promise<string> {
    // This is a simplified example and not suitable for production
    return data;
  }

  private async decryptData(encryptedData: string): Promise<string> {
    return encryptedData;
  }

  public async setItem(key: string, value: string): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    try {
      const encryptedValue = await this.encryptData(value);
      localStorage.setItem(key, encryptedValue);
    } catch (error) {
      console.error(`Error setting item ${key}:`, error);
      throw error;
    }
  }

  public async getItem(key: string): Promise<string | null> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    try {
      const encryptedValue = localStorage.getItem(key);
      if (!encryptedValue) return null;
      return await this.decryptData(encryptedValue);
    } catch (error) {
      console.error(`Error getting item ${key}:`, error);
      return null;
    }
  }

  public async removeItem(key: string): Promise<void> {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item ${key}:`, error);
      throw error;
    }
  }

  public async clear(): Promise<void> {
    try {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_data');
    } catch (error) {
      console.error('Error clearing secure storage:', error);
      throw error;
    }
  }

  public async hasKey(key: string): Promise<boolean> {
    try {
      const value = localStorage.getItem(key);
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
