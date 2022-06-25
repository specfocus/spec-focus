/**
 * Checks whether the type is void
 * @typeParam T - type which may be void
 * ```
 * IsAny<void> = true
 * IsAny<string> = false
 * ```
 */
 export type IsVoid<T> = [T] extends [void] ? true : false;