export type NotNull<T> = T extends null ? never : T;

export const isNull = (val: unknown): val is null => val === null;