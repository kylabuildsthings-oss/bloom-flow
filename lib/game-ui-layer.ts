/**
 * Game UI Layer Utilities
 * Ensures game elements are purely visual and don't expose sensitive data
 */

import { createDisplayValue, sanitizeForDisplay } from './data-sanitization';

/**
 * Create safe display props for game UI components
 * Only includes visual/display data, never raw sensitive data
 */
export function createGameUIDisplayProps(data: {
  value?: number | string | null;
  label?: string;
  icon?: string;
  color?: string;
  level?: number;
  percentage?: number;
}) {
  return {
    // Only safe display values
    displayValue: data.value !== null && data.value !== undefined 
      ? createDisplayValue(data.value, typeof data.value === 'number' ? 'metric' : 'count')
      : '—',
    label: data.label || '',
    icon: data.icon || '📊',
    color: data.color || 'primary',
    level: typeof data.level === 'number' ? Math.max(0, Math.min(5, Math.floor(data.level))) : 0,
    percentage: typeof data.percentage === 'number' 
      ? Math.max(0, Math.min(100, Math.round(data.percentage))) 
      : 0,
    // Never include raw data
  };
}

/**
 * Create safe props for plant visualization
 * Only includes visual representation data
 */
export function createPlantDisplayProps(metric: {
  name: string;
  value?: number;
  trend?: 'up' | 'down' | 'stable';
  lastUpdate?: Date;
}) {
  // Calculate visual level from value (0-4 for growth stages)
  const level = metric.value !== undefined && metric.value !== null
    ? Math.min(4, Math.max(0, Math.floor((metric.value / 10) * 4)))
    : 0;

  return {
    name: metric.name,
    level,
    trend: metric.trend || 'stable',
    lastUpdateDisplay: metric.lastUpdate 
      ? metric.lastUpdate.toLocaleDateString() 
      : 'Never',
    // Never include raw value or sensitive data
  };
}

/**
 * Create safe props for factory task visualization
 * Only includes visual representation data
 */
export function createTaskDisplayProps(task: {
  id?: string;
  title?: string;
  status?: 'pending' | 'in-progress' | 'completed';
  priority?: number;
}) {
  return {
    // Use hash or index instead of actual ID
    visualId: task.id ? `task_${task.id.slice(0, 8)}` : 'task_unknown',
    displayTitle: task.title ? task.title.substring(0, 30) : 'Task',
    status: task.status || 'pending',
    priorityLevel: typeof task.priority === 'number' 
      ? Math.max(1, Math.min(5, Math.floor(task.priority / 20))) 
      : 1,
    // Never include raw task data or IDs
  };
}

/**
 * Verify a component only uses safe display props
 */
export function isSafeForGameUI(props: Record<string, any>): boolean {
  const unsafeKeys = [
    'rawData',
    'sensitiveData',
    'userData',
    'healthData',
    'cycleData',
    'symptoms',
    'email',
    'phone',
    'id',
    'userId',
  ];

  return !unsafeKeys.some(key => 
    props.hasOwnProperty(key) && 
    props[key] !== null && 
    props[key] !== undefined
  );
}

/**
 * Create a safe data attribute value (for UI purposes only)
 */
export function createSafeDataAttribute(key: string, value: any): string {
  // Only allow safe, non-sensitive attributes
  const safeKeys = ['zone', 'level', 'status', 'type', 'variant', 'theme'];
  
  if (!safeKeys.includes(key)) {
    return '';
  }

  // Convert value to safe string
  if (typeof value === 'string') {
    // Remove any potentially sensitive patterns
    return value.replace(/[^a-zA-Z0-9_-]/g, '').substring(0, 50);
  }

  if (typeof value === 'number') {
    return String(Math.max(0, Math.min(999, Math.floor(value))));
  }

  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }

  return '';
}
