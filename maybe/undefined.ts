/**
 * Checks whether the type is undefined
 * @typeParam T - type which may be undefined
 * ```
 * IsAny<undefined> = true
 * IsAny<string> = false
 * ```
 */
 export declare type IsUndefined<T> = [T] extends [undefined] ? true : false;

 export declare type NonUndefined<T> = T extends undefined ? never : T;

export const isUndefined = (val: unknown): val is undefined =>
  val === undefined;