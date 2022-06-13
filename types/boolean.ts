export const BOOLEAN = "boolean";

export type BooleanType = typeof BOOLEAN;

export const isBoolean = (val: unknown): val is boolean =>
  val instanceof Object && val.constructor === Boolean ||
  val instanceof Boolean || typeof val === BOOLEAN;