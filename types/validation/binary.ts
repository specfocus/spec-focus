import { isString } from '../string';

export type BinaryValidation = (val: unknown, other: any) => boolean;

type ConstructorType<T = any> = new (...args: any[]) => T;

export const is = (type: ConstructorType | string, val: any) => (
  ![, null].includes(val) &&
  (isString(type) ? val.constructor.name === type : val.constructor === type)
);
/*
export const isContainedIn = (a: unknown[], b: unknown[]): boolean => {
  for (const v of new Set(a)) {
    if (
      !b.some((e) => e === v) ||
      a.filter((e) => e === v).length > b.filter((e) => e === v).length
    )
      return false;
  }
  return true;
};
*/
export const isSameDate = (dateA: Date, dateB: Date): boolean => (dateA.toISOString() === dateB.toISOString());