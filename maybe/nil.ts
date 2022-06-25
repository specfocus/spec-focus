export declare type Nil = null | undefined;

export const isNil = (val: unknown): val is Nil =>
  val === undefined || val === null || Number.isNaN(val);