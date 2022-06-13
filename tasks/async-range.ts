import type { AsyncSimpleTask } from './types';

const asyncRange: AsyncSimpleTask<number, [number, number]> = async function* ([min, max]) {
  for (let i = min; i < max; i++) {
    yield i;
  }
  return max;
};

export default asyncRange;
