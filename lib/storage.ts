import localforage from 'localforage';
import { HealthDataEncryption } from './encryption';
import { AuditLogger } from './audit';

/**
 * Local-first data storage with encryption for sensitive data
 * Implements HIPAA-inspired architecture
 */
export class HealthDataStorage {
  private static readonly SENSITIVE_PREFIX = 'encrypted_';
  private static readonly NON_SENSITIVE_PREFIX = 'public_';

  /**
   * Initialize localForage with appropriate configuration
   */
  static initialize() {
    localforage.config({
      name: 'BloomFlow',
      storeName: 'health_data',
      description: 'Local-first health data storage',
    });
  }

  /**
   * Store sensitive health data (encrypted)
   */
  static async storeSensitive(key: string, data: any): Promise<void> {
    if (typeof window === 'undefined') return; // Skip on server
    
    const encrypted = await HealthDataEncryption.encrypt(data);
    const storageKey = `${this.SENSITIVE_PREFIX}${key}`;
    await localforage.setItem(storageKey, encrypted);
    
    // Log access for audit trail
    await AuditLogger.logAccess({
      action: 'store',
      dataType: 'sensitive',
      key,
      timestamp: new Date(),
    });
  }

  /**
   * Retrieve sensitive health data (decrypted)
   */
  static async getSensitive(key: string): Promise<any | null> {
    if (typeof window === 'undefined') return null; // Skip on server
    
    const storageKey = `${this.SENSITIVE_PREFIX}${key}`;
    const encrypted = await localforage.getItem<string>(storageKey);
    
    if (!encrypted) return null;

    // Log access for audit trail
    await AuditLogger.logAccess({
      action: 'retrieve',
      dataType: 'sensitive',
      key,
      timestamp: new Date(),
    });

    try {
      return await HealthDataEncryption.decrypt(encrypted);
    } catch (error) {
      console.error('Decryption error:', error);
      return null;
    }
  }

  /**
   * Store non-sensitive data (unencrypted)
   */
  static async storeNonSensitive(key: string, data: any): Promise<void> {
    if (typeof window === 'undefined') return; // Skip on server
    
    const storageKey = `${this.NON_SENSITIVE_PREFIX}${key}`;
    await localforage.setItem(storageKey, data);
    
    await AuditLogger.logAccess({
      action: 'store',
      dataType: 'non-sensitive',
      key,
      timestamp: new Date(),
    });
  }

  /**
   * Retrieve non-sensitive data
   */
  static async getNonSensitive(key: string): Promise<any | null> {
    if (typeof window === 'undefined') return null; // Skip on server
    
    const storageKey = `${this.NON_SENSITIVE_PREFIX}${key}`;
    const data = await localforage.getItem(storageKey);
    
    await AuditLogger.logAccess({
      action: 'retrieve',
      dataType: 'non-sensitive',
      key,
      timestamp: new Date(),
    });

    return data;
  }

  /**
   * Remove data
   */
  static async remove(key: string, isSensitive: boolean = false): Promise<void> {
    if (typeof window === 'undefined') return; // Skip on server
    
    const prefix = isSensitive ? this.SENSITIVE_PREFIX : this.NON_SENSITIVE_PREFIX;
    const storageKey = `${prefix}${key}`;
    await localforage.removeItem(storageKey);
    
    await AuditLogger.logAccess({
      action: 'delete',
      dataType: isSensitive ? 'sensitive' : 'non-sensitive',
      key,
      timestamp: new Date(),
    });
  }

  /**
   * Get all keys (for debugging/admin purposes)
   */
  static async getAllKeys(): Promise<string[]> {
    if (typeof window === 'undefined') return []; // Skip on server
    return await localforage.keys();
  }
}

// Initialize on module load
if (typeof window !== 'undefined') {
  HealthDataStorage.initialize();
}
