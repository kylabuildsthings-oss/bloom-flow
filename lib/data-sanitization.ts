/**
 * Data Sanitization Utilities
 * Ensures sensitive health data is never exposed in DOM or console
 */

const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Sanitize data for display in UI (removes sensitive fields)
 */
export function sanitizeForDisplay<T extends Record<string, any>>(data: T): Partial<T> {
  const sensitiveFields = [
    'id',
    'userId',
    'email',
    'phone',
    'address',
    'fullName',
    'dateOfBirth',
    'ssn',
    'medicalRecordNumber',
    'rawData',
    'encryptedData',
    'symptoms',
    'cycleData',
    'healthMetrics',
  ];

  const sanitized = { ...data };
  
  sensitiveFields.forEach(field => {
    if (field in sanitized) {
      delete sanitized[field];
    }
  });

  // Remove nested sensitive data
  Object.keys(sanitized).forEach(key => {
    if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      sanitized[key] = sanitizeForDisplay(sanitized[key]);
    }
  });

  return sanitized;
}

/**
 * Sanitize data for console logging (only in development)
 */
export function sanitizeForLogging<T extends Record<string, any>>(
  data: T | undefined,
  allowInDev: boolean = false
): T | { sanitized: true } | undefined {
  if (!data) return undefined;
  
  if (!isDevelopment || !allowInDev) {
    return { sanitized: true } as T;
  }

  return sanitizeForDisplay(data) as T;
}

/**
 * Create a safe display value from sensitive data
 */
export function createDisplayValue(value: any, type: 'metric' | 'date' | 'count' | 'percentage'): string {
  if (value === null || value === undefined) {
    return '—';
  }

  switch (type) {
    case 'metric':
      return typeof value === 'number' ? value.toFixed(1) : String(value);
    case 'date':
      if (value instanceof Date) {
        return value.toLocaleDateString();
      }
      return String(value);
    case 'count':
      return String(value);
    case 'percentage':
      return typeof value === 'number' ? `${(value * 100).toFixed(1)}%` : String(value);
    default:
      return '—';
  }
}

/**
 * Check if a value contains sensitive data
 */
export function containsSensitiveData(value: any): boolean {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const sensitivePatterns = [
    /email/i,
    /phone/i,
    /address/i,
    /ssn/i,
    /password/i,
    /token/i,
    /secret/i,
    /key/i,
  ];

  const keys = Object.keys(value);
  return keys.some(key => 
    sensitivePatterns.some(pattern => pattern.test(key))
  );
}

/**
 * Safe stringify for debugging (removes sensitive data)
 */
export function safeStringify(obj: any, space?: number): string {
  try {
    const sanitized = sanitizeForDisplay(obj);
    return JSON.stringify(sanitized, null, space);
  } catch {
    return '[Unable to stringify]';
  }
}
