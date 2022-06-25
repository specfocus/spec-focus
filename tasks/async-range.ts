import type { PullTask } from './types';

const asyncRange: PullTask<number, [number, number], never> =
  async function* ([min, max]) {
    for (let i = min; i < max; i++) {
      yield i;
    }
    return max;
  };

export default asyncRange;
