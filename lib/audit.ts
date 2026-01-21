import localforage from 'localforage';

export interface AuditLogEntry {
  id: string;
  action: 'store' | 'retrieve' | 'delete' | 'share' | 'consent';
  dataType: 'sensitive' | 'non-sensitive';
  key: string;
  timestamp: Date;
  userId?: string;
  details?: Record<string, any>;
}

/**
 * Audit trail system for all data access
 * HIPAA-inspired compliance tracking
 */
export class AuditLogger {
  private static readonly AUDIT_STORAGE = 'audit_logs';
  private static readonly MAX_LOGS = 10000; // Keep last 10k entries

  /**
   * Log an access event
   */
  static async logAccess(entry: Omit<AuditLogEntry, 'id'>): Promise<void> {
    if (typeof window === 'undefined') return; // Skip on server
    
    const logs = await this.getLogs();
    const newEntry: AuditLogEntry = {
      ...entry,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
      timestamp: entry.timestamp || new Date(),
    };

    logs.push(newEntry);

    // Keep only the most recent logs
    if (logs.length > this.MAX_LOGS) {
      logs.splice(0, logs.length - this.MAX_LOGS);
    }

    await localforage.setItem(this.AUDIT_STORAGE, logs);
  }

  /**
   * Get all audit logs
   */
  static async getLogs(): Promise<AuditLogEntry[]> {
    const logs = await localforage.getItem<any[]>(this.AUDIT_STORAGE);
    if (!logs) return [];
    // Convert timestamp strings back to Date objects
    return logs.map(log => ({
      ...log,
      timestamp: log.timestamp instanceof Date ? log.timestamp : new Date(log.timestamp),
    }));
  }

  /**
   * Get logs filtered by criteria
   */
  static async getFilteredLogs(filters: {
    action?: AuditLogEntry['action'];
    dataType?: AuditLogEntry['dataType'];
    key?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<AuditLogEntry[]> {
    if (typeof window === 'undefined') return []; // Skip on server
    
    const logs = await this.getLogs();
    return logs.filter(log => {
      if (filters.action && log.action !== filters.action) return false;
      if (filters.dataType && log.dataType !== filters.dataType) return false;
      if (filters.key && log.key !== filters.key) return false;
      if (filters.startDate && log.timestamp < filters.startDate) return false;
      if (filters.endDate && log.timestamp > filters.endDate) return false;
      return true;
    });
  }

  /**
   * Export audit logs (for compliance reporting)
   */
  static async exportLogs(): Promise<string> {
    if (typeof window === 'undefined') return '[]'; // Skip on server
    const logs = await this.getLogs();
    return JSON.stringify(logs, null, 2);
  }

  /**
   * Clear old logs (older than specified days)
   */
  static async clearOldLogs(daysToKeep: number = 365): Promise<void> {
    if (typeof window === 'undefined') return; // Skip on server
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
    
    const logs = await this.getLogs();
    const filteredLogs = logs.filter(log => log.timestamp >= cutoffDate);
    
    await localforage.setItem(this.AUDIT_STORAGE, filteredLogs);
  }
}
