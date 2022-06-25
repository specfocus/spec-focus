import type { SimpleRule } from './types';

const summation: SimpleRule<number, number[]> = (
  input: number[]
) => input.reduce((acc, s) => acc + s, 0);

export default summation;