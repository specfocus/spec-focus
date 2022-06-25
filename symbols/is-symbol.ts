export const SYMBOL = 'symbol';

const isSymbol = (val: unknown): val is symbol => typeof val === SYMBOL;

export default isSymbol;