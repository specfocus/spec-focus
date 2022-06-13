import { SimpleValue } from '.';
import { isObject } from './object';
import { SimpleObject } from './simple';

const flatten = <T extends {} = SimpleObject>(
  src: T,
  path: string[] = []
): Record<string, SimpleValue | SimpleValue[]> =>
  Object.entries(src).reduce(
    (acc, [key, val]) => {
      if (isObject(val)) {
        return Object.assign(acc, flatten(val, [...path, key]));
      }
      return Object.assign(acc, { [[...path, key].join('.')]: val });
    },
    {}
  );

export default flatten;