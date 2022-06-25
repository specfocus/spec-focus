import type { SimpleRule } from './types';

const multiplication: SimpleRule<number, number[]> = (
  input: number[]
): number => input.reduce((acc, p) => acc * p, 1);

export default multiplication;