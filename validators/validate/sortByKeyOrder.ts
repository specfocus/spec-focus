import { ValidationError } from './error';

function findIndex(arr: string[], err: ValidationError) {
  let idx = Infinity;
  arr.some((key, ii) => {
    if (err.path?.indexOf(key) !== -1) {
      idx = ii;
      return true;
    }
  });

  return idx;
}

export default function sortByKeyOrder(keys: string[]) {
  return (a: ValidationError, b: ValidationError) => {
    return findIndex(keys, a) - findIndex(keys, b);
  };
}
