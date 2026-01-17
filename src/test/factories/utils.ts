import { DeepPartial } from './types';

/**
 * ID counters for deterministic test IDs
 */
const idCounters: Record<string, number> = {};

/**
 * Generate a deterministic test ID in NeTEx format
 * @param type - The entity type (e.g., 'Line', 'JourneyPattern')
 * @param authority - Optional authority prefix (defaults to 'TST')
 */
export const createTestId = (
  type: string,
  authority: string = 'TST',
): string => {
  if (!idCounters[type]) {
    idCounters[type] = 0;
  }
  idCounters[type]++;
  return `${authority}:${type}:${idCounters[type]}`;
};

/**
 * Reset all ID counters - call in beforeEach to ensure test isolation
 */
export const resetIdCounters = (): void => {
  Object.keys(idCounters).forEach((key) => {
    idCounters[key] = 0;
  });
};

/**
 * Generate a unique key for StopPoint (12-char hex)
 */
export const createStopPointKey = (): string => {
  const chars = '0123456789abcdef';
  let key = '';
  for (let i = 0; i < 12; i++) {
    key += chars[Math.floor(Math.random() * 16)];
  }
  return key;
};

/**
 * Deep merge source into target, handling arrays and nested objects
 */
export const deepMerge = <T extends object>(
  target: T,
  source: DeepPartial<T> | undefined,
): T => {
  if (!source) return target;

  const result = { ...target };

  for (const key in source) {
    const sourceValue = source[key as keyof typeof source];
    const targetValue = target[key as keyof T];

    if (sourceValue === undefined) {
      continue;
    }

    if (Array.isArray(sourceValue)) {
      // For arrays, replace entirely (don't merge)
      (result as Record<string, unknown>)[key] = sourceValue;
    } else if (
      sourceValue !== null &&
      typeof sourceValue === 'object' &&
      targetValue !== null &&
      typeof targetValue === 'object' &&
      !Array.isArray(targetValue)
    ) {
      // Recursively merge objects
      (result as Record<string, unknown>)[key] = deepMerge(
        targetValue as object,
        sourceValue as DeepPartial<object>,
      );
    } else {
      // Primitive or null - direct assignment
      (result as Record<string, unknown>)[key] = sourceValue;
    }
  }

  return result;
};

/**
 * Create a time string in HH:mm:ss format
 */
export const createTime = (
  hours: number,
  minutes: number,
  seconds: number = 0,
): string => {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};

/**
 * Create an ISO date string (YYYY-MM-DD) offset from today
 */
export const createDate = (daysFromNow: number = 0): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
};
