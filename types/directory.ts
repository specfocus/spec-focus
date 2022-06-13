
import { isArray } from './array';
import { isObject } from "./object";

type ValueType = bigint | boolean | number | string | symbol;
type NonObject = ValueType | unknown[];

export interface Directory<Terminal extends NonObject> {
  [key: string]: Terminal | Directory<Terminal>;
}

export const reduce = <Terminal extends NonObject>(
  directory: Directory<Terminal>
): Record<string, Terminal> =>
  Object.entries(directory).reduce<Record<string, Terminal>>(
    (result, [left, val]) =>
      !isObject(val) || isArray(val)
        ? Object.assign(result, { [left]: val })
        : Object.entries(reduce(val)).reduce(
            (acc, [right, terminal]) =>
              Object.assign(acc, { [[left, right].join(".")]: terminal }),
            result
          ),
    {}
  );
