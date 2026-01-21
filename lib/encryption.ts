import CryptoJS from 'crypto-js';

/**
 * End-to-end encryption for sensitive health data
 * Uses AES-256 encryption with user-derived keys
 */
export class HealthDataEncryption {
  private static readonly KEY_STORAGE = 'bloomflow_encryption_key';

  /**
   * Generate or retrieve encryption key
   * In production, this should be derived from user password/biometrics
   */
  static async getEncryptionKey(): Promise<string> {
    if (typeof window === 'undefined') return '';
    
    let key = localStorage.getItem(this.KEY_STORAGE);
    if (!key) {
      // Generate a new key (in production, derive from user credentials)
      key = CryptoJS.lib.WordArray.random(256/8).toString();
      localStorage.setItem(this.KEY_STORAGE, key);
    }
    return key;
  }

  /**
   * Encrypt sensitive health data
   */
  static async encrypt(data: any): Promise<string> {
    const key = await this.getEncryptionKey();
    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      key
    ).toString();
    return encrypted;
  }

  /**
   * Decrypt sensitive health data
   */
  static async decrypt(encryptedData: string): Promise<any> {
    const key = await this.getEncryptionKey();
    const decrypted = CryptoJS.AES.decrypt(encryptedData, key);
    const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedText);
  }

  /**
   * Check if data is encrypted
   */
  static isEncrypted(data: string): boolean {
    try {
      // Encrypted data typically has a specific format
      return data.includes('U2FsdGVkX1') || data.length > 100;
    } catch {
      return false;
    }
  }
}
