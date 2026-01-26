/**
 * Deep partial type for factory overrides
 * Allows overriding any nested field while keeping type safety
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? DeepPartial<U>[]
    : T[P] extends object | undefined
      ? DeepPartial<NonNullable<T[P]>>
      : T[P];
};

/**
 * Factory function type signature
 */
export type Factory<T> = (overrides?: DeepPartial<T>) => T;
