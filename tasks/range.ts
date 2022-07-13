import type { Task } from './types';

export const createRange: Task<number[], [number, number], never> = ([min, max]) => {
  const result = new Array(max - min);
  for (let i = 0; i < result.length; i++) {
    result[i] = min + i;
  }
  return result;
};

export const range: Task<Iterable<number>, [number, number], never> = function* ([min, max]) {
  for (let i = min; i < max; i++) {
    yield i;
  }
  return max;
};

export const pullRange: Task<AsyncIterable<number>, [number, number], never> = async function* ([min, max]) {
  for (let i = min; i < max; i++) {
    yield i;
  }
  return max;
};
