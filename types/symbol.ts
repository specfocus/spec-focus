export const SYMBOL = "symbol";

export const isSymbol = (val: unknown): val is symbol => typeof val === SYMBOL;
