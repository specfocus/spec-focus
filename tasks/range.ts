import type { Task } from './types';

const range: Task<number[], [number, number], never> = ([min, max]) => {
  const result = new Array(max - min);
  for (let i = 0; i < result.length; i++) {
    result[i] = min + i;
  }
  return result;
};

export default range;
